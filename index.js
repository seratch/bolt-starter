// `cp _env .env` then modify it
// See https://github.com/motdotla/dotenv
const config = require("dotenv").config().parsed;
// Overwrite env variables anyways
for (const k in config) {
  process.env[k] = config[k];
}

const { LogLevel, ConsoleLogger } = require("@slack/logger");
const logLevel = process.env.SLACK_LOG_LEVEL || LogLevel.DEBUG;
const logger = new ConsoleLogger();
logger.setLevel(logLevel);

const { App, ExpressReceiver } = require("@slack/bolt");
// Manually instantiate to add external routes afterwards
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
const app = new App({
  logger: logger,
  logLevel: logLevel,
  token: process.env.SLACK_BOT_TOKEN,
  receiver: receiver
});

// ---------------------------------------------------------------
// Start coding here..
// see https://slack.dev/bolt/

// https://api.slack.com/apps/{APP_ID}/event-subscriptions
app.event("app_mention", ({ event, say }) => {
  logger.debug(
    "app_mention event payload:\n\n" + JSON.stringify(event, null, 2) + "\n"
  );
  say({
    channel: event.channel,
    text: `:wave: <@${event.user}> Hi there!`
  });
});

// https://api.slack.com/apps/{APP_ID}/slash-commands
// https://api.slack.com/apps/{APP_ID}/interactive-messages
app.command("/open-modal", ({ ack, body, context }) => {
  app.client.views
    .open({
      "token": context.botToken,
      "trigger_id": body.trigger_id,
      // Block Kit Builder - http://j.mp/bolt-starter-modal-json
      "view": {
        "type": "modal",
        "callback_id": "task-modal",
        "private_metadata": JSON.stringify(body), // Remove this when pasting this in Block Kit Builder
        "title": {
          "type": "plain_text",
          "text": "Create a task",
          "emoji": true
        },
        "submit": {
          "type": "plain_text",
          "text": "Submit",
          "emoji": true
        },
        "close": {
          "type": "plain_text",
          "text": "Cancel",
          "emoji": true
        },
        "blocks": [
          {
            "type": "input",
            "block_id": "input-title",
            "element": {
              "type": "plain_text_input",
              "action_id": "input",
              "initial_value": body.text // Remove this when pasting this in Block Kit Builder
            },
            "label": {
              "type": "plain_text",
              "text": "Title",
              "emoji": true
            },
            "optional": false
          },
          {
            "type": "input",
            "block_id": "input-deadline",
            "element": {
              "type": "datepicker",
              "action_id": "input",
              "placeholder": {
                "type": "plain_text",
                "text": "Select a date",
                "emoji": true
              }
            },
            "label": {
              "type": "plain_text",
              "text": "Deadline",
              "emoji": true
            },
            "optional": true
          },
          {
            "type": "input",
            "block_id": "input-description",
            "element": {
              "type": "plain_text_input",
              "action_id": "input",
              "multiline": true
            },
            "label": {
              "type": "plain_text",
              "text": "Description",
              "emoji": true
            },
            "optional": true
          }
        ]
      }
    })
    .then(res => {
      logger.debug(
        "views.open response:\n\n" + JSON.stringify(res, null, 2) + "\n"
      );
      ack();
    })
    .catch(e => {
      logger.error("views.open error:\n\n" + JSON.stringify(e, null, 2) + "\n");
      ack(`:x: Failed to open a modal due to *${e.code}* ...`);
    });
});

app.view("task-modal", async ({ body, ack }) => {
  logger.debug(
    "view_submission view payload:\n\n" +
    JSON.stringify(body.view, null, 2) +
    "\n"
  );

  const stateValues = body.view.state.values;
  const title = stateValues["input-title"]["input"].value;
  const deadline = stateValues["input-deadline"]["input"].selected_date;
  const description = stateValues["input-description"]["input"].value;

  const errors = {};
  if (title.length <= 5) {
    errors["input-title"] = "Title must be longer than 5 characters";
  }
  if (Object.entries(errors).length > 0) {
    ack({
      response_action: "errors",
      errors: errors
    });
  } else {
    // Save the input to somewhere
    logger.info(
      `Valid response:\ntitle: ${title}\ndeadline: ${deadline}\ndescription: ${description}\n`
    );
    // Post a message using response_url given by the slash comamnd
    const command = JSON.parse(body.view.private_metadata);
    await postViaResponseUrl(
      command.response_url, // available for 30 minutes
      {
        "response_type": "ephemeral", // or "in_channel"
        "text": "[fallback] Somehow Slack app failed to render blocks",
        // Block Kit Builder - http://j.mp/bolt-starter-msg-json
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Your new task was successfully created! :rocket:*"
            }
          },
          {
            "type": "section",
            "fields": [
              {
                "type": "mrkdwn",
                "text": `*Title:*\n${title}`
              },
              {
                "type": "mrkdwn",
                "text": `*Deadline:*\n${deadline}`
              },
              {
                "type": "mrkdwn",
                "text": `*Description:*\n${description}`
              }
            ]
          }
        ]
      }
    );

    ack();
  }
});

// ---------------------------------------------------------------

// Utility to post a message using response_url
const axios = require('axios');
function postViaResponseUrl(responseUrl, response) {
  return axios.post(responseUrl, response);
}

// Request dumper middleware for easier debugging
if (process.env.SLACK_REQUEST_LOG_ENABLED === "1") {
  app.use(args => {
    args.context = JSON.parse(JSON.stringify(args.context));
    args.context.botToken = 'xoxb-***';
    if (args.context.userToken) {
      args.context.userToken = 'xoxp-***';
    }
    logger.debug(
      "Dumping request data for debugging...\n\n" +
      JSON.stringify(args, null, 2) +
      "\n"
    );
    args.next();
  });
}

receiver.app.get("/", (_req, res) => {
  res.send("Your Bolt ⚡️ App is running!");
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();

// `cp _env .env` then modify it
// See https://github.com/motdotla/dotenv
const config = require("dotenv").config().parsed;
// Overwrite env variables anyways
for (const k in config) {
  process.env[k] = config[k];
}

let agent = undefined;
// If you have HTTP proxy
const httpProxyUrl = process.env.HTTP_PROXY;
if (typeof httpProxyUrl !== 'undefined') {
  const HttpsProxyAgent = require('https-proxy-agent');
  agent = new HttpsProxyAgent(httpProxyUrl);
}

// Enable helpful logging for debugging
const developerMode = true;
const { LogLevel } = require("@slack/logger");
const logLevel = process.env.SLACK_LOG_LEVEL || LogLevel.DEBUG;

// The initialization can be deferred until App#init() call when true
const deferInitialization = true;

const { App } = require("@slack/bolt");
const app = new App({
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  token: process.env.SLACK_BOT_TOKEN,
  agent,
  logLevel,
  developerMode,
  deferInitialization,
});

// Request dumper middleware for easier debugging
if (process.env.SLACK_REQUEST_LOG_ENABLED === "1") {
  app.use(async (args) => {
    const copiedArgs = JSON.parse(JSON.stringify(args));
    copiedArgs.context.botToken = 'xoxb-***';
    if (copiedArgs.context.userToken) {
      copiedArgs.context.userToken = 'xoxp-***';
    }
    copiedArgs.client = {};
    copiedArgs.logger = {};
    args.logger.debug(
      "Dumping request data for debugging...\n\n" +
      JSON.stringify(copiedArgs, null, 2) +
      "\n"
    );
    const result = await args.next();
    args.logger.debug("next() call completed");
    return result;
  });
}

// ---------------------------------------------------------------
// Start coding here..
// see https://slack.dev/bolt/

// https://api.slack.com/apps/{APP_ID}/event-subscriptions
app.event("app_mention", async ({ logger, event, say }) => {
  logger.debug("app_mention event payload:\n\n" + JSON.stringify(event, null, 2) + "\n");
  const result = await say({
    text: `:wave: <@${event.user}> Hi there!`,
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "This is a section block with a button."
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Click Me",
            "emoji": true
          },
          "value": "click_me_123",
          "action_id": "button-action"
        }
      }

    ]

  });
  logger.debug("say result:\n\n" + JSON.stringify(result, null, 2) + "\n");
});

app.shortcut("socket-mode-shortcut", async ({ logger, client, body, ack }) => {
  await openModal({ logger, client, ack, body });
});

app.command("/open-modal", async ({ logger, client, ack, body }) => {
  await openModal({ logger, client, ack, body });
});

app.view("task-modal", async ({ logger, client, body, ack }) => {
  await handleViewSubmission({ logger, client, body, ack });
});

// ---------------------------------------------------------------

async function openModal({ logger, client, ack, body }) {
  try {
    const res = await client.views.open({
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
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "This is a section block with a button."
            },
            "accessory": {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Click Me",
                "emoji": true
              },
              "value": "click_me_123",
              "action_id": "button-action"
            }
          }
          ,
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
    });
    logger.debug("views.open response:\n\n" + JSON.stringify(res, null, 2) + "\n");
    await ack();
  } catch (e) {
    logger.error("views.open error:\n\n" + JSON.stringify(e, null, 2) + "\n");
    await ack(`:x: Failed to open a modal due to *${e.code}* ...`);
  }
}

async function handleViewSubmission({ logger, client, body, ack }) {
  logger.debug("view_submission view payload:\n\n" + JSON.stringify(body.view, null, 2) + "\n");

  const stateValues = body.view.state.values;
  const title = stateValues["input-title"]["input"].value;
  const deadline = stateValues["input-deadline"]["input"].selected_date;
  const description = stateValues["input-description"]["input"].value;

  const errors = {};
  if (title.length <= 5) {
    errors["input-title"] = "Title must be longer than 5 characters";
  }
  if (Object.entries(errors).length > 0) {
    await ack({
      response_action: "errors",
      errors: errors
    });
  } else {
    // Save the input to somewhere
    logger.info(`Valid response:\ntitle: ${title}\ndeadline: ${deadline}\ndescription: ${description}\n`);
    // Post a message using response_url given by the slash comamnd
    const command = JSON.parse(body.view.private_metadata);
    const message = {
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
    };
    if (command && command.response_url) {
      // Cannot use respond here as the response_url is not given here
      message.response_type = "ephemeral"; // or "in_channel"
      await postViaResponseUrl(
        command.response_url, // available for 30 minutes
        message
      );
    } else {
      const res = await client.chat.postMessage({
        channel: body.user.id,
        text: message.text,
        blocks: message.blocks
      });
      logger.debug("chat.postMessage response:\n\n" + JSON.stringify(res, null, 2) + "\n");
    }
    await ack();
  }
}

// Utility to post a message using response_url
const axios = require('axios');
function postViaResponseUrl(responseUrl, response) {
  return axios.post(responseUrl, response);
}

(async () => {
  try {
    await app.init();
    await app.start();
    console.log("⚡️ Bolt app is running!");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();

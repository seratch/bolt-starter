// `cp _env .env` then modify it
// See https://github.com/motdotla/dotenv
const config = require("dotenv").config().parsed;
// Overwrite env variables anyways
for (const k in config) {
  process.env[k] = config[k];
}

const { LogLevel } = require("@slack/logger");
const { App } = require("@slack/bolt");

const database = {};

const app = new App({
  logLevel: process.env.SLACK_LOG_LEVEL || LogLevel.DEBUG,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  scopes: ['commands', 'chat:write'],
  installationStore: {
    storeInstallation: async (installation) => {
      // change the line below so it saves to your database
      if (installation.isEnterpriseInstall) {
        // support for org wide app installation
        database[installation.enterprise.id] = installation;
      } else {
        // single team app installation
        database[installation.team.id] = installation;
      }
    },
    fetchInstallation: async (installQuery) => {
      // change the line below so it fetches from your database
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        // org wide app installation lookup
        return database[installQuery.enterpriseId];
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation lookup
        return database[installQuery.teamId];
      }
      throw new Error('Failed fetching installation');
    },
  },
  // The initialization can be deferred until App#init() call when true
  deferInitialization: true,
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
  const result = await say({ text: `:wave: <@${event.user}> Hi there!` });
  logger.debug("say result:\n\n" + JSON.stringify(result, null, 2) + "\n");
});

app.event("app_home_opened", async ({}) => {
});

// ---------------------------------------------------------------

(async () => {
  try {
    await app.init();
    await app.start(process.env.PORT || 3000);
    console.log("⚡️ Bolt app is running!");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();

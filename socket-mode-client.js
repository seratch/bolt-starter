const { SocketModeClient } = require('@slack/socket-mode');
const appToken = process.env.SLACK_APP_TOKEN;
const { LogLevel } = require("@slack/logger");
const logLevel = process.env.SLACK_LOG_LEVEL || LogLevel.DEBUG;
let clientOptions = {};
const httpProxyUrl = process.env.HTTP_PROXY;
if (typeof httpProxyUrl !== 'undefined') {
  const HttpsProxyAgent = require('https-proxy-agent');
  clientOptions.agent = new HttpsProxyAgent(httpProxyUrl);
}


const socketModeClient = new SocketModeClient({
  appToken,
  logLevel,
  clientOptions,
});

(async () => {
  await socketModeClient.start();
})();

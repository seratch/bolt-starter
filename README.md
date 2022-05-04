# Getting started with Bolt ⚡️

This is a simple [Slack's Bolt⚡️](https://slack.dev/bolt/) app template. This README covers the following ways to start building your awesome Slack apps.

* [CodeSandbox](https://codesandbox.io/): Step 1 -> Step 2A
* [Glitch](https://glitch.com/): Step 1 -> Step 2B
* On your local machine (Linux/macOS/Windows): Step 1 -> Step 2C

---

## (Step 1) Slack App Initial Setup

### Create a Slack App

Start with creating a new Slack app from https://api.slack.com/apps

<img src="https://github.com/seratch/bolt-starter/raw/master/images/create_slack_app.png" width=400 />

### Configure Bot Scopes

Access **Features > OAuth & Permissions** from the left sidebar and set the followings.

`https://api.slack.com/apps/{APP_ID}/oauth`

* `app_mentions:read`
* `chat:write`
* `commands`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/oauth_scopes.png" width=400 />

### Install the app to your workspace

Access **Settings > Install App** from the left sidebar. You'll configure more later but let's install the app anyway to get a bot token (`xoxb-***`).

`https://api.slack.com/apps/{APP_ID}/install-on-team`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/oauth_installation.png" width=400 />

---

## (Step 2A) CodeSandbox Setup

### Sign in with your GitHub account

https://codesandbox.io/

As of December 2019, CodeSandbox allows logging in with only GitHub accounts. You need to login with your own GitHub account.

### Create a new sandbox

It's pretty simple. Create a new sandbox by importing this repostiory. The steps are:

* Click `Create Sandbox`
* Go to `Import` tab
* Put `https://github.com/seratch/bolt-starter` in the textbox
* Click `Open Sandbox`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/codesandbox_github_import.png" width=400 />

Then, fork the template project to create your own sandbox:

<img src="https://github.com/seratch/bolt-starter/raw/master/images/codesandbox_fork_template.png" width=400 />

In your own sandbox project, configure secrets as below:

<img src="https://github.com/seratch/bolt-starter/raw/master/images/codesandbox_secrets.png" width=400 />

* SLACK_SIGNING_SECRET: Use the value you can find at **Basic Information > App Credentials > Signing Secret**
* SLACK_BOT_TOKEN: Use the Bot User OAuth Access Token (starting with `xoxb-`) you can find at **Settings > Install App**

<img src="https://github.com/seratch/bolt-starter/raw/master/images/codesandbox_edit_secrets.png" width=400 />

That's all! If your changes are not reflected to the running sandbox, click `Restart Sandbox` button.

### Set Request URLs (Slack App)

You must see `https://{random}.sse.codesandbox.io/` URL in the right pane on CodeSandbox.

<img src="https://github.com/seratch/bolt-starter/raw/master/images/codesandbox_url.png" width=400 />

You can go with `https://{random}.sse.codesandbox.io/slack/events` for all of the Slack App Request URLs. 

You need to configure the following three settings with the URL.

* Interactive Components: Turn on first, set the Request URL, and then click "Save Changes" button
* Slash Commands: Add `/open-modal` command with the above URL for Reequest URL
* Event Subscriptions: Turn on first, set the Request URL, add `app_mention` in Bot Events, and then click "Save Changes" button

### Re-install Slack App to your workspace

`https://api.slack.com/apps/{APP_ID}/install-on-team`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/oauth_installation.png" width=400 />

---

## (Step 2B) Glitch Setup

https://glitch.com/

### Create a Glitch project

The steps are similar to CodeSandbox.

<img src="https://github.com/seratch/bolt-starter/raw/master/images/glitch_clone_repo.png" width=400 />
<img src="https://github.com/seratch/bolt-starter/raw/master/images/glitch_paste_url.png" width=400 />

After creating a project, duplicate `_env` file and name it as `.env`. The file named `.env` will be automatically marked as a secret file.

<img src="https://github.com/seratch/bolt-starter/raw/master/images/glitch_duplicate_env.png" width=400 />
<img src="https://github.com/seratch/bolt-starter/raw/master/images/glitch_env_file.png" width=400 />

After modifying `.env` file, make sure if the app is running without any problems by checking the logs.

<img src="https://github.com/seratch/bolt-starter/raw/master/images/glitch_tools.png" width=400 />
<img src="https://github.com/seratch/bolt-starter/raw/master/images/glitch_logs.png" width=400 />

### Set Request URLs (Slack App)

<img src="https://github.com/seratch/bolt-starter/raw/master/images/glitch_live_app.png" width=400 />

You must see `https://{some-fancy-name}.glitch.me/` URL in the Live App settings on Glitch.

You can go with `https://{some-fancy-name}.glitch.me/slack/events` for all of the Slack App Request URLs. 

* `https://api.slack.com/apps/{APP_ID}/event-subscriptions`
* `https://api.slack.com/apps/{APP_ID}/slash-commands`
* `https://api.slack.com/apps/{APP_ID}/interactive-messages`

### Re-install Slack App to your workspace

`https://api.slack.com/apps/{APP_ID}/install-on-team`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/oauth_installation.png" width=400 />

---

## (Step 2C) Your Local Machine Setup

### ngrok Setup

https://ngrok.com/

```bash
ngrok http 3000
```

If you have a paid license, you can configure a fixed subdomain.

```bash
ngrok http 3000 --subdomain your-awesome-subdomain
```

<img src="https://github.com/seratch/bolt-starter/raw/master/images/ngrok.png" width=400 />

### Node Version Manager (nvm) Setup

#### Linux / macOS

* Install [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm#installation-and-update)
* `nvm install --lts` (installing latest LTS version)

#### Windows

* Install [nvm-windows](https://github.com/coreybutler/nvm-windows) from [here](https://github.com/coreybutler/nvm-windows/releases)
* `mvn list available` to check the available versions
* `nvm install {latest LTS}` (installing latest LTS version)

If you go with WSL, follow the same steps in `Linux / macOS`.

### Start with this template

<img src="https://github.com/seratch/bolt-starter/raw/master/images/use_template.png" width=400 />

Or it's also possible to download this project template:

`git clone git@github.com:seratch/bolt-starter.git` or https://github.com/seratch/bolt-starter/archive/master.zip

### Run the app

```bash
cd bolt-starter
cp _env .env
# edit .env
npm i
npm run local
```

<img src="https://github.com/seratch/bolt-starter/raw/master/images/npm_run_local.png" width=400 />

### Set Request URLs (Slack App)

<img src="https://github.com/seratch/bolt-starter/raw/master/images/request_url.png" width=400 />

Set `https://{your-awesome-subdomain}.ngrok.io/slack/events` to all of the followings:

* `https://api.slack.com/apps/{APP_ID}/slash-commands`
* `https://api.slack.com/apps/{APP_ID}/event-subscriptions`
* `https://api.slack.com/apps/{APP_ID}/interactive-messages`

#### Slash Commands

Access **Features > Slash Commands** from the left sidebar. Create a slash command named `/open-modal`.

`https://api.slack.com/apps/{APP_ID}/slash-commands`

* Command: `/open-modal`
* request URL: `https://{your-awesome-subdomain}.ngrok.io/slack/events`
* Short Description: whatever you like
* Click "Save" for sure

<img src="https://github.com/seratch/bolt-starter/raw/master/images/slash_command.png" width=400 />

#### Configure Event Subscriptions

Access **Features > Event Subscriptions** from the left sidebar. Add an event subscription for `app_mention` events and click "Save Changes" button for sure..

`https://api.slack.com/apps/{APP_ID}/event-subscriptions`

* `app_mention`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/event_subscriptions.png" width=400 />

#### Configure Interactivity

Access **Features > Interactivity & Shortcuts** from the left sidebar. Set the Request URL for Interactity and click "Save Changes" button for sure.

`https://api.slack.com/apps/{APP_ID}/interactive-messages`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/interactive_components.png" width=400 />

#### Global Shortcuts

Access **Features > Interactivity & Shortcuts > Shortcuts** from the left sidebar. Create a new global shortcut with Callback ID `open-modal`.

* Name: whatever you like
* Short Description: whatever you like
* Callback ID: `open-modal`
* Click "Create"

### Re-install the app to your workspace

`https://api.slack.com/apps/{APP_ID}/install-on-team`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/oauth_installation.png" width=400 />

# License

The MIT License

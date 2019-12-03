# Getting started with Bolt ⚡️

This is a simple [Slack's Bolt⚡️](https://slack.dev/bolt/) app template.

# How to set up

## Create a Slack App

https://api.slack.com/apps

<img src="https://github.com/seratch/bolt-starter/raw/master/images/create_slack_app.png" width=600 />

## ngrok

https://ngrok.com/

```bash
ngrok http 3000
```

If you have a paid license, you can configure a fixed subdomain.

```bash
ngrok http 3000 --subdomain your-awesome-subdomain
```

<img src="https://github.com/seratch/bolt-starter/raw/master/images/ngrok.png" width=600 />

### Setup Reequest URL

Set `https://{your-awesome-subdomain}.ngrok.io/slack/events` to all of the followings:

* `https://api.slack.com/apps/{APP_ID}/event-subscriptions`
* `https://api.slack.com/apps/{APP_ID}/slash-commands`
* `https://api.slack.com/apps/{APP_ID}/interactive-messages`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/request_url.png" width=600 />

### Add a bot user and install the app to your workspace

`https://api.slack.com/apps/{APP_ID}/install-on-team`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/oauth.png" width=600 />

## nvm

### Linux / macOS

* Install [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm#installation-and-update)
* `nvm install --lts` (installing latest LTS version)

### Windows

* Install [nvm-windows](https://github.com/coreybutler/nvm-windows) from [here](https://github.com/coreybutler/nvm-windows/releases)
* `mvn list available` to check the available versions
* `nvm install {latest LTS}` (installing latest LTS version)

If you go with WSL, follow the same steps in `Linux / macOS`.

## Start with this template

<img src="https://github.com/seratch/bolt-starter/raw/master/images/use_template.png" width=600 />

Or it's also possible to download this project template:

`git clone git@github.com:seratch/bolt-starter.git` or https://github.com/seratch/bolt-starter/archive/master.zip

## Run the app

```bash
cd bolt-starter
cp _env .env
# edit .env
npm i
npm run local
```

<img src="https://github.com/seratch/bolt-starter/raw/master/images/npm_run_local.png" width=400 />

# License

The MIT License
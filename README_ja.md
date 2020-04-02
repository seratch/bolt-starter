# Bolt ⚡️ を使った開発を始めよう

このリポジトリは、[Slack の Bolt⚡️ フレームワーク](https://slack.dev/bolt/)を使ったアプリのテンプレートです。この README は以下のような Slack アプリを作る手順をカバーしています。

* [CodeSandbox](https://codesandbox.io/)を使う: ステップ 1 -> ステップ 2A
* [Glitch](https://glitch.com/)を使う: ステップ 1 -> ステップ 2B
* ローカルマシン(Linux/macOS/Windows)を使う: ステップ 1 -> ステップ 2C

---

## (ステップ 1) Slack App の初期設定

### Slack App を新規作成

まずは Slack App を https://api.slack.com/apps でつくりましょう。

<img src="https://github.com/seratch/bolt-starter/raw/master/images/create_slack_app.png" width=400 />

### ボットスコープ（Bot Scope) を設定

左サイドバーから Features > OAuth & Permissions へアクセスして、Bot Scope を以下の通り追加します。

`https://api.slack.com/apps/{APP_ID}/oauth`

* `app_mentioned:read`
* `chat:write`
* `commands`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/oauth_scopes.png" width=400 />

### Slack App をワークスペースにインストール

左サイドバーから **Settings > Install App** にアクセスしてください。さらにいくつかの設定を後ほど行いますが、まずは bot token (`xoxb-***`) を入手するためにワークスペースにインストールしてみてください。

`https://api.slack.com/apps/{APP_ID}/install-on-team`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/oauth_installation.png" width=400 />

---

## (ステップ 2A) CodeSandbox のセットアップ

### GitHub アカウントでログイン

https://codesandbox.io/

2019 年 12 月時点で CodeSandbox は GitHub アカウントのみのログインをサポートしています。GitHub アカウントが必要となりますので、ご準備ください。

### Sandbox を作成

この手順はとても簡単です。この GitHub リポジトリを import 対象として指定して、新規の Sandbox を作ってください。

* `Create Sandbox` をクリック
* `Import` タブへ遷移
* `https://github.com/seratch/bolt-starter` を入力
* `Open Sandbox` をクリック

<img src="https://github.com/seratch/bolt-starter/raw/master/images/codesandbox_github_import.png" width=400 />

すると、テンプレートの Sandbox が作成されますので、これを fork して作業用の Sandbox を作ります。

<img src="https://github.com/seratch/bolt-starter/raw/master/images/codesandbox_fork_template.png" width=400 />

この Sandbox プロジェクトで secrets の値を設定します。

<img src="https://github.com/seratch/bolt-starter/raw/master/images/codesandbox_secrets.png" width=400 />

* SLACK_SIGNING_SECRET: **Basic Information > App Credentials > Signing Secret** の値を表示して取得
* SLACK_BOT_TOKEN: Slack App 管理画面 **Settings > Install App** に表示された `xoxb-` で始まる **Bot User OAuth Access Token**

<img src="https://github.com/seratch/bolt-starter/raw/master/images/codesandbox_edit_secrets.png" width=400 />

たった、これだけで完了です！もし変更しても反映されないときは同じ画面の Restart Sandbox ボタンを押してください。

### Request URL (Slack App) を設定

CodeSandbox の右側のペインを見ると `https://{random}.sse.codesandbox.io/` のような URL が表示され、そのアクセス結果が表示されているはずです。

<img src="https://github.com/seratch/bolt-starter/raw/master/images/codesandbox_url.png" width=400 />

この URL に `/slack/events` というパスを加えた `https://{random}.sse.codesandbox.io/slack/events` を Slack App 内の Request URL の項目に設定します。全て同じ URL で OK です。設定する箇所は以下の三箇所です。

* Interactivity & Shortcuts: Off -> On に変えて Request URL を指定したら Save Changes で保存
* Slash Commands: `/open-modal` という名前のコマンドを追加、その Request URL に上記の URL を指定して保存
* Event Subscriptions: Off -> On に変えて Request URL を設定し Bot Events の中の `app_mention` を選択して Save Changes で保存

### Slack App をワークスペースに再インストール

設定が変更されて、再インストールを促されていると思います。もう一度インストールし直してください。

`https://api.slack.com/apps/{APP_ID}/install-on-team`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/oauth_installation.png" width=400 />

---

## (Step 2B) Glitch のセットアップ

https://glitch.com/

### Glitch プロジェクトの作成

手順は CodeSandbox にかなり似ています。

<img src="https://github.com/seratch/bolt-starter/raw/master/images/glitch_clone_repo.png" width=400 />
<img src="https://github.com/seratch/bolt-starter/raw/master/images/glitch_paste_url.png" width=400 />

プロジェクトを作成したら、 `_env` ファイルを複製して `.env` という名前をつけて保存します。`.env` という名前のファイルは特殊なファイルとして認識され、Glitch は自動的に秘匿すべき情報の書かれたファイルとして、あなた以外のユーザには閲覧できないように制御してくれます。

<img src="https://github.com/seratch/bolt-starter/raw/master/images/glitch_duplicate_env.png" width=400 />
<img src="https://github.com/seratch/bolt-starter/raw/master/images/glitch_env_file.png" width=400 />

`.env` の編集が終わったら、アプリが正常に起動できているかログを確認してください。特にエラーのトレースが出ていなければ問題ないでしょう。

<img src="https://github.com/seratch/bolt-starter/raw/master/images/glitch_tools.png" width=400 />
<img src="https://github.com/seratch/bolt-starter/raw/master/images/glitch_logs.png" width=400 />

### Request URL (Slack App) を設定

<img src="https://github.com/seratch/bolt-starter/raw/master/images/glitch_live_app.png" width=400 />

Glitch 上で上記のような手順でアクセスすると Live App の設定のところで `https://{some-fancy-name}.glitch.me/` のような URL を入手できます。

この `https://{some-fancy-name}.glitch.me/slack/events` を Slack App の設定に何箇所か出てくる Request URL として指定します。全て同じ URL で OK です。

* `https://api.slack.com/apps/{APP_ID}/event-subscriptions`
* `https://api.slack.com/apps/{APP_ID}/slash-commands`
* `https://api.slack.com/apps/{APP_ID}/interactive-messages`

### Slack App をワークスペースに再インストール

設定が変更されて、再インストールを促されていると思います。もう一度インストールし直してください。

`https://api.slack.com/apps/{APP_ID}/install-on-team`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/oauth_installation.png" width=400 />

---

## (Step 2C) ローカルマシンをセットアップ

### ngrok をセットアップ

https://ngrok.com/ を使ってインターネットに公開された URL を生成し、ローカルで動いているアプリにリクエストを流します。

```bash
ngrok http 3000
```

もし有償プランに入っている場合は、サブドメインを固定のものに指定することができます。

```bash
ngrok http 3000 --subdomain your-awesome-subdomain
```

<img src="https://github.com/seratch/bolt-starter/raw/master/images/ngrok.png" width=400 />

### Node Version Manager (nvm) のセットアップ

#### Linux / macOS

* [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm#installation-and-update) をインストール
* `nvm install --lts` (最新の LTS バージョンをインストール)

#### Windows

* [nvm-windows](https://github.com/coreybutler/nvm-windows) from [here](https://github.com/coreybutler/nvm-windows/releases) をインストール
* `mvn list available` を実行してダウンロード可能なバージョンを調べる
* `nvm install {最新の LTS バージョン}` (最新の LTS バージョンをインストール)

もし Windows Subsystem for Linux (WSL) を使っている場合は `Linux / macOS` と全く同じステップでいけるはずです。

### このテンプレートを使って開発を始める

<img src="https://github.com/seratch/bolt-starter/raw/master/images/use_template.png" width=400 />

あるいは、以下の方法でこのテンプレートをローカルにダウンロードしてください。

`git clone git@github.com:seratch/bolt-starter.git` or https://github.com/seratch/bolt-starter/archive/master.zip

### アプリを起動

```bash
cd bolt-starter
cp _env .env
# edit .env
npm i
npm run local
```

<img src="https://github.com/seratch/bolt-starter/raw/master/images/npm_run_local.png" width=400 />

### Request URL (Slack App) を設定

<img src="https://github.com/seratch/bolt-starter/raw/master/images/request_url.png" width=400 />

`https://{your-awesome-subdomain}.ngrok.io/slack/events` のような URL を以下の Request URL の項目に設定します。全て同じ URL で OK です。

* `https://api.slack.com/apps/{APP_ID}/slash-commands`
* `https://api.slack.com/apps/{APP_ID}/event-subscriptions`
* `https://api.slack.com/apps/{APP_ID}/interactive-messages`

#### Slash Commands を設定

左サイドバーから **Features > Slash Commands** へアクセスします。`/open-modal` というスラッシュコマンドを以下の内容で設定し、保存します。

`https://api.slack.com/apps/{APP_ID}/slash-commands`

* Command: `/open-modal`
* request URL: `https://{your-awesome-subdomain}.ngrok.io/slack/events`
* Short Description: お好きな内容で
* "Save" ボタンを押すのを忘れずに！

<img src="https://github.com/seratch/bolt-starter/raw/master/images/slash_command.png" width=400 />

#### Event Subscriptions を設定

左サイドバーから **Features > Event Subscriptions** へアクセスします。有効にしたら `app_mention` というイベントを bot event で受信するよう設定し、忘れずに "Save Changes" ボタンを押してください。

`https://api.slack.com/apps/{APP_ID}/event-subscriptions`

* `app_mention`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/event_subscriptions.png" width=400 />

#### Interactivity & Shortcuts を設定

左サイドバーから **Features > Interactivity & Shortcuts** へアクセスします。有効にしたら Request URL を適切に設定して "Save Changes" ボタンを忘れずに押してください。

`https://api.slack.com/apps/{APP_ID}/interactive-messages`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/interactive_components.png" width=400 />

#### Global Shortcuts

左サイドバーから **Features > Interactivity & Shortcuts > Shortcuts** へアクセスします。Callback ID `open-modal` でグローバルショットカットをつくります。

* Name: お好きな内容で
* Short Description: お好きな内容で
* Callback ID: `open-modal`
* "Create" ボタンをクリック

### Slack App をワークスペースに再インストール

設定が変更されて、再インストールを促されていると思います。もう一度インストールし直してください。

`https://api.slack.com/apps/{APP_ID}/install-on-team`

<img src="https://github.com/seratch/bolt-starter/raw/master/images/oauth_installation.png" width=400 />

# ライセンス

The MIT License

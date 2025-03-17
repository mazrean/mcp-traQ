# mcp-traQ

traQをデータソースとした、MCPプロトコルサーバーの実装です。
LLMからメッセージやチャンネル、ユーザーの情報を取得し、利用できるようになります。

## 使用方法
1. traQのBotを作成する
  - traPメンバーは[Bot Console](https://bot-console.trap.jp/)からBotを作成できます
  - traP外の場合は[`POST /api/v3/bots`](https://apis.trap.jp/#/bot/createBot)を利用してBotを作成してください
2. MCPサーバーの設定を行う
  - 環境変数として1で作成したBotのAccess Tokenを設定します
  - traPのサーバー以外を利用する場合はbaseURLも設定してください
  - Claude Desktopなどでの設定例
    ```json
    {
      "mcpServers": {
        "slack": {
          "command": "mcp-traQ",
          "args": ["bot"],
          "env": {
            "MCP_TRAQ_BOT_TOKEN": "<BotのAccess Token>",
            "MCP_TRAQ_BASE_URL": "<traQのベースURL(traPのサーバーの場合は不要)>"
          }
        }
      }
    }
    ```

## 機能

現状、以下の情報の取得のみに対応しています。

- メッセージの検索
  - 各メッセージの以下を取得
    - メッセージの内容
    - 送信者
    - 送信日時
    - ついたスタンプ
  - traQ上とほぼ同等の検索が可能です
- チャンネルの検索
- ユーザー情報の取得
- スタンプ一覧の取得
- ピン留めメッセージの取得

## ライセンス
MIT License

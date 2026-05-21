# kakeibo-app

レシート画像を Claude AI で読み取る家計簿 Web アプリです。

## プロジェクト概要

レシート画像をアップロードすると Claude API が自動で商品・金額・日付を読み取り、カテゴリ別に集計・グラフ表示します。

## 技術スタック

| 層 | 技術 |
|---|---|
| フロントエンド | React 18 + Vite |
| バックエンド | Node.js + Express |
| AI | Claude API（claude-haiku-4-5-20251001） |
| グラフ | Chart.js + react-chartjs-2 |
| データ永続化 | localStorage |

## ディレクトリ構成

```
kakeibo-app/
├── server/          # Expressバックエンド（Claude API呼び出し）
│   ├── server.js
│   └── package.json
├── client/          # Reactフロントエンド
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── ReceiptUploader.jsx   # 画像アップロード
│   │   │   ├── ExpenseList.jsx       # 支出一覧
│   │   │   ├── Summary.jsx           # サマリーカード・カテゴリ内訳
│   │   │   ├── CategoryChart.jsx     # カテゴリ別円グラフ
│   │   │   └── MonthlyChart.jsx      # 月別棒グラフ
│   │   └── hooks/
│   │       └── useLocalStorage.js
│   └── package.json
├── .env             # APIキー（Git管理外）
├── .env.example     # .envのテンプレート
└── package.json     # ルート（concurrently でサーバー+クライアント同時起動）
```

## セットアップ・起動

```bash
# 初回: .env.example をコピーして APIキーを設定
cp .env.example .env

# 依存パッケージのインストール（初回のみ）
npm run install:all

# 開発サーバー起動（サーバー + クライアント同時起動）
npm run dev
```

- フロントエンド: http://localhost:5173
- バックエンド: http://localhost:3001

## Git 運用ルール

### 基本方針

- コードを変更するたびに、変更内容を GitHub にプッシュします。
- コミット・プッシュの前に必ずユーザーの了承を得てください。

### フロー

1. コードを変更する
2. 変更内容をユーザーに説明し、コミットメッセージ案を提示する
3. **ユーザーの了承を得てから** `git add` → `git commit` → `git push` を実行する
4. 了承が得られない場合はコミット・プッシュを行わない

### コミットメッセージ規約

コミットメッセージは日本語または英語で記述し、変更の意図が伝わるようにします。

```
<種別>: <概要>

<詳細（任意）>
```

種別の例:
- `feat`: 新機能追加
- `fix`: バグ修正
- `refactor`: リファクタリング
- `docs`: ドキュメント変更
- `test`: テスト追加・修正
- `chore`: ビルド設定・依存関係など

### ブランチ戦略

- `main`: 本番相当の安定ブランチ
- 機能追加・修正は feature ブランチで作業し、PR を通じて `main` にマージする

## 注意事項

- 破壊的な操作（force push、履歴の書き換え等）は行わない
- `.env` や認証情報を含むファイルはコミットしない

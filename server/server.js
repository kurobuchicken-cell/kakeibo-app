const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Anthropic = require('@anthropic-ai/sdk');
const dotenv = require('dotenv');
const path = require('path');

// プロジェクトルートの .env を読み込む
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// 画像をメモリ上に保持するmulter設定（10MB制限）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Anthropicクライアントの初期化
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// CORSの設定（ViteとCreate React Appの両ポートを許可）
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

// レシート解析エンドポイント
app.post('/api/analyze-receipt', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '画像ファイルが必要です' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const today = new Date().toISOString().split('T')[0];

    // Claude APIでレシート画像を解析
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              // レシート画像をBase64で送信
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: `このレシート画像を解析してください。
必ず以下のJSON形式のみで返答してください（JSON以外のテキストは絶対に含めないでください）：
{
  "date": "YYYY-MM-DD形式の日付",
  "store": "店舗名",
  "items": [
    {
      "name": "商品名",
      "price": 税込み金額（数値のみ、カンマなし）,
      "category": "カテゴリ名"
    }
  ],
  "total": 合計金額（数値のみ、カンマなし）
}

カテゴリは必ず以下のいずれかを選んでください：
- 食費（スーパー・コンビニの食品・飲料）
- 外食（レストラン・カフェ・ファストフード・テイクアウト）
- 日用品（洗剤・トイレットペーパー・文具などの生活用品）
- 交通費（電車・バス・タクシー・駐車場・ガソリン）
- 医療費（薬局・病院・クリニック）
- 娯楽費（映画・ゲーム・書籍・趣味用品）
- その他（上記に当てはまらないもの）

注意：
- 日付が読み取れない場合は今日の日付（${today}）を使用
- 価格は税込み金額を使用
- JSONのみを返答し、コードブロックや説明文は一切含めないこと`,
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].text;

    // レスポンスからJSONを抽出（コードブロックが含まれる場合も対応）
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('レスポンスからJSONを抽出できませんでした');
    }

    const receiptData = JSON.parse(jsonMatch[0]);
    res.json(receiptData);
  } catch (error) {
    console.error('レシート解析エラー:', error.message);
    res.status(500).json({
      error: 'レシートの解析に失敗しました',
      detail: error.message,
    });
  }
});

// サーバー起動確認用エンドポイント
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', model: 'claude-haiku-4-5-20251001' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`バックエンドサーバー起動中: http://localhost:${PORT}`);
});

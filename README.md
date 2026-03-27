<div align="center">

# K-POP Formation Viewer

**K-POPダンスのフォーメーションを動画と同期して可視化するファン向けツール**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com)
[![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare)](https://pages.cloudflare.com)

</div>

---

## 概要

YouTube動画とフォーメーションデータをリアルタイム同期。K-POPのカバーダンス練習・振り付け確認に最適なWebツールです。

- **Viewer** — 動画再生に合わせてメンバーの位置がアニメーション
- **Editor** — ドラッグ＆ドロップでフォーメーションを作成・編集
- **Timeline** — 曲のどの場面のフォーメーションかをシークバーで確認

## スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| アニメーション | Framer Motion |
| データベース | Supabase (PostgreSQL) |
| デプロイ | Cloudflare Pages |

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .env に Supabase の接続情報を入力

# 開発サーバー起動
npm run dev
```

http://localhost:3000 でアクセスできます。

## 環境変数

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_strong_password
```

## デプロイ (Cloudflare Pages)

```bash
# Cloudflare にログイン
npx wrangler login

# プロジェクト作成 (初回のみ)
npx wrangler pages project create kpop-formation-viewer

# ビルド & デプロイ
npm run deploy
```

デプロイ後、Cloudflare Dashboard または以下のコマンドで環境変数を設定してください。

```bash
npx wrangler pages secret put NEXT_PUBLIC_SUPABASE_URL --project-name kpop-formation-viewer
npx wrangler pages secret put NEXT_PUBLIC_SUPABASE_ANON_KEY --project-name kpop-formation-viewer
npx wrangler pages secret put NEXT_PUBLIC_SITE_URL --project-name kpop-formation-viewer
npx wrangler pages secret put ADMIN_USERNAME --project-name kpop-formation-viewer
npx wrangler pages secret put ADMIN_PASSWORD --project-name kpop-formation-viewer
```

## ライセンス

このプロジェクトは個人のファン活動として運営されています。K-POPアーティストの映像・楽曲・振付に関する権利は各権利者に帰属します。

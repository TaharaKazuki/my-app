# CLAUDE.md
 
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
 
## プロジェクト概要
 
**Money Tracker** - シンプルで継続できる家計簿アプリ
 
「3つの機能だけ。続けられる家計簿」をコンセプトに、支出記録、カテゴリ分け、ダッシュボード表示の必要最小限の機能で構成されています。
 
## 開発ロードマップと進捗管理
 
開発は`.claude/development_roadmap.md`のチェックリストに従って進めます。
 
### タスク管理方法
- 各フェーズの実装内容はチェックリスト形式で記載
- 完了したタスクは`[ ]`を`[x]`に変更して記録
- フェーズ1から順番に実装を進める
 
```markdown
# 実装前
- [ ] パッケージインストール（Supabase, Clerk, shadcn/ui）
 
# 実装後
- [x] パッケージインストール（Supabase, Clerk, shadcn/ui）
```
 
## 開発コマンド
 
```bash
npm run dev      # 開発サーバー起動（Turbopack使用、http://localhost:3000）
npm run build    # プロダクションビルド
npm start        # プロダクションサーバー起動
npm run lint     # ESLint実行
npx tsc --noEmit # TypeScript型チェック

# Supabase関連
supabase start   # ローカルSupabase起動（Docker使用時のみ）
supabase stop    # ローカルSupabase停止（Docker使用時のみ）
# マイグレーション実行はSupabaseダッシュボードのSQL Editorで手動実行

# shadcn/ui コンポーネント追加
npx shadcn@latest add [component-name]
```
 
## 環境設定
 
### 必要な環境変数（.env.local）
 
以下は設定済みとする。
 
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
 
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

```
 
## プロジェクト構造
 
```
my-app/
├── src/
│   ├── app/                    # App Router
│   │   ├── (auth)/            # 認証関連ページ
│   │   ├── (dashboard)/       # ダッシュボード（認証必須）
│   │   ├── api/               # API Routes
│   │   └── layout.tsx         # ルートレイアウト
│   ├── components/            # 共通コンポーネント
│   ├── lib/                   # ユーティリティ、設定
│   └── types/                 # TypeScript型定義
├── .claude/                   # プロジェクトドキュメント
│   ├── requirements.md        # 要件定義書
│   ├── development_roadmap.md # 開発ロードマップ（進捗管理）
│   ├── design_system.md       # デザインシステム
│   ├── supabase_document.md   # Supabase実装ガイド
│   ├── clerk_document.md      # Clerk実装ガイド
│   ├── clerk_supabase_integration_document.md # 認証連携ガイド
│   └── tailwind_document.md   # Tailwind CSS v4実装ガイド
└── public/                    # 静的ファイル
```
 
## アーキテクチャ
 
### 技術スタック
- **フレームワーク**: Next.js 15.4.6 (App Router)
- **React**: 19.1.0
- **言語**: TypeScript 5.x（strictモード）
- **スタイリング**: Tailwind CSS v4 + shadcn/ui
- **認証**: Clerk（メール認証、課金管理）+ 日本語ローカライズ
- **データベース**: Supabase（PostgreSQL）
- **フォームバリデーション**: react-hook-form + zod
- **日付処理**: date-fns（日本語ロケール使用）
- **通知**: Sonner
- **グラフ**: Recharts（プレミアム機能用）
- **ホスティング**: Vercel
 
### 主要な実装方針
- **Supabase**: クラウド版を使用（Dockerは使用しない）
- **認証連携**: API Routes経由でSupabaseにアクセス（Service Roleキー使用）
- **課金**: Clerk Billingでプラン管理（スラグ: "premium"）
- **テスト**: MVP目的のためテストは書かない
- **品質管理**: タスク完了前に必ずlintと型のチェックを実行
 
## 重要なドキュメント
 
### 要件定義
`.claude/requirements.md` - プロジェクトの詳細な要件定義
 
### 開発ロードマップ
`.claude/development_roadmap.md` - 9つのフェーズで構成される開発計画と進捗管理
 
### デザインシステム
`.claude/design_system.md` - UIコンポーネントのデザインガイドライン
 
### 実装ガイド
- `.claude/supabase_document.md` - Supabase実装方法（方法1を採用）
- `.claude/clerk_document.md` - Clerk認証・課金の実装
- `.claude/clerk_supabase_integration_document.md` - 認証連携の実装
- `.claude/tailwind_document.md` - Tailwind CSS v4の設定と使用方法
 
## コーディング規約
 
### TypeScript
- パスエイリアス: `@/*` → `src/*`
- 型定義は`src/types/`に集約
- strictモードを維持
 
### コンポーネント
- 関数コンポーネントで統一
- shadcn/uiコンポーネントを優先使用
- デザインシステムに従ったスタイリング
 
### git管理
- 各フェーズ完了時にコミット
- 意味のある単位でコミットメッセージを記述
 
## データベース設計

### テーブル構造
```sql
-- users: Clerkユーザー情報
users (
  id TEXT PRIMARY KEY,  -- Clerk user ID
  email TEXT NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- categories: 支出カテゴリ（マスタデータ）
categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,  -- URLフレンドリーな識別子
  icon TEXT NOT NULL,         -- 絵文字アイコン
  order_index INTEGER,        -- 表示順
  created_at TIMESTAMP
)

-- expenses: 支出記録
expenses (
  id UUID PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  category_id INTEGER REFERENCES categories(id),
  amount DECIMAL(10,2),  -- 最大999万円まで
  description TEXT,       -- 任意のメモ
  date DATE,             -- 支出日
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## 開発時の注意事項
 
- Clerk Billingのプランスラグは必ず「premium」に設定
- user_idフィールドはTEXT型（ClerkのID形式に対応）
- 環境変数は`.env.local`に正しく記載されている前提で進め、必要に応じ example ファイルを作成
  - `.env.local` を Claude Code が読み込むことは絶対に避ける
- デザインシステム（`.claude/design_system.md`）を厳守
- カテゴリは固定9種類（食費、日用品、交通費、娯楽、衣服・美容、医療・健康、住居費、通信費、その他）
- 日付選択はshadcn/uiのCalendarコンポーネント使用（locale={ja}で日本語化）
- フォーム送信前に必ずzodでバリデーション実行
 
## 現在の実装状況

### 完了済みフェーズ
- ✅ **フェーズ1**: 基盤とコア機能（環境構築、認証システム、データベース設計、共通コンポーネント）
- 🚧 **フェーズ2**: 支出管理機能（支出記録フォーム完了、API Routes未実装）

### 主要コンポーネント実装状況
- ✅ 認証: Clerk統合（日本語化済み）、サインイン/サインアップページ
- ✅ フォーム: 支出記録フォーム（金額、カテゴリ、日付、説明）
- ✅ UI: shadcn/uiコンポーネント一式、ローディング状態、スケルトン
- ✅ バリデーション: zodスキーマ定義済み
- ⏳ API: 支出CRUD操作（未実装）
- ⏳ ダッシュボード: サマリー表示（未実装）

## 開発の流れ
 
1. これから行うタスクを理解する
2. タスクに関する `.claude` 内のドキュメントの内容を理解する
3. TodoWriteツールでタスク管理（複雑なタスクの場合）
4. 設計を行う
5. 実装を進める
6. lint と型チェックを実行
7. 実装完了後、結果に関してユーザーに動作確認方法を伝える

## 実装の知見・ナレッジ

### データベースアクセス方法の選択

#### Supabaseクライアント（現在の実装）
- **利点**：
  - セットアップが簡単、追加設定不要
  - リアルタイム機能、RLS（Row Level Security）との統合がスムーズ
  - PostgREST APIの全機能を活用可能
  - バンドルサイズが小さい
  - Supabaseのエコシステムとの親和性が高い

- **適用場面**：
  - MVP開発や素早いプロトタイピング
  - データ構造がシンプルな場合
  - Supabaseの機能（リアルタイム、RLS等）を活用したい場合

#### ORM（Prisma、Drizzle等）
- **利点**：
  - 型安全性がより強力（自動生成される型定義）
  - マイグレーション管理が優れている
  - 複雑なリレーションの扱いが簡単
  - データベース抽象化（将来的な移行が容易）

- **適用場面**：
  - 大規模プロジェクト
  - 複雑なデータモデル
  - 複数のデータベースプロバイダーへの対応が必要な場合

#### RLS（Row Level Security）との統合
- SupabaseクライアントでもORMでもRLSは使用可能
- ORMを使用する場合は、ユーザーコンテキストの明示的な設定が必要：
  ```typescript
  // Prismaの例
  await prisma.$executeRawUnsafe(`SET LOCAL request.jwt.claims TO '${jwtClaims}'`)
  
  // Drizzleの例
  await db.execute(sql`SET LOCAL auth.uid TO ${userId}`)
  ```
- Service Roleキーを使用する場合はRLSがバイパスされるため注意が必要

### API Routes設計パターン

#### 認証とデータアクセスの分離
- API RoutesでClerk認証を検証
- Service Roleキーを使用してSupabaseにアクセス
- ユーザーIDによるフィルタリングで権限管理

#### エラーハンドリング
- 認証エラー：401 Unauthorized
- バリデーションエラー：400 Bad Request
- データベースエラー：500 Internal Server Error
- 適切なエラーメッセージをクライアントに返す

### 型定義の管理

#### 共通型定義の配置
- `src/types/`ディレクトリに集約
- データベーススキーマに対応する型を定義
- API レスポンスの型を明示的に定義

#### Supabaseの型生成
```bash
# Supabaseから型定義を自動生成（必要に応じて）
npx supabase gen types typescript --project-id [project-id] > src/types/database.ts
```

### デバッグとトラブルシューティング

#### デバッグ用エンドポイント
- `/api/debug`でデータベース接続状態を確認
- 開発環境でのみ有効化（環境変数で制御）
- テーブルの存在確認、データ件数の取得

#### よくある問題と解決策
1. **CORS エラー**：Next.jsのAPI Routesは同一オリジンなので通常発生しない
2. **認証エラー**：Clerkのミドルウェア設定を確認
3. **データベースエラー**：Supabaseダッシュボードでクエリログを確認
4. **型エラー**：`npx tsc --noEmit`で事前チェック

### パフォーマンス最適化

#### データフェッチング
- 必要なフィールドのみselect
- ページネーションの実装（limit/offset）
- インデックスの活用

#### キャッシング戦略
- 静的なデータ（カテゴリ等）はクライアントでキャッシュ
- React QueryやSWRの活用を検討

### セキュリティベストプラクティス

#### 環境変数の管理
- `.env.local`は絶対にコミットしない
- `.env.example`で必要な環境変数を文書化
- Service Roleキーはサーバーサイドでのみ使用

#### 入力値の検証
- zodによるスキーマバリデーション
- SQLインジェクション対策（Supabaseクライアントが自動エスケープ）
- XSS対策（Reactが自動エスケープ）
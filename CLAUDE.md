# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code)へのガイダンスを提供します。

## コマンド

### 開発
- `npm run dev` - 高速リフレッシュのためのTurbopackを使用して開発サーバーを起動
- `npm run build` - 最適化された本番ビルドを作成
- `npm run start` - 本番サーバーを起動（ビルド後に実行）
- `npm run lint` - ESLintを実行してコード品質をチェック

## アーキテクチャ

これはTypeScriptとTailwind CSS v4を使用したApp Routerアーキテクチャを採用したNext.js 15アプリケーションです。

### 技術スタック
- **Next.js 15.4.6** App Router使用 (`/src/app/`)
- **React 19.1.0**
- **TypeScript** strictモード有効
- **Tailwind CSS v4** スタイリング用（セットアップ詳細は`.claude/tailwind_document.md`参照）
- **Geistフォントファミリー** Google Fontsから

### プロジェクト構造
- `/src/app/` - App Routerのページとレイアウト
- `/src/app/globals.css` - Tailwindインポートを含むグローバルスタイル
- `/public/` - 静的アセット
- パスエイリアス: `@/*`は`./src/*`にマップ

### 主要な設定
- **TypeScript**: Strictモード有効、ES2017ターゲット
- **ESLint**: TypeScriptサポート付きNext.js core web vitalsルール
- **Tailwind**: PostCSS付きv4、CSSカスタムプロパティによるダークモードサポート含む

### 開発ノート
- 現在テストフレームワークは未インストール
- 開発環境では高速ビルドのためTurbopackがデフォルトで有効
- CSSはテーマ設定（ライト/ダークモード）にカスタムプロパティを使用
- Vercelデプロイ対応済み

## デザインシステム

UIデザインを実装する際は、必ず`.claude/design_system.md`のガイドラインに従ってください。このファイルには以下が定義されています：

- **配色システム**: WCAGアクセシビリティ基準を満たすカラーパレット
- **タイポグラフィ**: フォントサイズ、ウェイト、行間の階層
- **コンポーネント設計**: ボタン、カード、入力フィールドなどの標準仕様
- **余白・角丸**: 8pxベースの一貫した余白システムと角丸ルール
- **アクセシビリティ**: コントラスト比、タッチターゲット、キーボード操作の要件

重要な原則：
- Tailwind CSSのユーティリティクラスのみを使用（個別CSSは不使用）
- 全てのインタラクティブ要素に影を付与
- 最小タッチターゲット44px確保
- WCAGコントラスト要件の遵守（通常テキスト4.5:1以上）

## Supabase統合

Supabaseの使用方法については`.claude/supabase_document.md`を参照してください。このドキュメントでは、Dockerを使用しない開発環境のセットアップ（方法1: クラウドベース）を前提としています。

### Supabaseドキュメントの概要
- **開発環境**: Supabaseクラウド環境を使用（Docker Desktop不要）
- **データベース設計**: マイグレーションファイルによるスキーマ管理
- **CRUD操作**: 基本的なデータ操作パターン
- **RLS**: Row Level Securityによるアクセス制御
- **リアルタイム機能**: WebSocketを使用したリアルタイム更新
- **ファイルストレージ**: 画像やファイルの管理
- **本番環境**: 開発環境と本番環境の分離と管理
- **トラブルシューティング**: よくあるエラーと解決方法

詳細な実装方法については、`.claude/supabase_document.md`を参照してください。

## Clerk認証・課金システム

認証機能やサブスクリプション・課金機能の実装については`.claude/clerk_document.md`を参照してください。

### Clerkドキュメントの概要
- **認証システム**: Clerkを使用したユーザー認証（サインアップ/サインイン）
- **課金システム**: Clerk Billing（Stripeベース）によるサブスクリプション管理
- **アクセス制御**: プラン別のアクセス制御実装
- **料金ページ**: 料金表示と決済フローの実装
- **ベストプラクティス**: 実装時の推奨事項
- **トラブルシューティング**: よくある問題と解決方法

### 技術スタック
- 認証: Clerk
- 課金: Clerk Billing（Stripeベース）
- データベース: Supabase（オプション）
- フレームワーク: Next.js 15（App Router）
- スタイリング: TailwindCSS

詳細な実装方法については、`.claude/clerk_document.md`を参照してください。

## ClerkとSupabaseの連携

ClerkとSupabaseを統合してRow Level Security (RLS)を実装する方法については`.claude/clerk_supabase_integration_document.md`を参照してください。

### 連携ドキュメントの概要
- **RLS統合の課題**: ClerkとSupabaseのユーザーID互換性問題
- **推奨実装方法**: カスタムヘッダー方式（API Routes経由）
- **環境別対応**: Supabase Docker CLIとSupabase Cloud両方で動作
- **セキュリティ**: 安全なデータアクセス制御の実装
- **実装パターン**: サーバーサイドとクライアントサイドの使い分け

### 推奨アプローチ
- Supabase Docker CLI環境: カスタムヘッダー方式を使用
- Supabase Cloud環境: カスタムヘッダー方式（推奨）またはJWT方式
- 両環境で統一した実装: カスタムヘッダー方式（API Routes経由）

詳細な実装方法については、`.claude/clerk_supabase_integration_document.md`を参照してください。

## Tailwind CSS v4セットアップ

Tailwind CSS v4のセットアップと設定方法については`.claude/tailwind_document.md`を参照してください。

### Tailwindドキュメントの概要
- **ゼロコンフィグレーション**: v4ではデフォルトで設定ファイル不要
- **必要な設定**: PostCSS設定とCSSインポートのみ
- **重要な変更点**: v3からv4への移行時の注意事項
- **推奨事項**: デフォルトのユーティリティクラスを使用し、カスタムCSSは最小限に

### v4での主な変更
- `@import "tailwindcss"`を使用（v3の`@tailwind`ディレクティブは廃止）
- 設定ファイル（`tailwind.config.js`）はオプショナル
- PostCSS設定で`@tailwindcss/postcss`プラグインを使用

詳細なセットアップ手順については、`.claude/tailwind_document.md`を参照してください。
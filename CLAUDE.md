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
- **Tailwind CSS v4** スタイリング用
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
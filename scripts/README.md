# Scripts

開発・運用で使用するスクリプト群です。

## コマンド一覧

### データベース (db)

```bash
# マイグレーション生成
pnpm db:generate

# スキーマをDBに反映
pnpm db:push

# シーダー実行（インタラクティブ）
pnpm db:seed

# 全シーダー実行
pnpm db:seed:all

# データ削除（インタラクティブ）
pnpm db:clear

# 全データ削除
pnpm db:clear:all

# DB構築 + 全シード（初期セットアップ）
pnpm db:setup
```

詳細: [db/seed/README.md](./db/seed/README.md)

### ドメイン設定 (dc)

```bash
# domain.json テンプレート作成
pnpm dc:init -- <Domain>

# ファイル生成
pnpm dc:generate -- <Domain>

# 全ドメイン生成（ファイル選択）
pnpm dc:generate:all

# ドメイン削除
pnpm dc:delete -- <Domain>

# フィールド追加
pnpm dc:add -- <Domain>
```

### 設定管理 (sc)

```bash
# 設定テンプレート作成
pnpm sc:init -- <SettingKey>

# 設定ファイル生成
pnpm sc:generate -- <SettingKey>

# 設定一覧表示
pnpm sc:list

# 設定項目追加
pnpm sc:add -- <SettingKey>

# 設定項目削除
pnpm sc:remove -- <SettingKey>
```

### メール (mail)

```bash
# テストメール送信
pnpm mail:test

# カラーパレット生成
pnpm mail:generate-colors
```

### Claude API

```bash
# API接続確認
pnpm claude:test
```

事前設定: `.env.development` に `ANTHROPIC_API_KEY` を設定

## ディレクトリ構成

```
scripts/
├── README.md              # このファイル
├── test-claude-api.ts     # Claude API 接続確認
├── db/                    # データベース関連
│   ├── seed/              # シーダー
│   └── clear/             # データ削除
├── domain-config/         # ドメイン設定生成
├── setting-config/        # 設定管理
└── mail/                  # メール関連
```

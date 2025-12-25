# プロジェクト固有ルール

このディレクトリには、フォーク先のプロジェクト固有の指示を配置します。

## 重要：記述フォーマット

このディレクトリ内のファイル（README.md を除く）は **AIエージェントが読むことに特化** しています。以下のルールに従って記述してください：

- **言語**: 英語のみ（AIの処理効率が高い）
- **形式**: 箇条書き、キーバリュー形式、YAML風の構造化データを推奨
- **コンテキスト節約**: 冗長な説明を避け、簡潔に記述
- **例より規則**: 長い例文より、明確なルール定義を優先

### 推奨フォーマット例

```markdown
# domain-rules

## payment
- handler: src/features/payment/
- external_api: Stripe
- webhook_path: /api/webhook/stripe

## email
- wrapper: src/lib/email/
- provider: SendGrid
- templates: src/templates/email/
```

## 使い方

1. このディレクトリに `.md` ファイルを追加すると、自動的に読み込まれます
2. ベースの `CLAUDE.md` は変更せず、追加ルールのみをここに記述します

## ディレクトリ構造例

```
.claude/rules/
├── README.md           # このファイル（人間向け・日本語）
├── project.md          # プロジェクト概要・ルール
├── api-rules.md        # API固有のルール
└── domain/             # ドメイン別のルール（サブディレクトリも可）
    └── users.md
```

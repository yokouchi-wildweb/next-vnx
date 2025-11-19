# Repository Guidelines

回答、対話、コメントの記載については
日本語で行うこと

作業前に下記のドキュメントは必ず確認して方針を把握する
README.md
docs/!must-read/アプリ構築における構成層.md
docs/!must-read/コンポーネントの設計と切り分け方.md
docs/!must-read/エラーハンドリング方針.md
docs/!must-read/ドメイン内のエンティティ管理方針.md

---

Inport は基本的に `@` から始まるパスを使用し `../../` のような相対パスは使用しない

---

汎用コンポーネントが用意されているものは
生のHTML要素を使わずに該当のコンポーネントを使用

特にボタン要素など下記フォルダに存在するコンポーネントは必ず確認すること
src/components/Form
フォーム部品

src/components/Layout
div, section の代替え要素や
フレックスレイアウト用の要素がある
"space-y-4"のようなレイアウト用クラスは極力使わず
ここのコンポーネントの space などバリアントを使用

src/components/TextBlocks
p, h2 の代替えなど文章構成用

---

下記のディレクトリおよびファイルは
システムコアなので
変更を加える必要が発生した場合は
作業をする前に
コアファイルを修正する旨を明示
作業内容の提案のみを行う

■ システムコア
- src/lib 以下すべて
- src/features/auth 以下すべて
- src/components 以下すべて
- scripts/domain-config 以下すべて
- src/styles/config.css
- src/styles/z-layer.css
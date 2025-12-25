# next-vnx

Next.jsベースのビジュアルノベルエンジン + エコシステム（SaaS）

> このプロジェクトは [next-starter](https://github.com/nicories/next-starter) からのフォークです

---

## ミッション

> **「今の時代だからこそできること」を、誰よりも先に形にする**

- Ren'Py、ティラノに並ぶ第三の選択肢「VN界のNext.js」を目指す
- AI統合とメタ演出（第四の壁破壊）による前衛的な体験設計
- Web技術ならではの強み（URL即プレイ、ブラウザAPI活用）を最大化

---

## アーキテクチャ

### レイヤー分離

```
┌─────────────────────────────────────────────────────────┐
│  DDD 8層アーキテクチャ（features/）                       │
│  → スタジオ機能、データ永続化、認証、API                   │
│                                                         │
│  features/project/    # プロジェクトCRUD                  │
│  features/scenario/   # シナリオデータ管理                 │
│  features/asset/      # アセット管理                      │
└─────────────────────────────────────────────────────────┘
                          │
                          │ データを渡す
                          ▼
┌─────────────────────────────────────────────────────────┐
│  engine/ （DDD外、純粋なゲーム実行エンジン）                │
│  → DBアクセスなし、APIなし、受け取ったデータを再生するだけ   │
│                                                         │
│  engine/renderer/     # PixiJS, Live2D                   │
│  engine/audio/        # Howler.js                        │
│  engine/executor/     # シーン実行                        │
└─────────────────────────────────────────────────────────┘
```

### ディレクトリ構造

```
next-vnx/
├── src/
│   ├── app/
│   │   ├── lab/              # 実験場（画面モック）
│   │   └── play/[projectId]/ # ゲーム実行
│   ├── engine/               # VNエンジン（DDD外）
│   └── features/             # DDD層（スタジオ機能）
├── game/                     # サンプルゲームデータ
│   ├── config.json
│   ├── characters/
│   ├── scenes/
│   └── assets/
└── docs/
```

---

## 開発アプローチ

**ボトムアップ・プロトタイピング**

```
画面モック（ハードコード）
        │
        ▼
「これを再現するには何が必要？」
        │
        ▼
設定ファイル + 汎用ロジックに分離
        │
        ▼
エンジン層が自然に形成される
```

1. `/lab/001-xxx/` で画面モックを作る（ハードコード OK）
2. 動いたら「何を設定ファイルにすべきか」を考える
3. `engine/` に切り出す
4. 次のモックへ

---

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (React 19, App Router) |
| レンダリング | PixiJS, pixi-live2d-display |
| 状態管理 | Zustand |
| オーディオ | Howler.js |
| AI | Claude/OpenAI SDK |
| TTS | ElevenLabs, Web Speech API |
| DB | Drizzle (PostgreSQL), Firestore |
| 認証 | Firebase Auth + JWT |

---

## 開発ドキュメント

➡️ **[docs/!must-read/](docs/!must-read/README.md)**

- 動作要件
- アーキテクチャ概要
- ディレクトリ構造
- コンポーネント設計ガイドライン
- エラーハンドリング戦略

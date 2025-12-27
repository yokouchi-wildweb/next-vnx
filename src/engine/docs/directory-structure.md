# ディレクトリ構成

## 全体構造

```
engine/
├── components/         # 共有・プリミティブコンポーネント
│   ├── Screen/         # 画面制御（実装済み）
│   │   ├── GameScreen.tsx
│   │   ├── GameContainer.tsx
│   │   ├── GameScreenContext.tsx
│   │   ├── PixiCanvas.tsx
│   │   ├── Letterbox.tsx
│   │   └── useGameScreen.ts
│   ├── pixi/           # 純PixiJS部品
│   └── html/           # 純HTML部品
│
├── features/           # 機能単位（DDD風）
│   ├── Dialogue/
│   ├── Choice/
│   ├── Background/
│   └── SystemMenu/
│
├── factories/          # コンポーネント生成ファクトリ
│   └── createWidget.tsx
│
├── scenes/             # シーン構成
│   └── NovelScene.tsx
│
├── stores/             # エンジン用ストア
│   └── bgm/
│
├── audio/              # オーディオ管理
├── types/              # 型定義
├── utils/              # ユーティリティ
└── docs/               # ドキュメント（このフォルダ）
```

## features/ の内部構造

各Feature（例: Dialogue）の構成:

```
features/Dialogue/
├── components/         # 純粋なUIパーツ
│   ├── MessageBox.tsx
│   ├── CharacterName.tsx
│   └── index.ts
├── widget/             # Scene用（ファクトリで生成）
│   ├── DialogueWidget.tsx
│   └── index.ts
├── hooks/              # 状態・ロジック
│   ├── useDialogue.ts
│   └── index.ts
├── constants.ts        # 設定値
├── types.ts            # 型定義
└── index.ts            # 公開API
```

### フォルダ役割

| フォルダ | 役割 | 命名規則 |
|----------|------|----------|
| `components/` | 純粋なUIパーツ（配置を意識しない） | XxxBox, XxxArea |
| `widget/` | Scene配置用（ファクトリ適用済み） | XxxWidget |
| `hooks/` | 状態管理・ロジック | useXxx |

### PixiJS / HTML の分離

Featureが両方を持つ場合:

```
features/Dialogue/
├── components/
│   ├── canvas/              # PixiJS部分
│   │   └── DialogueCharacters.tsx
│   └── ui/                  # HTML部分
│       └── DialogueMessageArea.tsx
├── widget/
│   ├── DialogueCanvasWidget.tsx
│   └── DialogueUIWidget.tsx
```

## src/features/ との違い

| 項目 | src/features/ (DDD) | engine/features/ |
|------|---------------------|------------------|
| entities/ | あり（schema, drizzle） | なし |
| services/ | あり（client/server） | なし |
| hooks/ | あり | あり |
| components/ | あり | あり |
| widget/ | なし | あり |
| DB/API | 使う | 使わない |

## 命名規則

| 種類 | 規則 | 例 |
|------|------|-----|
| フォルダ | PascalCase | Dialogue/, SystemMenu/ |
| コンポーネント | PascalCase | MessageBox.tsx |
| Widget | XxxWidget | DialogueWidget.tsx |
| Hook | useCamelCase | useDialogue.ts |
| 定数 | UPPER_SNAKE | DIALOGUE_LAYOUT |
| 型 | PascalCase | DialogueState |

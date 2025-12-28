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
├── components/         # 純粋な React (HTML) パーツ
│   ├── MessageBox.tsx
│   └── SpeakerName.tsx
├── sprites/            # 純粋な PixiJS パーツ
│   └── Character.tsx
├── widget/             # ファクトリ適用済み（Scene用）
│   ├── DialogueMessage.tsx         # createWidget
│   └── DialogueCharacterSprite.tsx # createSprite
├── hooks/
│   └── useDialogue.ts
├── constants.ts
├── types.ts
└── index.ts            # widget/ から再エクスポート
```

### フォルダ役割

| フォルダ | 役割 | ファクトリ | 命名規則 |
|----------|------|------------|----------|
| `components/` | 純粋な React (HTML) パーツ | - | 自由 |
| `sprites/` | 純粋な PixiJS パーツ | - | 自由 |
| `widget/` | Scene用（ファクトリ適用済み） | createWidget / createSprite | サフィックスで区別 |
| `hooks/` | 状態管理・ロジック | - | useXxx |

### widget/ 内の命名規則

| レイヤー | サフィックス | 例 |
|----------|--------------|-----|
| PixiJS | `Sprite` | DialogueCharacterSprite |
| React/HTML | なし | DialogueMessage, SystemMenu |

widget/ 内は全てファクトリで生成された安全なコンポーネント。
サフィックスでどちらのレイヤーか判別可能。

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
| Hook | useCamelCase | useDialogue.ts |
| 定数 | UPPER_SNAKE | DIALOGUE_LAYOUT |
| 型 | PascalCase | DialogueState |

### エクスポート名の命名規則

レイヤーに応じたサフィックスで区別する:

| レイヤー | サフィックス | 例 |
|----------|--------------|-----|
| PixiJS（Canvas内） | `Sprite` | BackgroundSprite, CharacterSprite |
| React/HTML | なし | DialogueMessage, SystemMenu, Choice |

```tsx
// PixiJS層: XXXSprite
BackgroundSprite
DialogueCharacterSprite
EffectSprite

// HTML層: サフィックスなし（標準Reactコンポーネント）
DialogueMessage
SystemMenu
Choice
```

**ルール**: `Sprite` がついていれば PixiJS、なければ普通の React コンポーネント

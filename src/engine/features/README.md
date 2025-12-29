# Features

## 概要

Feature は VN エンジンの機能単位。background、character、dialogue、audio など。
各 Feature は自己完結的で、SceneInitializer や Executor は Feature の内部構造を知らない。

## Feature Bundle

```ts
export const featureName = {
  name: "featureName",           // 識別子（Single Source of Truth）
  commands: { ... },             // コマンドハンドラー
  Sprites: { ... },              // PixiJS コンポーネント
  Widgets: { ... },              // HTML コンポーネント（単体）
  Layers: { ... },               // HTML コンポーネント（グループ）
  hooks: { ... },                // 状態読み取り/更新フック
}
```

## 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| フォルダ名 | lowercase | `background/`, `character/` |
| Feature Bundle export | camelCase | `export const background` |
| name プロパティ | camelCase | `name: "background"` |
| Sprites/Widgets/Layers のキー | PascalCase | `Sprites: { Background: ... }` |
| コンポーネント | PascalCase | `BackgroundSprite`, `NameCardWidget` |

### exports/ のエクスポート命名規則

| 命名 | 種別 | 用途 |
|------|------|------|
| サフィックスなし（Standing, MessageList） | 生コンポーネント | 他 Feature での再利用 |
| *Sprite/*Widget/*Layer | factory 済み | arrangement での直接配置 |

```ts
// character/exports/index.ts
export { Standing } from "../sprites/Standing"      // 生、再利用向け
export { CharacterSprite } from "./CharacterSprite" // wrapped、arrangement向け

// dialogue-v2 で再利用する場合
import { Standing } from "@/engine/features/character/exports"  // 生を import
```

## ディレクトリ構成

```
features/
├── index.ts                    # 全 Feature 再エクスポート
│
└── <featureName>/              # lowercase
    ├── commands/               # コマンドハンドラー（ロジック）
    │   └── index.ts
    ├── components/             # 内部 React コンポーネント
    ├── sprites/                # 内部 PixiJS コンポーネント
    ├── exports/                # 公開インターフェース
    │   └── index.ts            # Feature Bundle（再エクスポート）
    ├── hooks/                  # 状態フック
    ├── stores/                 # Zustand ストア
    └── types.ts
```

## name プロパティ

Feature Bundle の `name` が唯一の識別子定義。

```ts
export const background = {
  name: "background",
  // ...
}
```

使用箇所：
- SceneTypeDefinition での参照（arrangement ヘルパー内で使用）
- Command type の namespace

## commands/

Feature が処理するコマンドのハンドラー。

```ts
// background/commands/index.ts
import type { Scene } from "@/engine/types"
import { backgroundStore } from "../stores"

export const backgroundCommands = {
  // init は scene 全体を受け取り、必要なデータを自分で取り出す
  init: (scene: Scene) => {
    if (scene.backgrounds) {
      backgroundStore.getState().initialize(scene.backgrounds, scene.initialBackground)
    }
  },
  change: (data: { value: string }) => {
    backgroundStore.getState().setBackground(data.value)
  },
}
```

## Command type 形式

`featureName:action` で統一。

```
background:init
background:change
character:show
character:hide
dialogue:next
audio:bgm
```

## SceneTypeDefinition での使用

Feature を直接インポートし、ヘルパー関数で型安全に配置を定義。

```ts
// scene/dialogue.ts
import { background, character, dialogue } from "@/engine/features"
import { sprite, customLayer, widget } from "@/engine/core/arrangement"

export const dialogueScene: SceneTypeDefinition = {
  features: [background, character, dialogue],
  arrangement: {
    sprites: [
      sprite(background, "Background", 0),   // IDE補完が効く
      sprite(character, "Character", 10),
    ],
    layers: [
      customLayer(100, [
        widget(dialogue, "MessageList"),
        widget(character, "NameCard", 10),
      ]),
    ],
  },
}
```

ヘルパー関数:
- `sprite(feature, component, zIndex)` - Sprite を配置
- `layer(feature, component, zIndex)` - Feature 提供の Layer を配置
- `customLayer(zIndex, widgets)` - Widget をグループ化して配置
- `widget(feature, component, zIndex?)` - customLayer 内で Widget を配置

## SceneInitializer との連携

1. scene.type から SceneTypeDefinition を取得
2. definition.features から Feature bundles を取得（直接参照）
3. 各 Feature の `commands.init` に scene 全体を渡す

```ts
for (const feature of featureMap.values()) {
  feature.commands.init?.(scene)
}
```

Feature 側で scene から必要なデータを取り出す（SceneInitializer は Feature の内部構造を知らない）。

## Executor との連携

```ts
const executeCommand = (cmd: Command) => {
  const [featureName, action] = cmd.type.split(":")
  featureMap.get(featureName)?.commands[action]?.(cmd)
}

// 例
executeCommand({ type: "background:change", value: "night" })
```

## exports/ の役割

純粋な再エクスポートのみ。ロジックは commands/ に書く。

```ts
// exports/index.ts
import { backgroundCommands } from "../commands"
import { useBackground, useBackgroundActions } from "../hooks"
import { BackgroundSprite } from "./BackgroundSprite"

export const background = {
  name: "background",
  commands: backgroundCommands,
  Sprites: {
    Background: BackgroundSprite,
  },
  Layers: {},
  Widgets: {},
  hooks: {
    useBackground,
    useBackgroundActions,
  },
}
```

## Widgets と Layers の違い

| 種類 | 役割 | 配置方法 |
|------|------|---------|
| Widget | 単体の部品 | `customLayer()` 内で `widget()` を使用 |
| Layer | 完成品（Widget 内包済み） | `layer()` で直接配置 |

## 責務分離

| 場所 | 責務 |
|------|------|
| commands/ | ロジック（store 操作） |
| stores/ | 状態管理 |
| hooks/ | React 向け状態アクセス |
| exports/ | 公開インターフェース（再エクスポート） |
| components/ | 内部 UI コンポーネント |
| sprites/ | 内部 PixiJS コンポーネント |

## Sprite コンポーネントの設計原則

### 1. props ベースで設計する

Sprite コンポーネントは Store に依存せず、props で全ての状態を受け取る。

**❌ 悪い例: Store に依存**
```tsx
function Standing() {
  const { spritePath, position } = useCharacterStore()  // Store 固定
  // ...
}
```
→ 1つの Store = 1インスタンスしか表示できない

**✅ 良い例: props で受け取る**
```tsx
function Standing({ spritePath, x, y, widthPercent }: StandingProps) {
  // props をそのまま使用
}
```
→ 複数インスタンス表示可能、利用側が自由に制御

### 2. 画面サイズに対する相対レイアウト

Sprite は `absolute inset-0` の親コンテナ内に配置される前提。
**画面内のどこにでも自由に配置できる**必要がある。

| props | 説明 |
|-------|------|
| `x` | 画面幅に対する X 座標（0-1） |
| `y` | 画面高さに対する Y 座標（0-1） |
| `widthPercent` | 画面幅に対するサイズ（%） |
| `anchorX/Y` | スプライトのどこを x,y に合わせるか |

### 3. 特殊な設定は利用側の責務

**❌ 悪い例: Feature 内で特殊設定を持つ**
```tsx
// character/defaults.ts
export const defaultVerticalPullUp = 0.8  // 特殊すぎる
```

**✅ 良い例: 汎用的なデフォルトのみ**
```tsx
// character/defaults.ts
export const defaultAnchorX = 0.5  // 中央
export const defaultAnchorY = 1    // 下端
```

「キャラクターを下から 80% の位置に配置」は dialogue など利用側で設定する。

### 4. Store の使い所

| Feature 種別 | Store | 例 |
|-------------|-------|-----|
| 基礎 Feature | 不要 | character（純粋な Sprite 表示） |
| 複合 Feature | 必要 | dialogue（messages + キャラクター状態を管理） |

基礎 Feature は Store を持たず、複合 Feature が状態管理を担当。
基礎 Feature の Sprite を複合 Feature が import して、位置情報などを付加して再利用する。

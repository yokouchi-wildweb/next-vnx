# Features

## 概要

Feature は VN エンジンの機能単位。Background、Character、Dialogue、Audio など。
各 Feature は自己完結的で、SceneController や Executor は Feature の内部構造を知らない。

## Feature Bundle

```ts
export const FeatureName = {
  name: "FeatureName",           // 識別子（Single Source of Truth）
  commands: { ... },             // コマンドハンドラー
  Sprites: { ... },              // PixiJS コンポーネント
  Widgets: { ... },              // HTML コンポーネント（単体）
  Layers: { ... },               // HTML コンポーネント（グループ）
  hooks: { ... },                // 状態読み取り/更新フック
}
```

## ディレクトリ構成

```
features/
├── index.ts                    # 全 Feature 再エクスポート
│
└── <FeatureName>/
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
export const Background = {
  name: "Background",
  // ...
}
```

使用箇所：
- SceneTypeDefinition での参照（arrangement ヘルパー内で使用）
- Command type の namespace

## commands/

Feature が処理するコマンドのハンドラー。

```ts
// Background/commands/index.ts
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

`FeatureName:action` で統一。

```
Background:init
Background:change
Character:show
Character:hide
Dialogue:next
Audio:bgm
```

## SceneTypeDefinition での使用

Feature を直接インポートし、ヘルパー関数で型安全に配置を定義。

```ts
// scene/dialogue.ts
import { Background, Character, Dialogue } from "@/engine/features"
import { sprite, customLayer, widget } from "@/engine/core/arrangement"

export const dialogueScene: SceneTypeDefinition = {
  features: [Background, Character, Dialogue],
  arrangement: {
    sprites: [
      sprite(Background, "Background", 0),   // IDE補完が効く
      sprite(Character, "Character", 10),
    ],
    layers: [
      customLayer(100, [
        widget(Dialogue, "MessageList"),
        widget(Character, "NameCard", 10),
      ]),
    ],
  },
}
```

ヘルパー関数:
- `sprite(Feature, component, zIndex)` - Sprite を配置
- `layer(Feature, component, zIndex)` - Feature 提供の Layer を配置
- `customLayer(zIndex, widgets)` - Widget をグループ化して配置
- `widget(Feature, component, zIndex?)` - customLayer 内で Widget を配置

## SceneController との連携

1. scene.type から SceneTypeDefinition を取得
2. definition.features から Feature bundles を取得（直接参照）
3. 各 Feature の `commands.init` に scene 全体を渡す

```ts
for (const feature of featureMap.values()) {
  feature.commands.init?.(scene)
}
```

Feature 側で scene から必要なデータを取り出す（SceneController は Feature の内部構造を知らない）。

## Executor との連携

```ts
const executeCommand = (cmd: Command) => {
  const [featureName, action] = cmd.type.split(":")
  featureMap.get(featureName)?.commands[action]?.(cmd)
}

// 例
executeCommand({ type: "Background:change", value: "night" })
```

## exports/ の役割

純粋な再エクスポートのみ。ロジックは commands/ に書く。

```ts
// exports/index.ts
import { backgroundCommands } from "../commands"
import { useBackground, useBackgroundActions } from "../hooks"
import { BackgroundSprite } from "./BackgroundSprite"

export const Background = {
  name: "Background",
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

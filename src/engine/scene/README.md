# Scene

## 概要

シーンタイプ（Archetype）を定義するフォルダ。
シナリオ作者がゲームに必要なシーンタイプを追加する場所。

## ディレクトリ構成

```
scene/
├── index.ts        # 全シーンタイプ再エクスポート
├── dialogue.ts     # ダイアログシーン
├── battle.ts       # バトルシーン（例）
└── exploration.ts  # 探索シーン（例）
```

## SceneTypeDefinition

シーンタイプは `SceneTypeDefinition` に従って定義。

```ts
type SceneTypeDefinition = {
  features: FeatureBundle[]   // 使用する Feature
  arrangement: Arrangement    // 配置設定
}
```

## 配置設定（Arrangement）

```ts
type Arrangement = {
  sprites?: SpriteItem[]   // PixiJS Sprite（Canvas内）
  layers?: LayerItem[]     // HTML Layer（DOM）
}
```

### zIndex の役割

| レイヤー | 配置先 | zIndex の意味 |
|---------|--------|--------------|
| Sprites | PixiCanvas 内 | Sprite 間の重なり順 |
| Layers | DOM | Layer 間の重なり順（Sprites より前面） |
| Widgets | Layer 内 | Layer 内での相対的な重なり順 |

## ヘルパー関数

`@/engine/core/arrangement` から import。

### sprite()

Feature の Sprite を配置。

```ts
sprite(Feature, component, zIndex)

// 例
sprite(Background, "Background", 0)
sprite(Character, "Character", 10)
```

### layer()

Feature 提供の Layer を直接配置。

```ts
layer(Feature, component, zIndex)

// 例
layer(Dialogue, "DialogueUI", 100)
```

### customLayer()

Widget をグループ化して Layer を構成。

```ts
customLayer(zIndex, [
  widget(Feature, component, relativeZIndex?),
  ...
])

// 例
customLayer(100, [
  widget(Dialogue, "MessageList"),
  widget(Character, "NameCard", 10),
])
```

### widget()

customLayer 内で Widget を配置。

```ts
widget(Feature, component, zIndex?)

// zIndex は Layer 内での相対位置（省略可）
```

## 新しいシーンタイプの追加手順

### 1. ファイル作成

```ts
// scene/battle.ts
import type { SceneTypeDefinition } from "@/engine/types"
import { Background, Battle, UI } from "@/engine/features"
import { sprite, layer, customLayer, widget } from "@/engine/core/arrangement"

export const battleScene: SceneTypeDefinition = {
  features: [Background, Battle, UI],
  arrangement: {
    sprites: [
      sprite(Background, "Background", 0),
      sprite(Battle, "BattleField", 10),
    ],
    layers: [
      layer(Battle, "BattleUI", 100),
      customLayer(200, [
        widget(UI, "HPBar"),
        widget(UI, "ActionMenu", 10),
      ]),
    ],
  },
}
```

### 2. index.ts でエクスポート

```ts
// scene/index.ts
export { dialogueScene } from "./dialogue"
export { battleScene } from "./battle"
```

### 3. Scene Registry に登録

```ts
// core/registries/scene.ts
import { dialogueScene } from "@/engine/scene/dialogue"
import { battleScene } from "@/engine/scene/battle"

export const sceneRegistry: Record<string, SceneTypeDefinition> = {
  dialogue: dialogueScene,
  battle: battleScene,
}
```

## 型安全性

ヘルパー関数は Feature の型から補完が効く:

```ts
sprite(Background, "Background", 0)
//                 ↑ IDE補完: Background.Sprites のキー一覧

widget(Dialogue, "MessageList")
//               ↑ IDE補完: Dialogue.Widgets のキー一覧
```

存在しないコンポーネント名を指定するとコンパイルエラー。

## Widgets と Layers の使い分け

| 方式 | 使用場面 |
|------|---------|
| `layer(Feature, ...)` | Feature が提供する完成品 Layer |
| `customLayer([widget(...)])` | シーン定義側で Widget を自由に構成 |

Feature 側で Widget の組み合わせが決まっている場合は Layer として提供。
シーンごとに構成を変えたい場合は customLayer で Widget を組み合わせる。

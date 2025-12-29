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
  Widgets: { ... },              // HTML コンポーネント
  Layers: { ... },               // Widget グループ
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
- Feature Registry への登録キー
- SceneTypeDefinition での参照
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

## Feature Registry

`core/registries/feature.ts` で全 Feature を一括管理。

```ts
// core/registries/feature.ts
import type { FeatureBundle } from "@/engine/types"
import { Background } from "@/engine/features/Background/exports"
import { Character } from "@/engine/features/Character/exports"
import { Dialogue } from "@/engine/features/Dialogue/exports"

export const featureRegistry: Record<string, FeatureBundle> = {
  Background,
  Character,
  Dialogue,
}

export function getFeature(name: string): FeatureBundle | undefined {
  return featureRegistry[name]
}
```

Feature 側は自己登録しない。Registry が明示的に import して登録する。
これによりツリーシェイキング問題を回避し、登録状況を一箇所で把握できる。

## SceneController との連携

1. scene.type から SceneTypeDefinition を取得
2. definition.features から Feature bundles を取得
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

## 責務分離

| 場所 | 責務 |
|------|------|
| commands/ | ロジック（store 操作） |
| stores/ | 状態管理 |
| hooks/ | React 向け状態アクセス |
| exports/ | 公開インターフェース（再エクスポート） |
| components/ | 内部 UI コンポーネント |
| sprites/ | 内部 PixiJS コンポーネント |

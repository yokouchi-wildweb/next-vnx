# Scene構成ガイド

## 概要

Sceneは Feature や Widget を組み合わせて画面を構成する。
「どの機能を表示するか」「どの順序で積むか」を決定する。

## 基本構造

```tsx
// scenes/NovelScene.tsx
import { GameScreen, PixiCanvas } from "@/engine/components"
import { BackgroundCanvasWidget } from "@/engine/features/Background"
import { DialogueCanvasWidget, DialogueUIWidget } from "@/engine/features/Dialogue"
import { SystemMenuWidget } from "@/engine/features/SystemMenu"

export default function NovelScene() {
  return (
    <GameScreen displayConfig={displayConfig}>
      {/* PixiJS層 (z: 0) */}
      <PixiCanvas>
        <BackgroundCanvasWidget />
        <DialogueCanvasWidget />
      </PixiCanvas>

      {/* HTML層 (z: 10+) */}
      <DialogueUIWidget />
      <SystemMenuWidget />
    </GameScreen>
  )
}
```

## Sceneの責務

| 責務 | 説明 |
|------|------|
| 登場配置 | どのWidgetを表示するか決定 |
| 積層順序 | z-index の相対順序を決定（上書き可能） |
| displayConfig | アスペクト比、レターボックス設定を渡す |
| 状態接続 | Feature間の状態接続（必要な場合） |

## Sceneが決めないこと

| 項目 | 責務の所在 |
|------|-----------|
| Widget内部のレイアウト | Feature（デフォルト）+ props上書き |
| 具体的な座標 | Feature内で管理 |
| コンポーネントの契約 | GameContainer が保証 |

## 複数Scene の例

### NovelScene（通常会話）

```tsx
export default function NovelScene() {
  return (
    <GameScreen>
      <PixiCanvas>
        <BackgroundCanvasWidget />
        <DialogueCanvasWidget />
      </PixiCanvas>
      <DialogueUIWidget />
      <SystemMenuWidget />
    </GameScreen>
  )
}
```

### TitleScene（タイトル画面）

```tsx
export default function TitleScene() {
  return (
    <GameScreen>
      <PixiCanvas>
        <BackgroundCanvasWidget />
        <TitleLogoWidget />
      </PixiCanvas>
      <TitleMenuWidget />
    </GameScreen>
  )
}
```

### ChoiceScene（選択肢表示）

```tsx
export default function ChoiceScene() {
  return (
    <GameScreen>
      <PixiCanvas>
        <BackgroundCanvasWidget />
        <DialogueCanvasWidget />
      </PixiCanvas>
      <DialogueUIWidget />
      <ChoiceWidget />  {/* 選択肢を追加 */}
      <SystemMenuWidget />
    </GameScreen>
  )
}
```

## 動的な構成

シナリオデータに基づいてWidgetを動的に表示/非表示:

```tsx
export default function NovelScene({ sceneData }) {
  return (
    <GameScreen>
      <PixiCanvas>
        <BackgroundCanvasWidget />
        <DialogueCanvasWidget />
        {sceneData.hasEffect && <EffectCanvasWidget />}
      </PixiCanvas>

      <DialogueUIWidget />
      {sceneData.showChoice && <ChoiceWidget />}
      <SystemMenuWidget />
    </GameScreen>
  )
}
```

## z-index の上書き

特定のシーンでz-indexを変更したい場合:

```tsx
<DialogueUIWidget zIndex={20} />  {/* デフォルト10を上書き */}
<ChoiceWidget zIndex={30} />
```

## Layerによるグループ化

複雑なシーンでは、関連するWidgetをLayerでグループ化できる。

### 基本的な使用

```tsx
import { Layer } from "@/engine/components"

function ComplexScene() {
  return (
    <GameScreen>
      <PixiCanvas>...</PixiCanvas>

      {/* 会話系をグループ化 */}
      <Layer zIndex={10}>
        <DialogueUIWidget />
        <CharacterNameWidget />
      </Layer>

      {/* 選択系 */}
      <Layer zIndex={50} visible={showChoice}>
        <ChoiceWidget />
      </Layer>

      {/* システム系 */}
      <Layer zIndex={100}>
        <SystemMenuWidget />
      </Layer>
    </GameScreen>
  )
}
```

### Layerの特徴

| 特徴 | 説明 |
|------|------|
| スタッキングコンテキスト | Layer内のz-indexは外部に影響しない |
| グループ表示制御 | `visible={false}` でグループ全体を非表示 |
| z-index分離 | Layer間の積層順序が確実に保証される |

### スタッキングコンテキストの効果

```tsx
<Layer zIndex={50}>
  <div style={{ zIndex: 9999 }}>どんなに大きくても...</div>
</Layer>

<Layer zIndex={100}>
  <div style={{ zIndex: 1 }}>こちらの方が上</div>
</Layer>
```

Layer内でどんな z-index を指定しても、他のLayerには絶対に干渉しない。

### 使い分け

| シーン構成 | 推奨 |
|------------|------|
| シンプル（Widget数個） | Widgetを直接配置 |
| 複雑・条件付き表示 | Layerでグループ化 |
| デバッグ時 | Layerで関心事を分離 |

Layerは必須ではなく、必要な時に使うオプション。

## Feature間の状態共有

Featureの状態を別のFeatureで使う場合、Scene側で接続:

```tsx
function NovelScene() {
  const dialogue = useDialogue()
  const background = useBackground()

  // 話者に応じて背景を変える
  useEffect(() => {
    if (dialogue.currentSpeaker === "narrator") {
      background.setFilter("sepia")
    }
  }, [dialogue.currentSpeaker])

  return (
    <GameScreen>
      <PixiCanvas>
        <BackgroundCanvasWidget filter={background.filter} />
        <DialogueCanvasWidget speaker={dialogue.currentSpeaker} />
      </PixiCanvas>
      <DialogueUIWidget messages={dialogue.messages} />
    </GameScreen>
  )
}
```

## Feature以外の要素

Sceneには Feature Widget 以外も配置可能:

```tsx
function DebugScene() {
  return (
    <GameScreen>
      <PixiCanvas>...</PixiCanvas>
      <DialogueWidget />

      {/* Feature外の要素も混在OK */}
      <DebugOverlay />
      <FPSCounter />
    </GameScreen>
  )
}
```

これらは createWidget を使わなくてもよいが、
配置契約（absolute, %ベース）は守ること。

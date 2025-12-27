# Feature実装ガイド

## 概要

Featureは「機能単位」のモジュール。
1つのFeatureが PixiJS部分 + HTML部分 + 共有状態 を持つことができる。

## createWidget ファクトリ

### 定義

```tsx
// engine/factories/createWidget.tsx
type WidgetConfig = {
  zIndex: number
  name: string  // デバッグ用
}

export function createWidget<P extends object>(
  Component: React.ComponentType<P>,
  config: WidgetConfig
) {
  function Widget(props: P & { zIndex?: number; className?: string }) {
    const { zIndex = config.zIndex, className, ...rest } = props
    return (
      <div
        className={cn("absolute inset-0 pointer-events-none", className)}
        style={{ zIndex }}
        data-widget={config.name}
      >
        <Component {...(rest as P)} />
      </div>
    )
  }
  Widget.displayName = `${config.name}Widget`
  return Widget
}
```

### 使用例

```tsx
// features/Dialogue/widget/DialogueWidget.tsx
import { createWidget } from "@/engine/factories/createWidget"
import { DialogueUI } from "../components/DialogueUI"

export const DialogueWidget = createWidget(DialogueUI, {
  zIndex: 10,
  name: "Dialogue",
})
```

## Feature公開インターフェース

### 推奨パターン

```tsx
// features/Dialogue/index.ts
// Widgets
export { DialogueWidget } from "./widget"
export { DialogueCanvasWidget } from "./widget"

// Hooks
export { useDialogue, useCurrentSpeaker } from "./hooks"

// Types
export type { DialogueState, DialogueMessage } from "./types"

// Constants (必要な場合)
export { DIALOGUE_LAYOUT } from "./constants"
```

### オブジェクトとしてエクスポート（オプション）

```tsx
// features/Dialogue/index.ts
import { DialogueWidget, DialogueCanvasWidget } from "./widget"
import { useDialogue, useCurrentSpeaker } from "./hooks"

export const Dialogue = {
  Widget: DialogueWidget,
  CanvasWidget: DialogueCanvasWidget,
  useDialogue,
  useCurrentSpeaker,
}
```

## 配置の責務

### 3種類の配置

| 種類 | 例 | 責務 |
|------|-----|------|
| 登場配置 | このシーンにDialogueを出す/出さない | Scene |
| レイアウト配置 | メッセージは中央下、立ち絵は左右 | Feature（デフォルト）+ Scene（上書き） |
| インスタンス配置 | この立ち絵は左、あの立ち絵は右 | シナリオデータ → Feature内で処理 |

### レイアウト配置の実装

```tsx
// features/Dialogue/constants.ts
export const DIALOGUE_LAYOUT = {
  messageArea: {
    position: "center-bottom",
    bottomOffset: 35,  // %
    widthPercent: 40,
  },
  characters: {
    leftX: 18,   // 画面左から%
    rightX: 82,  // 画面左から%
  },
}

// features/Dialogue/components/DialogueUI.tsx
type Props = {
  layout?: Partial<typeof DIALOGUE_LAYOUT>
}

export function DialogueUI({ layout }: Props) {
  const config = { ...DIALOGUE_LAYOUT, ...layout }
  // config を使って配置
}
```

### Scene側での上書き

```tsx
// scenes/NovelScene.tsx
<DialogueWidget
  layout={{ messageArea: { bottomOffset: 20 } }}
/>
```

## PixiJS + HTML 混在Feature

Dialogueのような、PixiJSとHTMLの両方を持つFeature:

```
features/Dialogue/
├── components/
│   ├── canvas/
│   │   └── DialogueCharacters.tsx  # PixiJS: 立ち絵
│   └── ui/
│       ├── DialogueMessageArea.tsx # HTML: メッセージ
│       └── DialogueSpeakerName.tsx # HTML: 話者名
├── widget/
│   ├── DialogueCanvasWidget.tsx    # PixiCanvas内用
│   └── DialogueUIWidget.tsx        # HTML層用
├── hooks/
│   └── useDialogue.ts              # 共有状態
```

### Scene側での使用

```tsx
function NovelScene() {
  return (
    <GameScreen>
      <PixiCanvas>
        <Dialogue.CanvasWidget />   {/* 立ち絵 */}
      </PixiCanvas>

      <Dialogue.UIWidget />         {/* メッセージ */}
    </GameScreen>
  )
}
```

### 共有状態の管理

```tsx
// features/Dialogue/hooks/useDialogue.ts
export function useDialogue() {
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  return {
    currentSpeaker,
    messages,
    setCurrentSpeaker,
    addMessage,
    // ...
  }
}
```

Canvas側とUI側の両方がこのhookを使用して状態を共有する。

## 完全な実装例

```tsx
// features/Dialogue/index.ts
export { DialogueCanvasWidget, DialogueUIWidget } from "./widget"
export { useDialogue } from "./hooks"
export { DIALOGUE_LAYOUT } from "./constants"

// scenes/NovelScene.tsx
import {
  DialogueCanvasWidget,
  DialogueUIWidget,
  useDialogue
} from "@/engine/features/Dialogue"

function NovelScene() {
  const dialogue = useDialogue()

  return (
    <GameScreen>
      <PixiCanvas>
        <BackgroundCanvasWidget />
        <DialogueCanvasWidget speaker={dialogue.currentSpeaker} />
      </PixiCanvas>

      <DialogueUIWidget messages={dialogue.messages} />
      <SystemMenuWidget />
    </GameScreen>
  )
}
```

# Feature実装ガイド

## 概要

Featureは「機能単位」のモジュール。
1つのFeatureが PixiJS部分 + HTML部分 + 共有状態 を持つことができる。

## ファクトリ

### createWidget（HTML用）

```tsx
// engine/components/createWidget.tsx
import { cn } from "@/lib/cn"

type WidgetConfig = {
  zIndex: number
  name: string
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

### createSprite（PixiJS用）

```tsx
// engine/components/createSprite.tsx
type SpriteConfig = {
  name: string
}

export function createSprite<P extends object>(
  Component: React.ComponentType<P>,
  config: SpriteConfig
) {
  function Sprite(props: P) {
    return <Component {...props} />
  }
  Sprite.displayName = `${config.name}Sprite`
  return Sprite
}
```

### 使用例

```tsx
// features/Dialogue/widget/DialogueMessage.tsx
import { createWidget } from "@/engine/components/createWidget"
import { MessageBox } from "../components/MessageBox"

export const DialogueMessage = createWidget(MessageBox, {
  zIndex: 10,
  name: "DialogueMessage",
})

// features/Dialogue/widget/DialogueCharacterSprite.tsx
import { createSprite } from "@/engine/components/createSprite"
import { Character } from "../sprites/Character"

export const DialogueCharacterSprite = createSprite(Character, {
  name: "DialogueCharacter",
})

// features/Dialogue/index.ts
export { DialogueMessage } from "./widget/DialogueMessage"
export { DialogueCharacterSprite } from "./widget/DialogueCharacterSprite"
export { useDialogue } from "./hooks"
```

## Feature公開インターフェース

### 命名規則

| レイヤー | サフィックス | 例 |
|----------|--------------|-----|
| PixiJS（Canvas内） | `Sprite` | CharacterSprite, BackgroundSprite |
| React/HTML | なし | DialogueMessage, SystemMenu |

**ルール**: `Sprite` がついていれば PixiJS、なければ普通の React コンポーネント

### 推奨パターン

```tsx
// features/Dialogue/index.ts

// PixiJS層（Spriteサフィックス）
export { DialogueCharacterSprite } from "./components/canvas"

// HTML層（サフィックスなし）
export { DialogueMessage } from "./components/ui"

// Hooks
export { useDialogue, useCurrentSpeaker } from "./hooks"

// Types
export type { DialogueState, DialogueMessage } from "./types"

// Constants (必要な場合)
export { DIALOGUE_LAYOUT } from "./constants"
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
├── components/                     # 純粋な React (HTML) パーツ
│   ├── MessageBox.tsx
│   └── SpeakerName.tsx
├── sprites/                        # 純粋な PixiJS パーツ
│   └── Character.tsx
├── widget/                         # ファクトリ適用済み（Scene用）
│   ├── DialogueMessage.tsx         # createWidget
│   └── DialogueCharacterSprite.tsx # createSprite
├── hooks/
│   └── useDialogue.ts
└── index.ts                        # widget/ から再エクスポート
```

### Scene側での使用

```tsx
import { DialogueCharacterSprite, DialogueMessage } from "@/engine/features/Dialogue"

function NovelScene() {
  return (
    <GameScreen>
      <PixiCanvas>
        <DialogueCharacterSprite />   {/* 立ち絵 */}
      </PixiCanvas>

      <DialogueMessage />             {/* メッセージ */}
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
export { DialogueCharacterSprite } from "./components/canvas"
export { DialogueMessage } from "./components/ui"
export { useDialogue } from "./hooks"
export { DIALOGUE_LAYOUT } from "./constants"

// scenes/NovelScene.tsx
import { BackgroundSprite } from "@/engine/features/Background"
import { DialogueCharacterSprite, DialogueMessage, useDialogue } from "@/engine/features/Dialogue"
import { SystemMenu } from "@/engine/features/SystemMenu"

function NovelScene() {
  const dialogue = useDialogue()

  return (
    <GameScreen>
      <PixiCanvas>
        <BackgroundSprite />
        <DialogueCharacterSprite speaker={dialogue.currentSpeaker} />
      </PixiCanvas>

      <DialogueMessage messages={dialogue.messages} />
      <SystemMenu />
    </GameScreen>
  )
}
```

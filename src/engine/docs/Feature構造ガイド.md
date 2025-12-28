# Feature構造ガイド

## 概要

Feature は「機能単位」のモジュール。
PixiJS部分 + HTML部分 + 状態管理 + フックをバンドルして提供する。

---

## フォルダ構造

```
features/<FeatureName>/
├── components/           # 素材（純粋なReactコンポーネント）
│   ├── MessageBox.tsx
│   └── SpeakerName.tsx
├── sprites/              # 素材（純粋なPixiJSコンポーネント）
│   └── Standing.tsx
├── exports/              # ファクトリ適用済み（公開用）
│   ├── MessageWidget.tsx
│   ├── CharactersSprite.tsx
│   ├── UILayer.tsx
│   └── index.ts          # バンドルエクスポート
├── hooks/
│   ├── useDialogue.ts
│   ├── useDialogueActions.ts
│   └── index.ts          # フックまとめ
└── stores/
    └── dialogueStore.ts
```

---

## 各フォルダの役割

### components/

純粋な React（HTML）コンポーネント。ファクトリ適用前の「素材」。

- `style` prop を受け取り、ルート要素に適用する契約
- Feature 内部でのみ使用

```tsx
// components/MessageBox.tsx
type Props = {
  text: string
  style?: CSSProperties
}

export function MessageBox({ text, style }: Props) {
  return (
    <div style={style} className="...">
      {text}
    </div>
  )
}
```

### sprites/

純粋な PixiJS コンポーネント。ファクトリ適用前の「素材」。

```tsx
// sprites/Standing.tsx
export function Standing({ texture, x, y }: Props) {
  return <pixiSprite texture={texture} x={x} y={y} />
}
```

### exports/

ファクトリ適用済みのコンポーネント。外部に公開される。

```tsx
// exports/MessageWidget.tsx
import { createWidget } from "@/engine/components/factories"
import { MessageBox } from "../components/MessageBox"

export const MessageWidget = createWidget(MessageBox, {
  name: "DialogueMessage",
  zIndex: 10,
})
```

```tsx
// exports/CharactersSprite.tsx
import { createSprite } from "@/engine/components/factories"
import { Standing } from "../sprites/Standing"

export const CharactersSprite = createSprite(Standing, {
  name: "DialogueCharacters",
})
```

```tsx
// exports/UILayer.tsx
import { createLayer } from "@/engine/components/factories"
import { MessageWidget } from "./MessageWidget"
import { SpeakerWidget } from "./SpeakerWidget"

export const UILayer = createLayer({
  name: "DialogueUI",
  zIndex: 10,
}, () => (
  <>
    <MessageWidget />
    <SpeakerWidget />
  </>
))
```

**注意**: Layer は他の Widget を集めるため、素材フォルダ（components/）に対応するものがない。

### hooks/

状態アクセス用のフック。

| フック | 用途 | 使用者 |
|--------|------|--------|
| useDialogue | 状態を読む | Widget/Sprite |
| useDialogueActions | 状態を更新する | Executor |

```tsx
// hooks/index.ts
export { useDialogue } from "./useDialogue"
export { useDialogueActions } from "./useDialogueActions"
```

### stores/

Zustand ストア。Feature の状態を管理。

---

## バンドルエクスポート

exports/index.ts でバンドルオブジェクトとしてまとめる。

```tsx
// exports/index.ts
import { CharactersSprite } from "./CharactersSprite"
import { UILayer } from "./UILayer"
import { MessageWidget } from "./MessageWidget"
import { useDialogue, useDialogueActions } from "../hooks"

export const Dialogue = {
  Sprites: {
    Characters: CharactersSprite,
  },
  Layers: {
    UI: UILayer,
  },
  Widgets: {
    Message: MessageWidget,
  },
  hooks: {
    useDialogue,
    useDialogueActions,
  },
}
```

---

## 使用例

```tsx
// Scene から使用
import { Dialogue } from "@/engine/features/Dialogue/exports"

// PixiJS Canvas 内
<Dialogue.Sprites.Characters />

// HTML 層
<Dialogue.Layers.UI />

// Executor から状態更新
const { showMessage } = Dialogue.hooks.useDialogueActions()
showMessage({ speaker: "tatsumi", text: "..." })

// Widget 内で状態読み取り
const { currentMessage } = Dialogue.hooks.useDialogue()
```

---

## ファクトリ一覧

| ファクトリ | 対象 | 効果 |
|-----------|------|------|
| createWidget | HTML コンポーネント | `position: absolute` + `zIndex` を注入 |
| createSprite | PixiJS コンポーネント | displayName を付与（パススルー） |
| createLayer | Widget グループ | `absolute` + `inset: 0` + `pointerEvents: none` + `zIndex` |

---

## 命名規則

| 種類 | サフィックス | 例 |
|------|-------------|-----|
| PixiJS（Canvas内） | `Sprite` | CharactersSprite |
| Widget グループ | `Layer` | UILayer |
| 単体 HTML | `Widget` | MessageWidget |
| 素材（内部用） | なし | MessageBox, Standing |

---

## 素材とエクスポートの関係

```
components/MessageBox.tsx  ──→  exports/MessageWidget.tsx
                                    ↓ createWidget
sprites/Standing.tsx       ──→  exports/CharactersSprite.tsx
                                    ↓ createSprite
（なし）                   ──→  exports/UILayer.tsx
                                    ↓ createLayer（他 Widget を集める）
```

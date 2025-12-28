# コンポーネント契約

## 概要

GameContainer とその子コンポーネント（Widget）間の契約を定義する。
この契約により、配置・z-index管理が一貫して行われる。

## コンテナ契約（GameContainer）

GameContainer は以下を保証する:

```tsx
<main
  className="absolute"
  style={{
    width: gameSize.width,
    height: gameSize.height,
    left: calculatedLeft,
    top: calculatedTop,
    isolation: "isolate",  // スタックコンテキスト確立
  }}
>
  {children}
</main>
```

### 保証項目

| 項目 | 値 | 説明 |
|------|-----|------|
| position | absolute | 配置コンテキストを提供 |
| width/height | ゲームサイズ | % 計算の基準 |
| isolation | isolate | スタックコンテキストの分離 |
| サイズ取得 | useGameSize() | Context経由で取得可能 |

### スタックコンテキスト分離の効果

`isolation: isolate` により:
- z-index は GameContainer 内で完結
- グローバルな z-layer.css との競合なし
- シンプルな数値（0, 10, 50, 100...）で管理可能

## Widget契約

Widget は createWidget() ファクトリを使用して生成される。

### ファクトリが保証すること

```tsx
// createWidget() が自動適用
<div
  className="absolute inset-0 pointer-events-none"
  style={{ zIndex }}
  data-widget={name}
>
  <Component {...props} />
</div>
```

| 項目 | 値 | 説明 |
|------|-----|------|
| position | absolute | GameContainer基準で配置 |
| inset | 0 | 全領域をカバー |
| pointer-events | none | 子要素に委譲 |
| zIndex | デフォルト値 + 上書き可能 | 積層順序 |

### Widget内部コンポーネントのルール

Widget内部のUIコンポーネントは:

| ルール | 理由 |
|--------|------|
| 相対値（%）を基本 | ゲームサイズに追従 |
| px使用時は useGameSize() 経由 | 固定値が必要な場合 |
| 親のサイズを直接参照しない | Context経由で取得 |

### 禁止事項

- ❌ `position: fixed`（ゲーム外を参照してしまう）
- ❌ `vh/vw` 単位（ビューポート依存はNG）
- ❌ 親要素の `offsetWidth` 等を直接参照
- ❌ グローバル z-index クラス（z-layer.css）の使用

## z-index 管理

### 推奨範囲（GameContainer内）

```
SystemMenu   z: 100
Choice       z: 50
Dialogue     z: 10
PixiCanvas   z: 0
```

### 上書き方法

```tsx
// デフォルト
<DialogueWidget />

// 上書き
<DialogueWidget zIndex={20} />
```

## Layer契約

Layerは複数のWidgetをグループ化するオプショナルなコンテナ。

### 定義

```tsx
// engine/components/Layer.tsx
type LayerProps = {
  zIndex?: number
  visible?: boolean
  children: React.ReactNode
}

export function Layer({ zIndex = 0, visible = true, children }: LayerProps) {
  if (!visible) return null
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex }}
    >
      {children}
    </div>
  )
}
```

### 保証項目

| 項目 | 値 | 説明 |
|------|-----|------|
| position | absolute | GameContainer基準で配置 |
| inset | 0 | 全領域をカバー |
| pointer-events | none | 子要素に委譲 |
| スタッキングコンテキスト | 自動生成 | 子のz-indexを分離 |

### スタッキングコンテキストの分離

`position: absolute` + `z-index` の組み合わせにより、
Layerは自動的に新しいスタッキングコンテキストを生成する。

```
Layer(zIndex=100) ─────────────
  │ 内部: z-index: 1 でも上
  │
Layer(zIndex=50) ──────────────
  │ 内部: z-index: 9999 でも下
  │
```

**効果**: Layer内でどんな z-index を指定しても、
他のLayerには絶対に干渉しない。安全にレイヤー管理が可能。

### 使い分け

- シンプルなシーン: Widgetを直接配置
- 複雑なシーン: Layerでグループ化
- Layer は必須ではなくオプション

## Screen階層

```
GameScreen (Scene側が使うインターフェース)
├── FullScreen (ビューポート制御)
├── GameScreenContext.Provider (サイズ情報)
├── Letterbox (装飾)
└── GameContainer (Widget契約の実装)
    ├── PixiCanvas (z: 0)
    ├── Layer (オプション、グループ化用)
    │   └── Widgets
    └── Widgets (z: 10+)
```

Scene開発者は `GameScreen` のみを意識する。
`GameContainer` の契約は内部で自動保証される。

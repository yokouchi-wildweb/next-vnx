# Skeleton コンポーネントの使い方

このフォルダでは、Shadcn の `Skeleton` をラップした **BaseSkeleton** を中心に、フォームやモーダルなど画面単位で利用する Skeleton を提供しています。

## BaseSkeleton

```tsx
import { BaseSkeleton } from "@/components/Feedback/Skeleton/BaseSkeleton";

<BaseSkeleton className="h-8 w-40" />;
```

### Props

| Prop | 型 | デフォルト | 説明 |
| --- | --- | --- | --- |
| `shimmer` | `boolean` | `true` | シマー（光沢）を有効・無効にします |
| `shimmerSpeed` | `number` | `1.6` | シマーの移動速度（秒） |
| `shimmerWidth` | `number` | `60` | シマー帯の幅（%）。**5〜100** の間に clamp されます |
| `backgroundTone` | `"subtle" \| "default" \| "bold"` | `"default"` | 背景色の濃さを切り替えます |

Tailwind クラスや `style` の指定もそのまま渡せます。

## 既存の Skeleton

| コンポーネント | 役割 |
| --- | --- |
| `FormSkeleton.tsx` | フォーム全体のローディング。`fields` や `includeButtons` で調整可能 |
| `DetailModalSkeleton.tsx` | 詳細モーダルのフォールバック表示 |
| `ImageUploaderSkeleton.tsx` | 画像アップローダーのプレビュー領域で使用 |

これらはすべて `BaseSkeleton` を内部で利用しているため、スタイルの統一や Props でのカスタマイズが容易です。必要に応じて新しい Skeleton を追加する場合も `BaseSkeleton` を基準に構築してください。

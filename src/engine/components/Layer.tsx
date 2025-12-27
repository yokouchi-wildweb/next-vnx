/**
 * Layer
 *
 * Widgetグループ化用のオプショナルコンテナ
 * - position: absolute で全領域をカバー
 * - スタッキングコンテキストを生成（z-index を分離）
 * - visible で表示/非表示を制御
 */
import { cn } from "@/lib/cn"

type LayerProps = {
  zIndex?: number
  visible?: boolean
  children: React.ReactNode
  className?: string
}

/**
 * 複数のWidgetをグループ化するレイヤー
 *
 * @example
 * ```tsx
 * <Layer zIndex={50} visible={showChoice}>
 *   <ChoiceWidget />
 *   <ChoiceEffectWidget />
 * </Layer>
 * ```
 *
 * スタッキングコンテキスト効果:
 * Layer内のz-indexは外部に影響しない。
 * Layer(z:50)内でz:9999でもLayer(z:100)より下になる。
 */
export function Layer({
  zIndex = 0,
  visible = true,
  children,
  className,
}: LayerProps) {
  if (!visible) return null
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{ zIndex }}
    >
      {children}
    </div>
  )
}

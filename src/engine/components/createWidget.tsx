/**
 * createWidget
 *
 * Widget生成ファクトリ
 * - position: absolute を自動適用
 * - z-index をデフォルト値として設定（上書き可能）
 * - pointer-events: none でクリックを子要素に委譲
 */
import { cn } from "@/lib/cn"

type WidgetConfig = {
  zIndex: number
  name: string
}

/**
 * コンポーネントをWidgetとしてラップする
 *
 * @example
 * ```tsx
 * export const DialogueWidget = createWidget(DialogueUI, {
 *   zIndex: 10,
 *   name: "Dialogue",
 * })
 * ```
 */
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

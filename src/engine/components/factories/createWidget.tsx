/**
 * createWidget
 *
 * Widget生成ファクトリ
 * - position: absolute を強制適用
 * - z-index をデフォルト値として設定（上書き可能）
 * - ラッパーなし、元のコンポーネントに直接スタイル注入
 *
 * 契約: Widget として使うコンポーネントは style prop を受け取り、
 *       ルート要素に適用する必要がある
 */

import type { CSSProperties } from "react"

/** createWidget に渡す設定 */
type WidgetOptions = {
  name: string
  zIndex: number
}

/** createWidget が返すコンポーネントの型 */
type WidgetResult<P> = React.FC<P & { zIndex?: number }> & {
  displayName: string
  defaultZIndex: number
}

/**
 * コンポーネントをWidgetとして拡張する
 *
 * @example
 * ```tsx
 * export const DialogueMessage = createWidget(MessageBox, {
 *   name: "DialogueMessage",
 *   zIndex: 10,
 * })
 * ```
 */
export function createWidget<P extends object>(
  Component: React.ComponentType<P & { style?: CSSProperties; "data-widget"?: string }>,
  options: WidgetOptions
): WidgetResult<P> {
  function Widget(props: P & { zIndex?: number }) {
    const { zIndex = options.zIndex, ...rest } = props

    // 元の style を保持しつつ、position と zIndex を強制上書き
    const existingStyle = (rest as Record<string, unknown>).style as CSSProperties | undefined
    const widgetStyle: CSSProperties = {
      ...existingStyle,
      position: "absolute",
      zIndex,
    }

    return (
      <Component
        {...(rest as P)}
        style={widgetStyle}
        data-widget={options.name}
      />
    )
  }

  Widget.displayName = `${options.name}Widget`
  Widget.defaultZIndex = options.zIndex

  return Widget as WidgetResult<P>
}

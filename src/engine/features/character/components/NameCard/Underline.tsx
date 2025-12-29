/**
 * Underline - アンダーライン型の名前表示
 */

import { defaultUnderlineStyle } from "../../defaults"
import type { UnderlineStyle } from "../../types"

type Props = {
  name: string
  color: string
  style?: Partial<UnderlineStyle>
}

export function Underline({ name, color, style: styleOverrides }: Props) {
  const style = { ...defaultUnderlineStyle, ...styleOverrides }

  return (
    <span
      className="inline-block px-3 py-1 text-white"
      style={{
        borderBottom: `${style.lineWidth}px solid ${color}`,
        textShadow: style.textShadow,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
      }}
    >
      {name}
    </span>
  )
}

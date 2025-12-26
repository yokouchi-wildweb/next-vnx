// src/engine/utils/styleUtils.ts

/**
 * スタイル関連のユーティリティ関数
 * UIコンポーネントのスタイル設定をマージする際に使用
 */

/**
 * ディープマージ: デフォルト値とオーバーライド値をマージする
 * - オーバーライド値が undefined の場合はデフォルト値を使用
 * - ネストされたオブジェクトも再帰的にマージ
 *
 * @param defaults デフォルト値
 * @param overrides オーバーライド値（Partial）
 * @returns マージされた値
 */
export function mergeStyles<T extends Record<string, unknown>>(
  defaults: T,
  overrides?: Partial<T>
): T {
  if (!overrides) {
    return defaults
  }

  const result = { ...defaults }

  for (const key in overrides) {
    if (Object.prototype.hasOwnProperty.call(overrides, key)) {
      const overrideValue = overrides[key]
      const defaultValue = defaults[key]

      if (overrideValue === undefined) {
        // undefined の場合はデフォルト値を維持
        continue
      }

      if (
        typeof overrideValue === "object" &&
        overrideValue !== null &&
        !Array.isArray(overrideValue) &&
        typeof defaultValue === "object" &&
        defaultValue !== null &&
        !Array.isArray(defaultValue)
      ) {
        // ネストされたオブジェクトは再帰的にマージ
        result[key] = mergeStyles(
          defaultValue as Record<string, unknown>,
          overrideValue as Record<string, unknown>
        ) as T[Extract<keyof T, string>]
      } else {
        // プリミティブ値または配列はそのまま上書き
        result[key] = overrideValue as T[Extract<keyof T, string>]
      }
    }
  }

  return result
}

/**
 * CSS clamp() 値を生成するヘルパー
 * レスポンシブなサイズ指定に使用
 *
 * @param min 最小値（px）
 * @param preferred 推奨値（%など）
 * @param max 最大値（px）
 * @returns clamp() 文字列
 */
export function cssClamp(min: number, preferred: string, max: number): string {
  return `clamp(${min}px, ${preferred}, ${max}px)`
}

/**
 * CSS min() 値を生成するヘルパー
 *
 * @param values 比較する値の配列
 * @returns min() 文字列
 */
export function cssMin(...values: string[]): string {
  return `min(${values.join(", ")})`
}

/**
 * createSprite
 *
 * PixiJS Sprite生成ファクトリ
 * - displayName を自動設定
 * - 将来の共通処理の拡張ポイント
 */

type SpriteConfig = {
  name: string
}

/**
 * PixiJSコンポーネントをSpriteとしてラップする
 *
 * @example
 * ```tsx
 * export const BackgroundSprite = createSprite(Background, {
 *   name: "Background",
 * })
 * ```
 */
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

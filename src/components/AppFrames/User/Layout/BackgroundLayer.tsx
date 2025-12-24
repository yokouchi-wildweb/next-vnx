import type { CSSProperties } from "react";

type BackgroundLayerProps = {
  /** 背景画像のURL */
  readonly imageUrl?: string;
  /** オーバーレイの色（任意のCSS色形式: "#000", "black", "rgb(0,0,0)"など） */
  readonly overlayColor?: string;
  /** オーバーレイの透明度（0-1） */
  readonly overlayOpacity?: number;
};

/**
 * 固定位置の背景レイヤー
 * - 背景画像がある場合: 背景画像 + オーバーレイを表示
 * - 背景画像がない場合: デフォルト背景色（bg-background）を表示
 * - z-index: -1 で最背面に配置し、既存レイアウトに影響しない
 */
export const BackgroundLayer = ({
  imageUrl,
  overlayColor = "#000",
  overlayOpacity = 0,
}: BackgroundLayerProps) => {
  const containerStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: -1,
    pointerEvents: "none",
  };

  // 背景画像がない場合はデフォルト背景色を使用
  const baseStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundColor: "hsl(var(--background))",
  };

  const imageStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const overlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundColor: overlayColor,
    opacity: overlayOpacity,
  };

  return (
    <div style={containerStyle} aria-hidden="true">
      {imageUrl ? (
        <>
          <div style={imageStyle} />
          {overlayOpacity > 0 && <div style={overlayStyle} />}
        </>
      ) : (
        <div style={baseStyle} />
      )}
    </div>
  );
};

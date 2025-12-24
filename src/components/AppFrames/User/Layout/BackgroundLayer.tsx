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
 * - 画面全体を覆う背景画像とオーバーレイを表示
 * - z-index: -1 で最背面に配置し、既存レイアウトに影響しない
 */
export const BackgroundLayer = ({
  imageUrl,
  overlayColor = "#000",
  overlayOpacity = 0,
}: BackgroundLayerProps) => {
  // 画像もオーバーレイも不要な場合は何も表示しない
  if (!imageUrl && overlayOpacity === 0) {
    return null;
  }

  const containerStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: -1,
    pointerEvents: "none",
  };

  const imageStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
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
      {imageUrl && <div style={imageStyle} />}
      {overlayOpacity > 0 && <div style={overlayStyle} />}
    </div>
  );
};

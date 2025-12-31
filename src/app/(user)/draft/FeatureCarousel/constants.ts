/**
 * FeatureCarousel 共通定数
 */

// =============================================================================
// レスポンシブ設定
// =============================================================================

/** モバイル/デスクトップ切り替えブレークポイント (px) */
export const BREAKPOINT = 768;

/** モバイル時のカードサイズ (px) */
export const CARD_SIZE_MOBILE = 300;

/** デスクトップ時のカードサイズ (px) */
export const CARD_SIZE_DESKTOP = 540;

// =============================================================================
// PentagonCard レイアウト定数
// =============================================================================

/** 五角形プレートの拡大率 (カードサイズに対する比率) */
export const PLATE_SCALE = 1.4;

/** プレートの傾き角度 (deg) */
export const PLATE_ROTATE_X = 70;

/** 3Dコンテナの高さ比率 (カードサイズに対する比率) */
export const CONTAINER_HEIGHT_RATIO = 0.8;

/** 画像の幅比率 (カードサイズに対する比率) */
export const IMAGE_WIDTH_RATIO = 0.85;

/** 画像の高さ比率 (カードサイズに対する比率) */
export const IMAGE_HEIGHT_RATIO = 0.55;

/** 画像の下端位置 - モバイル (カードサイズに対する比率) */
export const IMAGE_BOTTOM_RATIO_MOBILE = 0.20;

/** 画像の下端位置 - デスクトップ (カードサイズに対する比率) */
export const IMAGE_BOTTOM_RATIO_DESKTOP = 0.30;

/** 画像のZ軸位置比率 (カードサイズに対する比率、負=奥) */
export const IMAGE_TRANSLATE_Z_RATIO = -0.2;

/** テキストパネルの幅比率 - モバイル (カードサイズに対する比率) */
export const TEXT_WIDTH_RATIO_MOBILE = 1.0;

/** テキストパネルの幅比率 - デスクトップ (カードサイズに対する比率) */
export const TEXT_WIDTH_RATIO_DESKTOP = 0.6;

/** テキストパネルの下端位置比率 (カードサイズに対する比率) */
export const TEXT_BOTTOM_RATIO = 0.15;

/** テキストパネルのZ軸位置比率 (カードサイズに対する比率、正=手前) */
export const TEXT_TRANSLATE_Z_RATIO = 0.05;

// =============================================================================
// カルーセル 3D配置定数
// =============================================================================

/** カルーセル視点距離 (px) */
export const CAROUSEL_PERSPECTIVE = 1000;

/** 隣接カード(±1)のX軸移動比率 */
export const CAROUSEL_TRANSLATE_X_1 = 0.84;

/** 外側カード(±2)のX軸移動比率 */
export const CAROUSEL_TRANSLATE_X_2 = 1.22;

/** カルーセルコンテナの高さ - モバイル (px) */
export const CAROUSEL_HEIGHT_MOBILE = 420;

/** カルーセルコンテナの高さ - デスクトップ (px) */
export const CAROUSEL_HEIGHT_DESKTOP = 520;

/** カルーセル配置設定 */
export const CAROUSEL_POSITION_CONFIGS = {
  0: { scale: 1.0, translateZ: 0, rotateY: 0, opacity: 1 },
  1: { scale: 0.55, translateZ: -350, rotateYMultiplier: -30, opacity: 0.6 },
  2: { scale: 0.35, translateZ: -550, rotateYMultiplier: -40, opacity: 0.3 },
} as const;

// =============================================================================
// 五角形クリップパス
// =============================================================================

/**
 * 正五角形のclip-path（上が頂点）
 * 頂点座標は中心(50%,50%)から半径50%で、-90°から72°ずつ
 *
 * cos/sin計算:
 *   0: (50%, 0%)
 *   1: (50 + 50*cos(-18°), 50 + 50*sin(-18°)) ≈ (97.55%, 34.55%)
 *   2: (50 + 50*cos(54°), 50 + 50*sin(54°)) ≈ (79.39%, 90.45%)
 *   3: (50 + 50*cos(126°), 50 + 50*sin(126°)) ≈ (20.61%, 90.45%)
 *   4: (50 + 50*cos(198°), 50 + 50*sin(198°)) ≈ (2.45%, 34.55%)
 */
export const PENTAGON_CLIP_PATH = "polygon(50% 0%, 97.55% 34.55%, 79.39% 90.45%, 20.61% 90.45%, 2.45% 34.55%)";

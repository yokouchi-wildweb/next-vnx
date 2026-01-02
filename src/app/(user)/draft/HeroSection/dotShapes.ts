/**
 * DecorativeDots用の形状座標定義
 * viewBox: 0 0 160 160、中心: 80, 80
 */

export type DotCoordinate = [number, number];
export type ShapeCoordinates = DotCoordinate[];

/** 正方形 (3x3グリッド) */
export const SHAPE_SQUARE: ShapeCoordinates = [
  [40, 40], [80, 40], [120, 40],
  [40, 80], [80, 80], [120, 80],
  [40, 120], [80, 120], [120, 120],
];

/** 円形 */
export const SHAPE_CIRCLE: ShapeCoordinates = [
  [80, 30],   // 上
  [122, 45],  // 右上
  [137, 80],  // 右
  [122, 115], // 右下
  [80, 130],  // 下
  [38, 115],  // 左下
  [23, 80],   // 左
  [38, 45],   // 左上
  [80, 80],   // 中心
];

/** 三角形 (上向き) */
export const SHAPE_TRIANGLE: ShapeCoordinates = [
  [80, 25],   // 頂点
  [60, 55], [100, 55],  // 2段目
  [40, 85], [80, 85], [120, 85],  // 3段目
  [50, 115], [80, 115], [110, 115],  // 底辺
];

/** X型 (バツ印) - 対角線上に配置 (0度) */
export const SHAPE_CROSS_0: ShapeCoordinates = [
  [25, 25],   // 左上
  [55, 55],   // 左上→中心
  [135, 25],  // 右上
  [105, 55],  // 右上→中心
  [80, 80],   // 中心
  [55, 105],  // 左下→中心
  [25, 135],  // 左下
  [105, 105], // 右下→中心
  [135, 135], // 右下
];

/** X型 90度回転（中心(80,80)を軸に時計回り） */
export const SHAPE_CROSS_90: ShapeCoordinates = [
  [135, 25],  // ドット0: 左上→右上
  [105, 55],  // ドット1
  [135, 135], // ドット2: 右上→右下
  [105, 105], // ドット3
  [80, 80],   // ドット4: 中心
  [55, 55],   // ドット5
  [25, 25],   // ドット6: 左下→左上
  [55, 105],  // ドット7
  [25, 135],  // ドット8: 右下→左下
];

/** X型 270度回転（-90度、反対側） */
export const SHAPE_CROSS_270: ShapeCoordinates = [
  [25, 135],  // ドット0: 左上→左下
  [55, 105],  // ドット1
  [25, 25],   // ドット2: 右上→左上
  [55, 55],   // ドット3
  [80, 80],   // ドット4: 中心
  [105, 105], // ドット5
  [135, 135], // ドット6: 左下→右下
  [105, 55],  // ドット7
  [135, 25],  // ドット8: 右下→右上
];

/** ダイヤモンド (ひし形) */
export const SHAPE_DIAMOND: ShapeCoordinates = [
  [80, 20],   // 上
  [55, 50], [105, 50],  // 上段
  [30, 80], [80, 80], [130, 80],  // 中段
  [55, 110], [105, 110],  // 下段
  [80, 140],  // 下
];

/** アニメーション用の形状シーケンス */
export const SHAPE_SEQUENCE: ShapeCoordinates[] = [
  SHAPE_SQUARE,
  SHAPE_CIRCLE,
  SHAPE_TRIANGLE,
  SHAPE_CROSS_0,
  SHAPE_CROSS_90,
  SHAPE_CROSS_270,
  SHAPE_DIAMOND,
  SHAPE_SQUARE, // 最初に戻る
];

/** ドット数 */
export const DOT_COUNT = 9;

/**
 * トンネル効果のSVG背景を生成
 *
 * 中心から放射状に広がる多角形グリッドで奥行き感を表現
 * 四角形・六角形の切り替えが可能
 */

export interface TunnelSVGOptions {
  /** 幅 */
  width?: number
  /** 高さ */
  height?: number
  /** 多角形の辺の数 (3=三角形, 4=四角形, 5=五角形, 6=六角形, 8=八角形, etc.) */
  sides?: number
  /** レイヤー数（多角形の数） */
  layers?: number
  /** 線の色 */
  strokeColor?: string
  /** 線の太さ */
  strokeWidth?: number
  /** 線の不透明度 */
  strokeOpacity?: number
  /** グラデーション開始色 */
  gradientStart?: string
  /** グラデーション終了色 */
  gradientEnd?: string
  /** 中心の多角形の最小サイズ（画面幅に対する比率） */
  minScale?: number
  /** 最外周のサイズ（画面幅に対する比率） */
  maxScale?: number
  /** 放射線を描画するか */
  drawRadialLines?: boolean
  /** 遠近感の強さ (1=線形, 2=二乗, 3=三乗... 大きいほど中心が密になる) */
  perspectivePower?: number
  /** グラデーションの角度 (0=右, 90=上, 180=左, 270=下) */
  gradientAngle?: number
}

const defaultOptions: Required<TunnelSVGOptions> = {
  width: 1920,
  height: 1080,
  sides: 4,
  layers: 20,
  strokeColor: "#ffffff",
  strokeWidth: 1,
  strokeOpacity: 0.25,
  gradientStart: "#5dbdff",
  gradientEnd: "#dc72ff",
  minScale: 0.08,
  maxScale: 1.5,
  drawRadialLines: true,
  perspectivePower: 2,
  gradientAngle: 90,
}

/**
 * 多角形の頂点を計算
 */
function getPolygonPoints(
  cx: number,
  cy: number,
  radius: number,
  sides: number,
  rotation: number = 0
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = []
  const angleStep = (Math.PI * 2) / sides

  // 四角形の場合は45度回転して、辺が水平/垂直になるようにする
  const baseRotation = sides === 4 ? Math.PI / 4 : Math.PI / 2

  for (let i = 0; i < sides; i++) {
    const angle = baseRotation + rotation + i * angleStep
    points.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    })
  }

  return points
}

/**
 * 点配列をSVGのpath d属性に変換
 */
function pointsToPathD(points: { x: number; y: number }[], close: boolean = true): string {
  if (points.length === 0) return ""

  const parts = points.map((p, i) => {
    const cmd = i === 0 ? "M" : "L"
    return `${cmd}${p.x.toFixed(2)},${p.y.toFixed(2)}`
  })

  if (close) parts.push("Z")

  return parts.join(" ")
}

/**
 * パワーイージング関数（中心に近いほど密になる）
 * @param t 0-1の値
 * @param power 遠近感の強さ (1=線形, 2=二乗, 3=三乗...)
 */
function easePower(t: number, power: number): number {
  return Math.pow(t, power)
}

/**
 * 角度からlinearGradientの座標を計算
 * @param angle 角度 (0=右, 90=上, 180=左, 270=下)
 */
function angleToGradientCoords(angle: number): { x1: string; y1: string; x2: string; y2: string } {
  const rad = (angle * Math.PI) / 180
  const x1 = Math.round(50 - Math.cos(rad) * 50)
  const y1 = Math.round(50 + Math.sin(rad) * 50)
  const x2 = Math.round(50 + Math.cos(rad) * 50)
  const y2 = Math.round(50 - Math.sin(rad) * 50)
  return {
    x1: `${x1}%`,
    y1: `${y1}%`,
    x2: `${x2}%`,
    y2: `${y2}%`,
  }
}

/**
 * アスペクト比を考慮した半径を計算
 */
function getAdjustedRadius(
  baseRadius: number,
  angle: number,
  aspectRatio: number
): number {
  // 四角形の場合、縦横で半径を調整
  const cos = Math.abs(Math.cos(angle))
  const sin = Math.abs(Math.sin(angle))

  // アスペクト比に応じて縦方向を縮小
  const xComponent = cos * baseRadius
  const yComponent = sin * baseRadius / aspectRatio

  return Math.sqrt(xComponent * xComponent + yComponent * yComponent * aspectRatio * aspectRatio)
}

/**
 * トンネル効果のSVGを生成
 */
export function generateTunnelSVG(options: TunnelSVGOptions = {}): string {
  const opts = { ...defaultOptions, ...options }
  const {
    width,
    height,
    sides,
    layers,
    strokeColor,
    strokeWidth,
    strokeOpacity,
    gradientStart,
    gradientEnd,
    minScale,
    maxScale,
    drawRadialLines,
    perspectivePower,
    gradientAngle,
  } = opts

  const cx = width / 2
  const cy = height / 2
  const maxRadius = Math.max(width, height) * maxScale
  const minRadius = Math.min(width, height) * minScale
  const aspectRatio = width / height

  // パスデータを収集
  const polygonPaths: string[] = []
  const radialLinePaths: string[] = []

  // 多角形レイヤーを生成
  for (let i = 0; i < layers; i++) {
    const t = i / (layers - 1)
    const easedT = easePower(t, perspectivePower)
    const radius = minRadius + (maxRadius - minRadius) * easedT

    // アスペクト比を考慮した多角形
    const points = getPolygonPoints(cx, cy, radius, sides).map((p) => {
      // 中心からの角度を計算
      const dx = p.x - cx
      const dy = p.y - cy

      // 縦方向を圧縮してアスペクト比に合わせる
      return {
        x: p.x,
        y: cy + (p.y - cy) * (height / width),
      }
    })

    polygonPaths.push(pointsToPathD(points))
  }

  // 放射線を生成（各頂点方向）
  if (drawRadialLines) {
    const innerPoints = getPolygonPoints(cx, cy, minRadius, sides).map((p) => ({
      x: p.x,
      y: cy + (p.y - cy) * (height / width),
    }))
    const outerPoints = getPolygonPoints(cx, cy, maxRadius, sides).map((p) => ({
      x: p.x,
      y: cy + (p.y - cy) * (height / width),
    }))

    for (let i = 0; i < sides; i++) {
      const inner = innerPoints[i]
      const outer = outerPoints[i]
      radialLinePaths.push(`M${inner.x.toFixed(2)},${inner.y.toFixed(2)} L${outer.x.toFixed(2)},${outer.y.toFixed(2)}`)
    }

    // 各辺の中点方向にも放射線を追加（すべての多角形で共通）
    for (let i = 0; i < sides; i++) {
      const nextI = (i + 1) % sides
      const innerMid = {
        x: (innerPoints[i].x + innerPoints[nextI].x) / 2,
        y: (innerPoints[i].y + innerPoints[nextI].y) / 2,
      }
      const outerMid = {
        x: (outerPoints[i].x + outerPoints[nextI].x) / 2,
        y: (outerPoints[i].y + outerPoints[nextI].y) / 2,
      }
      radialLinePaths.push(`M${innerMid.x.toFixed(2)},${innerMid.y.toFixed(2)} L${outerMid.x.toFixed(2)},${outerMid.y.toFixed(2)}`)
    }
  }

  // グラデーション座標を計算
  const grad = angleToGradientCoords(gradientAngle)

  // SVGを組み立て
  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${width} ${height}"
  preserveAspectRatio="xMidYMid slice"
>
  <defs>
    <linearGradient id="tunnelGradient" x1="${grad.x1}" y1="${grad.y1}" x2="${grad.x2}" y2="${grad.y2}">
      <stop offset="0%" stop-color="${gradientStart}" />
      <stop offset="100%" stop-color="${gradientEnd}" />
    </linearGradient>
  </defs>

  <!-- 背景グラデーション -->
  <rect width="${width}" height="${height}" fill="url(#tunnelGradient)" />

  <!-- トンネルパターン -->
  <g
    fill="none"
    stroke="${strokeColor}"
    stroke-width="${strokeWidth}"
    opacity="${strokeOpacity}"
  >
    <!-- 多角形レイヤー -->
    ${polygonPaths.map((d) => `<path d="${d}" />`).join("\n    ")}

    <!-- 放射線 -->
    ${radialLinePaths.map((d) => `<path d="${d}" />`).join("\n    ")}
  </g>
</svg>`
}

/**
 * Data URIとして取得
 */
export function generateTunnelSVGDataUri(options: TunnelSVGOptions = {}): string {
  const svg = generateTunnelSVG(options)
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

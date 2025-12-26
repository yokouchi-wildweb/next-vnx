/**
 * アセット解決ユーティリティ
 * マニフェストからIDまたはエイリアスを使ってアセットパスを解決
 */

// マニフェストの型定義
interface AssetEntry {
  path: string
  ext: string
  type: 'audio' | 'image' | 'video' | 'unknown'
  aliases?: string[]
}

interface Manifest {
  version: number
  generatedAt: string
  assets: Record<string, AssetEntry>
  aliasMap: Record<string, string>
}

// マニフェストキャッシュ
let manifestCache: Manifest | null = null

// アセットベースパス
const ASSET_BASE = '/game/assets'
const SCENARIO_BASE = '/game/scenarios'

// カテゴリプレフィックス
const CATEGORY_PREFIX = {
  se: 'se',
  bgm: 'bgm',
  img: 'img',
  video: 'vid',
} as const

/**
 * マニフェストを読み込む（初回のみ fetch、以降はキャッシュ）
 */
async function loadManifest(): Promise<Manifest> {
  if (manifestCache) {
    return manifestCache
  }

  const response = await fetch(`${ASSET_BASE}/manifest.json`)
  if (!response.ok) {
    throw new Error(`マニフェストの読み込みに失敗: ${response.status}`)
  }

  manifestCache = await response.json()
  return manifestCache!
}

/**
 * IDまたはエイリアスをメインIDに解決
 */
function resolveId(manifest: Manifest, idOrAlias: string): string {
  // エイリアスならメインIDに変換
  if (manifest.aliasMap[idOrAlias]) {
    return manifest.aliasMap[idOrAlias]
  }
  return idOrAlias
}

/**
 * IDまたはエイリアスからアセット情報を取得
 */
async function getAssetEntry(idOrAlias: string): Promise<AssetEntry | null> {
  const manifest = await loadManifest()
  const id = resolveId(manifest, idOrAlias)
  return manifest.assets[id] || null
}

/**
 * IDまたはエイリアスからフルパスを解決（メイン関数）
 */
async function asset(idOrAlias: string): Promise<string | null> {
  const entry = await getAssetEntry(idOrAlias)
  if (!entry) {
    console.warn(`アセットが見つかりません: ${idOrAlias}`)
    return null
  }
  return `${ASSET_BASE}/${entry.path}`
}

// ============================================
// カテゴリ専用ヘルパー（プレフィックス省略可）
// ============================================

/**
 * SE用ヘルパー
 * @example se('爆発2') → asset('se/爆発2')
 * @example se('explosion-02') → エイリアス解決も可能
 */
async function se(name: string): Promise<string | null> {
  const id = name.includes('/') ? name : `${CATEGORY_PREFIX.se}/${name}`
  return asset(id)
}

/**
 * BGM用ヘルパー
 * @example bgm('かたまる脳みそ') → asset('bgm/かたまる脳みそ')
 */
async function bgm(name: string): Promise<string | null> {
  const id = name.includes('/') ? name : `${CATEGORY_PREFIX.bgm}/${name}`
  return asset(id)
}

/**
 * 画像用ヘルパー
 * @example img('icon-play') → asset('img/icon-play')
 */
async function img(name: string): Promise<string | null> {
  const id = name.includes('/') ? name : `${CATEGORY_PREFIX.img}/${name}`
  return asset(id)
}

/**
 * 動画用ヘルパー
 * @example video('intro') → asset('vid/intro')
 */
async function video(name: string): Promise<string | null> {
  const id = name.includes('/') ? name : `${CATEGORY_PREFIX.video}/${name}`
  return asset(id)
}

// ============================================
// シナリオ固有アセット（マニフェスト管理対象外）
// ============================================

/**
 * シナリオアセットのパスを生成
 * @example scenarioAsset('_sample', 'characters/circus_hartluhl/default.png')
 */
function scenarioAsset(scenarioId: string, path: string): string {
  return `${SCENARIO_BASE}/${scenarioId}/${path}`
}

/**
 * キャラクター画像のパスを生成
 * @example character('_sample', 'circus_hartluhl/default')
 */
function character(scenarioId: string, path: string): string {
  const fullPath = path.includes('.') ? path : `${path}.png`
  return `${SCENARIO_BASE}/${scenarioId}/characters/${fullPath}`
}

/**
 * 背景画像のパスを生成
 * @example background('_sample', 'church/default')
 */
function background(scenarioId: string, path: string): string {
  const fullPath = path.includes('.') ? path : `${path}.png`
  return `${SCENARIO_BASE}/${scenarioId}/backgrounds/${fullPath}`
}

// ============================================
// ユーティリティ
// ============================================

/**
 * タイプでフィルタリングしてアセット一覧を取得
 */
async function getAssetsByType(type: AssetEntry['type']): Promise<Record<string, AssetEntry>> {
  const manifest = await loadManifest()
  const filtered: Record<string, AssetEntry> = {}

  for (const [id, entry] of Object.entries(manifest.assets)) {
    if (entry.type === type) {
      filtered[id] = entry
    }
  }

  return filtered
}

/**
 * 全アセットIDを取得
 */
async function getAllAssetIds(): Promise<string[]> {
  const manifest = await loadManifest()
  return Object.keys(manifest.assets)
}

/**
 * 全エイリアスを取得
 */
async function getAllAliases(): Promise<Record<string, string>> {
  const manifest = await loadManifest()
  return manifest.aliasMap
}

/**
 * マニフェストキャッシュをクリア（開発用）
 */
function clearManifestCache(): void {
  manifestCache = null
}

// エクスポート
export {
  // メイン
  asset,
  // カテゴリ専用
  se,
  bgm,
  img,
  video,
  // シナリオ固有
  scenarioAsset,
  character,
  background,
  // ユーティリティ
  loadManifest,
  getAssetEntry,
  getAssetsByType,
  getAllAssetIds,
  getAllAliases,
  clearManifestCache,
  ASSET_BASE,
  SCENARIO_BASE,
}

export type { AssetEntry, Manifest }

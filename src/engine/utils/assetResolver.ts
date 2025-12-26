/**
 * アセット解決ユーティリティ
 * マニフェストからIDを使ってアセットパスを解決
 */

// マニフェストの型定義
interface AssetEntry {
  path: string
  ext: string
  type: 'audio' | 'image' | 'video' | 'unknown'
}

interface Manifest {
  version: number
  generatedAt: string
  assets: Record<string, AssetEntry>
}

// マニフェストキャッシュ
let manifestCache: Manifest | null = null

// アセットベースパス
const ASSET_BASE = '/game/assets'

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
 * マニフェストを同期的に取得（事前にloadManifestを呼んでおく必要あり）
 */
function getManifestSync(): Manifest | null {
  return manifestCache
}

/**
 * IDからアセット情報を取得
 */
async function getAssetEntry(id: string): Promise<AssetEntry | null> {
  const manifest = await loadManifest()
  return manifest.assets[id] || null
}

/**
 * IDからアセット情報を同期的に取得
 */
function getAssetEntrySync(id: string): AssetEntry | null {
  const manifest = getManifestSync()
  if (!manifest) {
    console.warn('マニフェストが読み込まれていません。先に loadManifest() を呼んでください。')
    return null
  }
  return manifest.assets[id] || null
}

/**
 * IDからフルパスを解決（メイン関数）
 */
async function asset(id: string): Promise<string | null> {
  const entry = await getAssetEntry(id)
  if (!entry) {
    console.warn(`アセットが見つかりません: ${id}`)
    return null
  }
  return `${ASSET_BASE}/${entry.path}`
}

/**
 * IDからフルパスを同期的に解決
 */
function assetSync(id: string): string | null {
  const entry = getAssetEntrySync(id)
  if (!entry) {
    console.warn(`アセットが見つかりません: ${id}`)
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
 */
async function se(name: string): Promise<string | null> {
  const id = name.includes('/') ? name : `${CATEGORY_PREFIX.se}/${name}`
  return asset(id)
}

/**
 * SE用ヘルパー（同期版）
 */
function seSync(name: string): string | null {
  const id = name.includes('/') ? name : `${CATEGORY_PREFIX.se}/${name}`
  return assetSync(id)
}

/**
 * BGM用ヘルパー
 * @example bgm('かたまる脳みそ') → asset('audio/かたまる脳みそ')
 */
async function bgm(name: string): Promise<string | null> {
  const id = name.includes('/') ? name : `${CATEGORY_PREFIX.bgm}/${name}`
  return asset(id)
}

/**
 * BGM用ヘルパー（同期版）
 */
function bgmSync(name: string): string | null {
  const id = name.includes('/') ? name : `${CATEGORY_PREFIX.bgm}/${name}`
  return assetSync(id)
}

/**
 * 画像用ヘルパー
 * @example img('icon-play') → asset('images/icon-play')
 */
async function img(name: string): Promise<string | null> {
  const id = name.includes('/') ? name : `${CATEGORY_PREFIX.img}/${name}`
  return asset(id)
}

/**
 * 画像用ヘルパー（同期版）
 */
function imgSync(name: string): string | null {
  const id = name.includes('/') ? name : `${CATEGORY_PREFIX.img}/${name}`
  return assetSync(id)
}

/**
 * 動画用ヘルパー
 * @example video('intro') → asset('videos/intro')
 */
async function video(name: string): Promise<string | null> {
  const id = name.includes('/') ? name : `${CATEGORY_PREFIX.video}/${name}`
  return asset(id)
}

/**
 * 動画用ヘルパー（同期版）
 */
function videoSync(name: string): string | null {
  const id = name.includes('/') ? name : `${CATEGORY_PREFIX.video}/${name}`
  return assetSync(id)
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
 * マニフェストキャッシュをクリア（開発用）
 */
function clearManifestCache(): void {
  manifestCache = null
}

// エクスポート
export {
  // メイン
  asset,
  assetSync,
  // カテゴリ専用
  se,
  seSync,
  bgm,
  bgmSync,
  img,
  imgSync,
  video,
  videoSync,
  // ユーティリティ
  loadManifest,
  getManifestSync,
  getAssetEntry,
  getAssetEntrySync,
  getAssetsByType,
  getAllAssetIds,
  clearManifestCache,
  ASSET_BASE,
}

export type { AssetEntry, Manifest }

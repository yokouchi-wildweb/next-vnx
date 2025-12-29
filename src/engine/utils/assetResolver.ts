/**
 * シナリオ単位のアセット解決ユーティリティ
 *
 * 使用方法:
 *   const resolver = createScenarioResolver('_sample')
 *   const bgmPath = await resolver.bgm('存在しない街')
 *   const sePath = await resolver.se('爆発2')
 *   const scene = await resolver.loadScene('church')
 */

// TODO: 正式な型定義が確定したら engine/types から import する
// 現在は汎用的な型で対応
type Scenario = Record<string, unknown>
type Scene = Record<string, unknown>

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
  scenarioId: string
  assets: Record<string, AssetEntry>
  aliasMap: Record<string, string>
}

// シナリオごとのマニフェストキャッシュ
const manifestCache = new Map<string, Manifest>()

// ベースパス
const SCENARIOS_BASE = '/game/scenarios'

// カテゴリプレフィックス
const CATEGORY_PREFIX = {
  se: 'se',
  bgm: 'bgm',
  img: 'img',
  video: 'vid',
} as const

/**
 * シナリオ単位のアセットリゾルバー
 */
interface ScenarioResolver {
  /** シナリオID */
  scenarioId: string
  /** アセットベースパス */
  basePath: string
  /** マニフェストを読み込む */
  loadManifest: () => Promise<Manifest>
  /** IDまたはエイリアスからフルパスを解決 */
  asset: (idOrAlias: string) => Promise<string | null>
  /** BGM用ヘルパー */
  bgm: (name: string) => Promise<string | null>
  /** SE用ヘルパー */
  se: (name: string) => Promise<string | null>
  /** 画像用ヘルパー */
  img: (name: string) => Promise<string | null>
  /** 動画用ヘルパー */
  video: (name: string) => Promise<string | null>
  /** キャラクター画像（マニフェスト管理外、直接パス） */
  character: (path: string) => string
  /** 背景画像（マニフェスト管理外、直接パス） */
  background: (path: string) => string
  /** シナリオデータを読み込む */
  loadScenario: () => Promise<Scenario>
  /** シーンデータを読み込む */
  loadScene: (sceneId: string) => Promise<Scene>
  /** キャッシュクリア */
  clearCache: () => void
}

/**
 * シナリオ単位のアセットリゾルバーを作成
 *
 * @param scenarioId - シナリオID（例: '_sample'）
 * @returns ScenarioResolver
 *
 * @example
 * const resolver = createScenarioResolver('_sample')
 * const bgmPath = await resolver.bgm('存在しない街')
 * // → '/game/scenarios/_sample/assets/bgm/存在しない街.mp3'
 */
function createScenarioResolver(scenarioId: string): ScenarioResolver {
  const basePath = `${SCENARIOS_BASE}/${scenarioId}/assets`

  /**
   * マニフェストを読み込む（初回のみ fetch、以降はキャッシュ）
   */
  async function loadManifest(): Promise<Manifest> {
    if (manifestCache.has(scenarioId)) {
      return manifestCache.get(scenarioId)!
    }

    const response = await fetch(`${basePath}/manifest.json`)
    if (!response.ok) {
      throw new Error(`マニフェストの読み込みに失敗: ${scenarioId} (${response.status})`)
    }

    const manifest: Manifest = await response.json()
    manifestCache.set(scenarioId, manifest)
    return manifest
  }

  /**
   * IDまたはエイリアスをメインIDに解決
   */
  function resolveId(manifest: Manifest, idOrAlias: string): string {
    if (manifest.aliasMap[idOrAlias]) {
      return manifest.aliasMap[idOrAlias]
    }
    return idOrAlias
  }

  /**
   * IDまたはエイリアスからフルパスを解決
   */
  async function asset(idOrAlias: string): Promise<string | null> {
    const manifest = await loadManifest()
    const id = resolveId(manifest, idOrAlias)
    const entry = manifest.assets[id]

    if (!entry) {
      console.warn(`アセットが見つかりません: ${idOrAlias} (シナリオ: ${scenarioId})`)
      return null
    }

    return `${basePath}/${entry.path}`
  }

  /**
   * カテゴリ付きでアセット解決
   */
  async function resolveWithCategory(
    category: keyof typeof CATEGORY_PREFIX,
    name: string
  ): Promise<string | null> {
    const id = name.includes('/') ? name : `${CATEGORY_PREFIX[category]}/${name}`
    return asset(id)
  }

  /**
   * キャッシュをクリア
   */
  function clearCache(): void {
    manifestCache.delete(scenarioId)
  }

  /**
   * キャラクター画像のパスを生成（マニフェスト管理外）
   */
  function character(path: string): string {
    const fullPath = path.includes('.') ? path : `${path}.png`
    return `${SCENARIOS_BASE}/${scenarioId}/characters/${fullPath}`
  }

  /**
   * 背景画像のパスを生成（マニフェスト管理外）
   */
  function background(path: string): string {
    const fullPath = path.includes('.') ? path : `${path}.png`
    return `${SCENARIOS_BASE}/${scenarioId}/backgrounds/${fullPath}`
  }

  /**
   * シナリオデータを読み込む
   */
  async function loadScenario(): Promise<Scenario> {
    const scenarioPath = `${SCENARIOS_BASE}/${scenarioId}/scenario.json`
    const response = await fetch(scenarioPath)
    if (!response.ok) {
      throw new Error(`シナリオの読み込みに失敗: ${scenarioId} (${response.status})`)
    }
    return response.json()
  }

  /**
   * シーンデータを読み込む
   */
  async function loadScene(sceneId: string): Promise<Scene> {
    const scenePath = `${SCENARIOS_BASE}/${scenarioId}/scenes/${sceneId}/scene.json`
    const response = await fetch(scenePath)
    if (!response.ok) {
      throw new Error(`シーンの読み込みに失敗: ${sceneId} (${response.status})`)
    }
    return response.json()
  }

  return {
    scenarioId,
    basePath,
    loadManifest,
    asset,
    bgm: (name) => resolveWithCategory('bgm', name),
    se: (name) => resolveWithCategory('se', name),
    img: (name) => resolveWithCategory('img', name),
    video: (name) => resolveWithCategory('video', name),
    character,
    background,
    loadScenario,
    loadScene,
    clearCache,
  }
}

// ============================================
// ユーティリティ
// ============================================

/**
 * 全シナリオのキャッシュをクリア
 */
function clearAllManifestCache(): void {
  manifestCache.clear()
}

/**
 * 指定シナリオのマニフェストがキャッシュされているか確認
 */
function isManifestCached(scenarioId: string): boolean {
  return manifestCache.has(scenarioId)
}

// ============================================
// 後方互換性のためのヘルパー（非推奨、移行用）
// ============================================

// デフォルトリゾルバー（_sample シナリオ用）
let defaultResolver: ScenarioResolver | null = null

function getDefaultResolver(): ScenarioResolver {
  if (!defaultResolver) {
    defaultResolver = createScenarioResolver('_sample')
  }
  return defaultResolver
}

/**
 * @deprecated createScenarioResolver を使用してください
 */
async function bgm(name: string): Promise<string | null> {
  return getDefaultResolver().bgm(name)
}

/**
 * @deprecated createScenarioResolver を使用してください
 */
async function se(name: string): Promise<string | null> {
  return getDefaultResolver().se(name)
}

/**
 * @deprecated createScenarioResolver を使用してください
 */
function character(scenarioId: string, path: string): string {
  return createScenarioResolver(scenarioId).character(path)
}

/**
 * @deprecated createScenarioResolver を使用してください
 */
function background(scenarioId: string, path: string): string {
  return createScenarioResolver(scenarioId).background(path)
}

// エクスポート
export {
  // メイン
  createScenarioResolver,
  // ユーティリティ
  clearAllManifestCache,
  isManifestCached,
  // 後方互換（非推奨）
  bgm,
  se,
  character,
  background,
  // 定数
  SCENARIOS_BASE,
}

export type { AssetEntry, Manifest, ScenarioResolver }

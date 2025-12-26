/**
 * アセットマニフェスト生成スクリプト
 * Phase 3: エイリアス機能対応
 *
 * 使用方法: pnpm asset:scan
 *
 * 機能:
 * - 新規ファイル → ID自動生成して追加
 * - 移動されたファイル → 既存IDを維持、pathだけ更新
 * - 削除されたファイル → 警告表示
 * - エイリアス → 既存aliasesを維持、aliasMapを自動再構築
 */

import * as fs from 'fs'
import * as path from 'path'

// 設定
const ASSETS_DIR = path.resolve(__dirname, '../public/game/assets')
const MANIFEST_PATH = path.resolve(ASSETS_DIR, 'manifest.json')

// シナリオ固有アセット（マニフェスト管理対象外）
const SCENARIO_ASSET_CATEGORIES = ['characters', 'backgrounds']

// カテゴリ → タイプのマッピング
const CATEGORY_TYPE_MAP: Record<string, string> = {
  bgm: 'audio',
  se: 'audio',
  img: 'image',
  vid: 'video',
}

// 拡張子 → タイプのフォールバック
const EXT_TYPE_MAP: Record<string, string> = {
  mp3: 'audio',
  wav: 'audio',
  ogg: 'audio',
  m4a: 'audio',
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  webp: 'image',
  gif: 'image',
  mp4: 'video',
  webm: 'video',
}

interface AssetEntry {
  path: string
  ext: string
  type: string
  aliases?: string[]
}

interface Manifest {
  version: number
  generatedAt: string
  assets: Record<string, AssetEntry>
  aliasMap: Record<string, string>
}

/**
 * 既存マニフェストを読み込む
 */
function loadExistingManifest(): Manifest | null {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return null
  }

  try {
    const content = fs.readFileSync(MANIFEST_PATH, 'utf-8')
    return JSON.parse(content)
  } catch {
    console.warn('⚠️  既存マニフェストの読み込みに失敗、新規作成します')
    return null
  }
}

/**
 * ディレクトリを再帰的にスキャンしてファイル一覧を取得
 */
function scanDirectory(dir: string, baseDir: string = dir): string[] {
  const files: string[] = []

  if (!fs.existsSync(dir)) {
    return files
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (dir === baseDir && SCENARIO_ASSET_CATEGORIES.includes(entry.name)) {
        console.log(`   ⏭️  スキップ（シナリオ固有）: ${entry.name}/`)
        continue
      }
      files.push(...scanDirectory(fullPath, baseDir))
    } else if (entry.isFile()) {
      if (
        entry.name.startsWith('.') ||
        entry.name === 'manifest.json' ||
        entry.name === '.gitkeep'
      ) {
        continue
      }
      const relativePath = path.relative(baseDir, fullPath)
      files.push(relativePath)
    }
  }

  return files
}

/**
 * ファイルパスからカテゴリを抽出
 */
function extractCategory(filePath: string): string {
  const parts = filePath.split(path.sep)
  return parts[0] || ''
}

/**
 * ファイルパスからタイプを判定
 */
function detectType(filePath: string, ext: string): string {
  const category = extractCategory(filePath)
  if (CATEGORY_TYPE_MAP[category]) {
    return CATEGORY_TYPE_MAP[category]
  }
  if (EXT_TYPE_MAP[ext]) {
    return EXT_TYPE_MAP[ext]
  }
  return 'unknown'
}

/**
 * ファイルパスからIDを生成
 */
function generateId(filePath: string): string {
  const category = extractCategory(filePath)
  const fileName = path.basename(filePath)
  const nameWithoutExt = fileName.replace(/\.[^.]+$/, '')
  return `${category}/${nameWithoutExt}`
}

/**
 * ファイル名（拡張子なし）を抽出
 */
function extractFileName(filePath: string): string {
  const fileName = path.basename(filePath)
  return fileName.replace(/\.[^.]+$/, '')
}

/**
 * aliasMapを構築
 */
function buildAliasMap(assets: Record<string, AssetEntry>): Record<string, string> {
  const aliasMap: Record<string, string> = {}

  for (const [id, entry] of Object.entries(assets)) {
    if (entry.aliases && entry.aliases.length > 0) {
      for (const alias of entry.aliases) {
        aliasMap[alias] = id
      }
    }
  }

  return aliasMap
}

/**
 * メイン処理
 */
function main() {
  console.log('🔍 アセットをスキャン中...')
  console.log(`   ディレクトリ: ${ASSETS_DIR}`)

  // 既存マニフェストを読み込む
  const existingManifest = loadExistingManifest()
  const existingAssets = existingManifest?.assets || {}

  // 既存IDからファイル名へのマップを構築（移動追跡用）
  const fileNameToExistingId: Record<string, string> = {}
  for (const [id, entry] of Object.entries(existingAssets)) {
    const fileName = extractFileName(entry.path)
    const category = extractCategory(entry.path)
    const key = `${category}:${fileName}`
    fileNameToExistingId[key] = id
  }

  // ファイルをスキャン
  const files = scanDirectory(ASSETS_DIR)
  console.log(`   ${files.length} ファイルを発見`)

  // 統計
  const stats = {
    added: 0,
    updated: 0,
    unchanged: 0,
    missing: 0,
  }

  // 新しいマニフェストを構築
  const assets: Record<string, AssetEntry> = {}
  const processedExistingIds = new Set<string>()
  const idConflicts: Record<string, string[]> = {}

  for (const filePath of files) {
    const ext = path.extname(filePath).slice(1).toLowerCase()
    const type = detectType(filePath, ext)
    const fileName = extractFileName(filePath)
    const category = extractCategory(filePath)
    const key = `${category}:${fileName}`

    // 既存IDがあるか確認（移動追跡）
    let id: string
    let existingAliases: string[] | undefined
    const existingId = fileNameToExistingId[key]

    if (existingId && existingAssets[existingId]) {
      // 既存IDを維持
      id = existingId
      existingAliases = existingAssets[existingId].aliases
      processedExistingIds.add(existingId)

      // pathが変わったか確認
      if (existingAssets[existingId].path !== filePath) {
        console.log(`   🔄 移動検出: ${existingAssets[existingId].path} → ${filePath}`)
        stats.updated++
      } else {
        stats.unchanged++
      }
    } else {
      // 新規ID生成
      id = generateId(filePath)
      console.log(`   ➕ 新規追加: ${id}`)
      stats.added++
    }

    // ID重複チェック
    if (assets[id]) {
      if (!idConflicts[id]) {
        idConflicts[id] = [assets[id].path]
      }
      idConflicts[id].push(filePath)
      console.warn(`⚠️  ID重複: "${id}"`)
      console.warn(`   - ${assets[id].path}`)
      console.warn(`   - ${filePath}`)
      continue
    }

    const entry: AssetEntry = {
      path: filePath,
      ext,
      type,
    }

    // 既存のエイリアスを維持
    if (existingAliases && existingAliases.length > 0) {
      entry.aliases = existingAliases
    }

    assets[id] = entry
  }

  // 見つからなかったファイルを警告
  for (const [id, entry] of Object.entries(existingAssets)) {
    if (!processedExistingIds.has(id)) {
      console.warn(`   ⚠️  見つかりません: ${id} (${entry.path})`)
      stats.missing++
    }
  }

  // 重複があれば警告
  if (Object.keys(idConflicts).length > 0) {
    console.error('\n❌ ID重複が検出されました。ファイル名を変更してください。')
    process.exit(1)
  }

  // aliasMapを構築
  const aliasMap = buildAliasMap(assets)

  // マニフェストを生成
  const manifest: Manifest = {
    version: 3,
    generatedAt: new Date().toISOString(),
    assets,
    aliasMap,
  }

  // ファイルに書き込み
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8')

  console.log(`\n✅ マニフェストを生成しました`)
  console.log(`   出力先: ${MANIFEST_PATH}`)
  console.log(`   アセット数: ${Object.keys(assets).length}`)
  console.log(`   エイリアス数: ${Object.keys(aliasMap).length}`)

  // 統計を表示
  console.log(`\n📊 更新統計:`)
  console.log(`   - 新規追加: ${stats.added}`)
  console.log(`   - 移動更新: ${stats.updated}`)
  console.log(`   - 変更なし: ${stats.unchanged}`)
  if (stats.missing > 0) {
    console.log(`   - 見つからず（削除済み）: ${stats.missing}`)
  }

  // タイプ別の集計
  const typeCounts: Record<string, number> = {}
  for (const asset of Object.values(assets)) {
    typeCounts[asset.type] = (typeCounts[asset.type] || 0) + 1
  }
  console.log(`\n📁 タイプ別:`)
  for (const [type, count] of Object.entries(typeCounts)) {
    console.log(`   - ${type}: ${count}`)
  }
}

main()

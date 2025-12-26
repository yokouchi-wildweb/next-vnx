/**
 * アセットマニフェスト生成スクリプト
 * Phase 1: スキャン → マニフェスト生成（エイリアス・差分更新なし）
 *
 * 使用方法: pnpm asset:manifest
 */

import * as fs from 'fs'
import * as path from 'path'

// 設定
const ASSETS_DIR = path.resolve(__dirname, '../public/game/assets')
const MANIFEST_PATH = path.resolve(ASSETS_DIR, 'manifest.json')

// シナリオ固有アセット（マニフェスト管理対象外）
// これらは public/game/scenarios/ で管理され、シナリオJSONから直接参照される
const SCENARIO_ASSET_CATEGORIES = ['characters', 'backgrounds']

// カテゴリ → タイプのマッピング（汎用アセットのみ）
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
}

interface Manifest {
  version: number
  generatedAt: string
  assets: Record<string, AssetEntry>
}

/**
 * ディレクトリを再帰的にスキャンしてファイル一覧を取得
 * シナリオ固有アセットカテゴリは除外
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
      // シナリオ固有アセットカテゴリはスキップ
      if (dir === baseDir && SCENARIO_ASSET_CATEGORIES.includes(entry.name)) {
        console.log(`   ⏭️  スキップ（シナリオ固有）: ${entry.name}/`)
        continue
      }
      files.push(...scanDirectory(fullPath, baseDir))
    } else if (entry.isFile()) {
      // 隠しファイル、manifest.json、.gitkeep をスキップ
      if (
        entry.name.startsWith('.') ||
        entry.name === 'manifest.json' ||
        entry.name === '.gitkeep'
      ) {
        continue
      }
      // 相対パスを取得
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

  // カテゴリからタイプを判定
  if (CATEGORY_TYPE_MAP[category]) {
    return CATEGORY_TYPE_MAP[category]
  }

  // 拡張子からタイプを判定
  if (EXT_TYPE_MAP[ext]) {
    return EXT_TYPE_MAP[ext]
  }

  return 'unknown'
}

/**
 * ファイルパスからIDを生成
 * 形式: カテゴリ/ファイル名（拡張子なし）
 */
function generateId(filePath: string): string {
  const category = extractCategory(filePath)
  const fileName = path.basename(filePath)
  const nameWithoutExt = fileName.replace(/\.[^.]+$/, '')
  return `${category}/${nameWithoutExt}`
}

/**
 * メイン処理
 */
function main() {
  console.log('🔍 アセットをスキャン中...')
  console.log(`   ディレクトリ: ${ASSETS_DIR}`)

  // ファイルをスキャン
  const files = scanDirectory(ASSETS_DIR)
  console.log(`   ${files.length} ファイルを発見`)

  // マニフェストを構築
  const assets: Record<string, AssetEntry> = {}
  const idConflicts: Record<string, string[]> = {}

  for (const filePath of files) {
    const ext = path.extname(filePath).slice(1).toLowerCase()
    const id = generateId(filePath)
    const type = detectType(filePath, ext)

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

    assets[id] = {
      path: filePath,
      ext,
      type,
    }
  }

  // 重複があれば警告
  if (Object.keys(idConflicts).length > 0) {
    console.error('\n❌ ID重複が検出されました。ファイル名を変更してください。')
    process.exit(1)
  }

  // マニフェストを生成
  const manifest: Manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    assets,
  }

  // ファイルに書き込み
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8')

  console.log(`\n✅ マニフェストを生成しました`)
  console.log(`   出力先: ${MANIFEST_PATH}`)
  console.log(`   アセット数: ${Object.keys(assets).length}`)

  // タイプ別の集計
  const typeCounts: Record<string, number> = {}
  for (const asset of Object.values(assets)) {
    typeCounts[asset.type] = (typeCounts[asset.type] || 0) + 1
  }
  console.log(`   内訳:`)
  for (const [type, count] of Object.entries(typeCounts)) {
    console.log(`     - ${type}: ${count}`)
  }
}

main()

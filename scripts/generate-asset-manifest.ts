/**
 * アセットマニフェスト生成スクリプト
 * シナリオ単位でマニフェストを生成
 *
 * 使用方法:
 *   pnpm asset:scan --scenario _sample   # 指定シナリオ
 *   pnpm asset:scan --all                # 全シナリオ
 *
 * 機能:
 * - 新規ファイル → ID自動生成して追加
 * - 移動されたファイル → 既存IDを維持、pathだけ更新
 * - 削除されたファイル → 警告表示
 * - エイリアス → 既存aliasesを維持、aliasMapを自動再構築
 */

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

// 設定
const SCENARIOS_DIR = path.resolve(__dirname, '../public/game/scenarios')

// 除外カテゴリ（将来的に別管理予定）
const EXCLUDED_CATEGORIES = ['characters', 'backgrounds']

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
  scenarioId: string
  assets: Record<string, AssetEntry>
  aliasMap: Record<string, string>
}

/**
 * 既存マニフェストを読み込む
 */
function loadExistingManifest(manifestPath: string): Manifest | null {
  if (!fs.existsSync(manifestPath)) {
    return null
  }

  try {
    const content = fs.readFileSync(manifestPath, 'utf-8')
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
      // 除外カテゴリはスキップ
      if (dir === baseDir && EXCLUDED_CATEGORIES.includes(entry.name)) {
        console.log(`   ⏭️  スキップ（除外対象）: ${entry.name}/`)
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
 * シナリオのマニフェストを生成
 */
function generateManifestForScenario(scenarioId: string): boolean {
  const assetsDir = path.join(SCENARIOS_DIR, scenarioId, 'assets')
  const manifestPath = path.join(assetsDir, 'manifest.json')

  console.log(`\n📁 シナリオ: ${scenarioId}`)
  console.log(`   ディレクトリ: ${assetsDir}`)

  if (!fs.existsSync(assetsDir)) {
    console.log(`   ⚠️  assets/ ディレクトリが存在しません、スキップ`)
    return false
  }

  // 既存マニフェストを読み込む
  const existingManifest = loadExistingManifest(manifestPath)
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
  const files = scanDirectory(assetsDir)
  console.log(`   ${files.length} ファイルを発見`)

  if (files.length === 0) {
    console.log(`   ⚠️  アセットが見つかりません、スキップ`)
    return false
  }

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
    return false
  }

  // aliasMapを構築
  const aliasMap = buildAliasMap(assets)

  // マニフェストを生成
  const manifest: Manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    scenarioId,
    assets,
    aliasMap,
  }

  // ファイルに書き込み
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8')

  console.log(`   ✅ マニフェスト生成完了`)
  console.log(`   アセット数: ${Object.keys(assets).length}`)
  console.log(`   エイリアス数: ${Object.keys(aliasMap).length}`)

  // 統計を表示
  if (stats.added > 0 || stats.updated > 0 || stats.missing > 0) {
    console.log(`   📊 更新統計:`)
    if (stats.added > 0) console.log(`      - 新規追加: ${stats.added}`)
    if (stats.updated > 0) console.log(`      - 移動更新: ${stats.updated}`)
    if (stats.missing > 0) console.log(`      - 見つからず: ${stats.missing}`)
  }

  return true
}

/**
 * 全シナリオを取得
 */
function getAllScenarioIds(): string[] {
  if (!fs.existsSync(SCENARIOS_DIR)) {
    return []
  }

  const entries = fs.readdirSync(SCENARIOS_DIR, { withFileTypes: true })
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => e.name)
}

/**
 * 対話形式でシナリオを選択
 */
async function promptScenarioSelection(scenarios: string[]): Promise<string[]> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  console.log('\n📋 利用可能なシナリオ:')
  scenarios.forEach((s, i) => console.log(`   ${i + 1}. ${s}`))
  console.log(`   a. 全て`)

  return new Promise((resolve) => {
    rl.question('\n選択 (番号/名前/a): ', (answer) => {
      rl.close()

      const trimmed = answer.trim().toLowerCase()

      // 'a' または 'all' で全選択
      if (trimmed === 'a' || trimmed === 'all') {
        resolve(scenarios)
        return
      }

      // 番号で選択
      const num = parseInt(trimmed, 10)
      if (!isNaN(num) && num >= 1 && num <= scenarios.length) {
        resolve([scenarios[num - 1]])
        return
      }

      // 名前で選択
      if (scenarios.includes(trimmed)) {
        resolve([trimmed])
        return
      }

      // 該当なし
      console.log('⚠️  無効な選択です')
      process.exit(1)
    })
  })
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2)
  const scenarioIndex = args.indexOf('--scenario')
  const isAll = args.includes('--all')

  console.log('🔍 アセットマニフェスト生成')

  let scenarioIds: string[] = []

  if (scenarioIndex !== -1 && args[scenarioIndex + 1]) {
    // --scenario <id> 指定
    scenarioIds = [args[scenarioIndex + 1]]
  } else if (isAll) {
    // --all 指定
    scenarioIds = getAllScenarioIds()
    console.log(`   全シナリオをスキャン: ${scenarioIds.join(', ')}`)
  } else {
    // 引数なし: 対話形式で選択
    const allScenarios = getAllScenarioIds()
    if (allScenarios.length === 0) {
      console.log('⚠️  シナリオがありません')
      process.exit(1)
    }
    scenarioIds = await promptScenarioSelection(allScenarios)
  }

  if (scenarioIds.length === 0) {
    console.log('⚠️  対象シナリオがありません')
    process.exit(1)
  }

  let successCount = 0
  let failCount = 0

  for (const scenarioId of scenarioIds) {
    const success = generateManifestForScenario(scenarioId)
    if (success) {
      successCount++
    } else {
      failCount++
    }
  }

  console.log(`\n🎉 完了: ${successCount} 成功, ${failCount} スキップ`)
}

main()

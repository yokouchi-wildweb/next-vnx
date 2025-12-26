/**
 * アセットエイリアス追加スクリプト
 *
 * 使用方法:
 *   対話式: pnpm asset:alias
 *   ワンライナー: pnpm asset:alias <アセットID> <エイリアス>
 *
 * 例:
 *   pnpm asset:alias se/爆発2 se/explosion-02
 */

import * as fs from 'fs'
import * as path from 'path'
import { input, select } from '@inquirer/prompts'

const MANIFEST_PATH = path.resolve(__dirname, '../public/game/assets/manifest.json')
const BACK_TO_SEARCH = '__BACK_TO_SEARCH__'

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
 * マニフェストを読み込む
 */
function loadManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('❌ マニフェストが見つかりません。先に pnpm asset:scan を実行してください。')
    process.exit(1)
  }

  const content = fs.readFileSync(MANIFEST_PATH, 'utf-8')
  return JSON.parse(content)
}

/**
 * マニフェストを保存
 */
function saveManifest(manifest: Manifest): void {
  // aliasMapを再構築
  const aliasMap: Record<string, string> = {}
  for (const [id, entry] of Object.entries(manifest.assets)) {
    if (entry.aliases && entry.aliases.length > 0) {
      for (const alias of entry.aliases) {
        aliasMap[alias] = id
      }
    }
  }
  manifest.aliasMap = aliasMap
  manifest.generatedAt = new Date().toISOString()

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8')
}

/**
 * エイリアスのバリデーション
 */
function validateAlias(
  manifest: Manifest,
  assetId: string,
  alias: string
): { valid: boolean; error?: string } {
  // アセットIDが存在するか確認
  if (!manifest.assets[assetId]) {
    return { valid: false, error: `アセット "${assetId}" が見つかりません` }
  }

  // エイリアスがメインIDと重複していないか
  if (manifest.assets[alias]) {
    return { valid: false, error: `"${alias}" は既存のメインIDです。エイリアスとして使用できません。` }
  }

  // 他のエイリアスと重複していないか
  if (manifest.aliasMap[alias]) {
    const owner = manifest.aliasMap[alias]
    if (owner === assetId) {
      return { valid: false, error: `"${alias}" は既に "${assetId}" のエイリアスとして登録済みです` }
    }
    return { valid: false, error: `"${alias}" は "${owner}" のエイリアスとして既に登録済みです` }
  }

  return { valid: true }
}

/**
 * エイリアスを追加
 */
function addAlias(manifest: Manifest, assetId: string, alias: string): void {
  const entry = manifest.assets[assetId]
  if (!entry.aliases) {
    entry.aliases = []
  }
  entry.aliases.push(alias)
}

/**
 * アセットを検索
 */
function searchAssets(manifest: Manifest, query: string): string[] {
  const lowerQuery = query.toLowerCase()
  return Object.keys(manifest.assets).filter((id) => id.toLowerCase().includes(lowerQuery))
}

/**
 * 検索 → 選択 のループ
 */
async function selectAssetLoop(manifest: Manifest): Promise<string | null> {
  while (true) {
    // 検索クエリを入力
    const query = await input({
      message: '🔍 アセットを検索（空でキャンセル）:',
    })

    if (!query.trim()) {
      return null
    }

    // 検索実行
    const results = searchAssets(manifest, query.trim())

    if (results.length === 0) {
      console.log('   検索結果がありません\n')
      continue
    }

    // 選択肢を構築
    const choices = [
      ...results.map((id) => {
        const entry = manifest.assets[id]
        const aliasInfo =
          entry.aliases && entry.aliases.length > 0 ? ` [aliases: ${entry.aliases.join(', ')}]` : ''
        return {
          name: `${id}${aliasInfo}`,
          value: id,
        }
      }),
      {
        name: '← 検索に戻る',
        value: BACK_TO_SEARCH,
      },
    ]

    // 選択
    const selected = await select({
      message: `検索結果 (${results.length}件):`,
      choices,
      pageSize: 15,
    })

    if (selected === BACK_TO_SEARCH) {
      continue
    }

    return selected
  }
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2)
  const manifest = loadManifest()

  // ワンライナーモード
  if (args.length >= 2) {
    const [assetId, alias] = args

    const validation = validateAlias(manifest, assetId, alias)
    if (!validation.valid) {
      console.error(`❌ ${validation.error}`)
      process.exit(1)
    }

    addAlias(manifest, assetId, alias)
    saveManifest(manifest)

    console.log(`✅ エイリアスを追加しました: ${alias} → ${assetId}`)
    return
  }

  // 対話式モード
  console.log('🏷️  アセットエイリアス追加')
  console.log('   Ctrl+C でキャンセル\n')

  // アセットを検索 → 選択
  const assetId = await selectAssetLoop(manifest)
  if (!assetId) {
    console.log('キャンセルしました')
    return
  }

  console.log(`\n   選択: ${assetId}\n`)

  // エイリアスを入力
  const alias = await input({
    message: 'エイリアス:',
  })

  if (!alias.trim()) {
    console.log('キャンセルしました')
    return
  }

  // バリデーション
  const validation = validateAlias(manifest, assetId, alias.trim())
  if (!validation.valid) {
    console.error(`❌ ${validation.error}`)
    process.exit(1)
  }

  // 追加
  addAlias(manifest, assetId, alias.trim())
  saveManifest(manifest)

  console.log(`\n✅ エイリアスを追加しました: ${alias.trim()} → ${assetId}`)
}

main().catch(console.error)

#!/usr/bin/env node
/**
 * Setting Config CLI - 設定項目の管理スクリプト
 *
 * 使用方法:
 *   --init              setting-fields.json のテンプレートを生成
 *   --generate          拡張ファイルを生成
 *   --list              設定項目の一覧を表示
 *   --add               対話形式でフィールドを追加
 *   --remove            フィールドを削除
 *
 * オプション:
 *   --samples           init時にサンプルフィールドを含める
 *   --force             既存ファイルを上書き
 *   --extended          拡張フィールドのみ表示
 *   --base              基本フィールドのみ表示
 *   --json              JSON形式で出力
 *   --name <name>       removeで削除するフィールド名を指定
 *
 * 例:
 *   pnpm sc:init
 *   pnpm sc:init -- --samples
 *   pnpm sc:list
 *   pnpm sc:list -- --json
 *   pnpm sc:generate
 *   pnpm sc:add
 *   pnpm sc:remove
 *   pnpm sc:remove -- --name siteTitle
 */
import init from "./init.mjs";
import list from "./list.mjs";
import generate from "./generate.mjs";
import addField from "./add-field.mjs";
import removeField from "./remove-field.mjs";

function printUsage() {
  console.log(`
\x1b[1mSetting Config CLI\x1b[0m - 設定項目の管理

\x1b[36m使用方法:\x1b[0m
  node scripts/setting-config/index.mjs <command> [options]

\x1b[36mコマンド:\x1b[0m
  --init              setting-fields.json のテンプレートを生成
  --generate          拡張ファイルを生成
  --list              設定項目の一覧を表示
  --add               対話形式でフィールドを追加
  --remove            フィールドを削除

\x1b[36mオプション:\x1b[0m
  --samples           init時にサンプルフィールドを含める
  --force             既存ファイルを上書き
  --extended          listで拡張フィールドのみ表示
  --base              listで基本フィールドのみ表示
  --json              listでJSON形式出力
  --name <name>       removeで削除するフィールド名を指定

\x1b[36m例:\x1b[0m
  pnpm sc:init
  pnpm sc:init -- --samples --force
  pnpm sc:list
  pnpm sc:list -- --json
  pnpm sc:generate
  pnpm sc:add
  pnpm sc:remove
  pnpm sc:remove -- --name siteTitle
`);
}

async function main() {
  const args = process.argv.slice(2);

  const hasInit = args.includes("--init");
  const hasGenerate = args.includes("--generate");
  const hasList = args.includes("--list");
  const hasAdd = args.includes("--add");
  const hasRemove = args.includes("--remove");
  const hasHelp = args.includes("--help") || args.includes("-h");

  // ヘルプ表示
  if (hasHelp || args.length === 0) {
    printUsage();
    process.exit(0);
  }

  try {
    // init コマンド
    if (hasInit) {
      const options = {
        withSamples: args.includes("--samples"),
        force: args.includes("--force"),
      };
      await init(options);
      return;
    }

    // list コマンド
    if (hasList) {
      const options = {
        extended: args.includes("--extended"),
        base: args.includes("--base"),
        json: args.includes("--json"),
      };
      await list(options);
      return;
    }

    // generate コマンド
    if (hasGenerate) {
      await generate();
      return;
    }

    // add コマンド
    if (hasAdd) {
      await addField();
      return;
    }

    // remove コマンド
    if (hasRemove) {
      // --name オプションの取得
      const nameIndex = args.indexOf("--name");
      const name = nameIndex !== -1 ? args[nameIndex + 1] : undefined;
      await removeField({ name });
      return;
    }

    // 不明なコマンド
    console.error("\x1b[31m不明なコマンドです\x1b[0m");
    printUsage();
    process.exit(1);
  } catch (err) {
    console.error(`\x1b[31mエラー: ${err.message}\x1b[0m`);
    process.exit(1);
  }
}

main();

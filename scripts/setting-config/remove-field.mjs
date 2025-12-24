#!/usr/bin/env node
/**
 * フィールドを削除するスクリプト
 *
 * 使用方法:
 *   pnpm sc:remove
 *   pnpm sc:remove -- --name <fieldName>
 */
import inquirer from "inquirer";
import { readSettingFields, writeSettingFields } from "./utils/config-reader.mjs";
import generate from "./generate.mjs";

/**
 * メイン処理
 */
export default async function removeField(options = {}) {
  console.log("\n\x1b[1m=== Setting Config: フィールド削除 ===\x1b[0m\n");

  // 設定ファイルの読み込み
  const config = readSettingFields();
  if (!config) {
    console.log("\x1b[31msetting-fields.json が存在しません\x1b[0m");
    console.log("先に `pnpm sc:init` を実行してください");
    return;
  }

  const fields = config.fields || [];
  if (fields.length === 0) {
    console.log("\x1b[33m削除可能なフィールドがありません\x1b[0m");
    return;
  }

  let fieldToRemove;

  // --name オプションで指定された場合
  if (options.name) {
    fieldToRemove = fields.find((f) => f.name === options.name);
    if (!fieldToRemove) {
      console.log(`\x1b[31mフィールド "${options.name}" は存在しません\x1b[0m`);
      console.log("\n存在するフィールド:");
      fields.forEach((f) => console.log(`  - ${f.name} (${f.label})`));
      return;
    }
  } else {
    // 対話形式で選択
    const choices = fields.map((f) => ({
      value: f.name,
      name: `${f.name} (${f.label}) - ${f.fieldType}`,
    }));

    const { selectedField } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedField",
        message: "削除するフィールドを選択:",
        choices: choices,
      },
    ]);

    fieldToRemove = fields.find((f) => f.name === selectedField);
  }

  // フィールド情報の表示
  console.log("\n\x1b[36m削除対象のフィールド:\x1b[0m");
  console.log(JSON.stringify(fieldToRemove, null, 2));

  // 確認
  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: `\x1b[33m警告:\x1b[0m フィールド "${fieldToRemove.name}" を削除しますか？`,
      default: false,
    },
  ]);

  if (!confirm) {
    console.log("キャンセルしました");
    return;
  }

  // フィールドを削除
  config.fields = fields.filter((f) => f.name !== fieldToRemove.name);

  // 設定ファイルに書き込み
  writeSettingFields(config);
  console.log(`\n\x1b[32m✓ フィールド "${fieldToRemove.name}" を削除しました\x1b[0m`);

  // 残りのフィールド数を表示
  const remainingCount = config.fields.length;
  console.log(`残りのフィールド数: ${remainingCount}`);

  // 再生成の確認
  const { regenerate } = await inquirer.prompt([
    {
      type: "confirm",
      name: "regenerate",
      message: "ファイルを再生成しますか？",
      default: true,
    },
  ]);

  if (regenerate) {
    console.log("\n\x1b[36m=== ファイル再生成 ===\x1b[0m");
    await generate();
  } else {
    console.log("\n後で `pnpm sc:generate` を実行してファイルを生成してください");
  }

  // DB削除の注意
  console.log("\n\x1b[33m注意:\x1b[0m DBカラムは自動削除されません。");
  console.log("必要に応じて手動でマイグレーションを実行してください:");
  console.log("  1. drizzle.ts から該当カラムを手動で削除");
  console.log("  2. pnpm db:generate && pnpm db:push");

  console.log("\n\x1b[32m✓ 完了！\x1b[0m");
}

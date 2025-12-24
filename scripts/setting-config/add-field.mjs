#!/usr/bin/env node
/**
 * 対話形式でフィールドを追加するスクリプト
 *
 * 使用方法:
 *   pnpm sc:add
 */
import inquirer from "inquirer";
import { readSettingFields, writeSettingFields, getSettingFieldsPath, SETTING_CONFIG_VERSION } from "./utils/config-reader.mjs";
import generate from "./generate.mjs";
import fs from "fs";

// サポートされているフィールドタイプ
const FIELD_TYPES = [
  { value: "string", name: "string - テキスト" },
  { value: "integer", name: "integer - 整数" },
  { value: "float", name: "float - 小数" },
  { value: "boolean", name: "boolean - 真偽値" },
  { value: "enum", name: "enum - 選択肢" },
  { value: "date", name: "date - 日付" },
  { value: "timestamp", name: "timestamp - タイムスタンプ" },
  { value: "mediaUploader", name: "mediaUploader - 画像/ファイル" },
];

// フィールドタイプに対応するフォーム入力タイプ
const FORM_INPUT_MAP = {
  string: [
    { value: "textInput", name: "textInput - 1行テキスト" },
    { value: "textarea", name: "textarea - 複数行テキスト" },
  ],
  integer: [{ value: "numberInput", name: "numberInput - 数値入力" }],
  float: [{ value: "numberInput", name: "numberInput - 数値入力" }],
  boolean: [{ value: "switchInput", name: "switchInput - スイッチ" }],
  enum: [
    { value: "select", name: "select - ドロップダウン" },
    { value: "radio", name: "radio - ラジオボタン" },
  ],
  date: [{ value: "dateInput", name: "dateInput - 日付選択" }],
  timestamp: [{ value: "datetimeInput", name: "datetimeInput - 日時選択" }],
  mediaUploader: [{ value: "mediaUploader", name: "mediaUploader - ファイルアップロード" }],
};

/**
 * フィールド名のバリデーション
 */
function validateFieldName(name, existingFields) {
  if (!name) {
    return "フィールド名を入力してください";
  }
  if (!/^[a-z][a-zA-Z0-9]*$/.test(name)) {
    return "フィールド名は camelCase で入力してください（例: siteTitle）";
  }
  if (existingFields.some((f) => f.name === name)) {
    return `フィールド "${name}" は既に存在します`;
  }
  return true;
}

/**
 * enum のオプションを対話的に追加
 */
async function promptEnumOptions() {
  const options = [];

  console.log("\n選択肢を追加してください（空のvalueで終了）:");

  while (true) {
    const { value } = await inquirer.prompt([
      {
        type: "input",
        name: "value",
        message: `選択肢 ${options.length + 1} の value（空で終了）:`,
      },
    ]);

    if (!value) {
      if (options.length < 2) {
        console.log("\x1b[33m選択肢は最低2つ必要です\x1b[0m");
        continue;
      }
      break;
    }

    const { label } = await inquirer.prompt([
      {
        type: "input",
        name: "label",
        message: `選択肢 "${value}" のラベル（日本語）:`,
        default: value,
      },
    ]);

    options.push({ value, label });
    console.log(`  追加: ${value} (${label})`);
  }

  return options;
}

/**
 * mediaUploader の追加設定を取得
 */
async function promptMediaUploaderOptions() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "uploadPath",
      message: "アップロードパス:",
      default: "setting",
    },
    {
      type: "input",
      name: "accept",
      message: "許可するファイルタイプ:",
      default: "image/*",
    },
  ]);

  return answers;
}

/**
 * デフォルト値の入力プロンプト
 */
async function promptDefaultValue(fieldType) {
  if (fieldType === "mediaUploader") {
    return null; // mediaUploader はデフォルト値なし
  }

  if (fieldType === "boolean") {
    const { defaultValue } = await inquirer.prompt([
      {
        type: "confirm",
        name: "defaultValue",
        message: "デフォルト値（true/false）:",
        default: false,
      },
    ]);
    return defaultValue;
  }

  if (fieldType === "integer" || fieldType === "float") {
    const { defaultValue } = await inquirer.prompt([
      {
        type: "input",
        name: "defaultValue",
        message: "デフォルト値（数値、空でnull）:",
        filter: (val) => {
          if (val === "") return null;
          return fieldType === "integer" ? parseInt(val, 10) : parseFloat(val);
        },
      },
    ]);
    return defaultValue;
  }

  // string, enum, date, timestamp
  const { defaultValue } = await inquirer.prompt([
    {
      type: "input",
      name: "defaultValue",
      message: "デフォルト値（空でnull）:",
      default: "",
    },
  ]);

  return defaultValue || null;
}

/**
 * メイン処理
 */
export default async function addField() {
  console.log("\n\x1b[1m=== Setting Config: フィールド追加 ===\x1b[0m\n");

  // 設定ファイルの読み込み（存在しない場合は初期化）
  let config = readSettingFields();
  if (!config) {
    const configPath = getSettingFieldsPath();
    console.log(`\x1b[33m${configPath} が存在しません\x1b[0m`);

    const { createNew } = await inquirer.prompt([
      {
        type: "confirm",
        name: "createNew",
        message: "新規作成しますか？",
        default: true,
      },
    ]);

    if (!createNew) {
      console.log("キャンセルしました");
      return;
    }

    config = {
      settingConfigVersion: SETTING_CONFIG_VERSION,
      fields: [],
    };
  }

  const existingFields = config.fields || [];

  // 基本情報の入力
  const basicAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "フィールド名（camelCase）:",
      validate: (val) => validateFieldName(val, existingFields),
    },
    {
      type: "input",
      name: "label",
      message: "ラベル（日本語）:",
      validate: (val) => (val ? true : "ラベルを入力してください"),
    },
    {
      type: "list",
      name: "fieldType",
      message: "フィールドタイプ:",
      choices: FIELD_TYPES,
    },
  ]);

  // フォーム入力タイプの選択
  const formInputChoices = FORM_INPUT_MAP[basicAnswers.fieldType];
  let formInput;

  if (formInputChoices.length === 1) {
    formInput = formInputChoices[0].value;
    console.log(`フォーム入力タイプ: ${formInput}`);
  } else {
    const { selectedFormInput } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedFormInput",
        message: "フォーム入力タイプ:",
        choices: formInputChoices,
      },
    ]);
    formInput = selectedFormInput;
  }

  // 必須項目かどうか
  const { required } = await inquirer.prompt([
    {
      type: "confirm",
      name: "required",
      message: "必須項目ですか？",
      default: false,
    },
  ]);

  // フィールド定義の構築
  const newField = {
    name: basicAnswers.name,
    label: basicAnswers.label,
    fieldType: basicAnswers.fieldType,
    formInput: formInput,
    required: required,
  };

  // enum の場合はオプションを追加
  if (basicAnswers.fieldType === "enum") {
    const options = await promptEnumOptions();
    newField.options = options;

    // デフォルト値の選択
    const { defaultOption } = await inquirer.prompt([
      {
        type: "list",
        name: "defaultOption",
        message: "デフォルト値:",
        choices: [{ value: null, name: "（なし）" }, ...options.map((o) => ({ value: o.value, name: `${o.value} (${o.label})` }))],
      },
    ]);
    if (defaultOption) {
      newField.defaultValue = defaultOption;
    }
  } else {
    // デフォルト値の入力
    const defaultValue = await promptDefaultValue(basicAnswers.fieldType);
    if (defaultValue !== null) {
      newField.defaultValue = defaultValue;
    }
  }

  // mediaUploader の場合は追加設定
  if (basicAnswers.fieldType === "mediaUploader") {
    const mediaOptions = await promptMediaUploaderOptions();
    newField.uploadPath = mediaOptions.uploadPath;
    newField.accept = mediaOptions.accept;
  }

  // 説明の入力（オプション）
  const { description } = await inquirer.prompt([
    {
      type: "input",
      name: "description",
      message: "説明（任意）:",
    },
  ]);
  if (description) {
    newField.description = description;
  }

  // 確認
  console.log("\n\x1b[36m追加するフィールド:\x1b[0m");
  console.log(JSON.stringify(newField, null, 2));

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "このフィールドを追加しますか？",
      default: true,
    },
  ]);

  if (!confirm) {
    console.log("キャンセルしました");
    return;
  }

  // 設定に追加
  config.fields.push(newField);

  // 設定ファイルに書き込み
  writeSettingFields(config);
  console.log(`\n\x1b[32m✓ フィールド "${newField.name}" を追加しました\x1b[0m`);

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

  console.log("\n\x1b[32m✓ 完了！\x1b[0m");
}

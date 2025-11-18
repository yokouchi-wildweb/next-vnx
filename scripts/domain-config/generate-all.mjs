#!/usr/bin/env node
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import generate from "./generate.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.resolve(__dirname, "..", "..");
const featuresDir = path.join(rootDir, "src", "features");
const prompt = inquirer.createPromptModule();

function findDomainDirectories() {
  const dirents = fs.readdirSync(featuresDir, { withFileTypes: true });
  return dirents
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((name) => fs.existsSync(path.join(featuresDir, name, "domain.json")))
    .sort();
}

export default async function generateAllDomains() {
  const domains = findDomainDirectories();
  if (domains.length === 0) {
    console.log("domain.json を含むドメインが存在しません。");
    return;
  }

  console.log(`合計 ${domains.length} 件のドメインに対してファイル生成を実行します。`);
  console.log("生成対象ドメイン:");
  domains.forEach((domain) => {
    console.log(`  - ${domain}`);
  });

  const { confirmGenerateAll } = await prompt({
    type: "confirm",
    name: "confirmGenerateAll",
    message: "すべてのドメインの生成を実行しますか？既存ファイルは上書きされます。",
    default: false,
  });

  if (!confirmGenerateAll) {
    console.log("一括生成をキャンセルしました。");
    return;
  }

  for (const domain of domains) {
    console.log(`\n[${domain}] の生成を開始します。`);
    await generate(domain, {
      mode: "config",
      interactive: false,
      shouldGenerate: true,
    });
  }

  console.log("\nすべてのドメインのファイル生成が完了しました。");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    await generateAllDomains();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

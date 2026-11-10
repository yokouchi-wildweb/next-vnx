// scripts/deploy.ts
//
// 統合デプロイ (pnpm deploy:all)。手動デプロイ運用の標準コマンド。
// アプリ (Vercel) とルームサーバー (Cloudflare Workers) を 1 コマンドで揃えてデプロイする。
//
// 事前検査: pnpm cron:check（vercel.json の crons が src/app/api/cron/*/task.ts と食い違えば何もデプロイせず止まる）
//
// 順序: Worker → アプリ。
//   アプリ側はプロトコル不一致を明示エラーにするため (ROOM_PROTOCOL_VERSION)、
//   先に Worker を最新化してからアプリを出すことでスキュー窓を最小にする。
//
// 冪等分岐 (room 部分は scripts/room/deploy.ts と同一):
//   - realtime-room.config enabled=false → Worker は skip してアプリのみデプロイ
//     (使わないフォークでもこのコマンド 1 つで従来通り運用できる)
//   - enabled=true で未初期化 → 明示エラー (アプリのデプロイにも進まない)
//
// 引数はそのまま vercel CLI へ渡す。無指定なら --prod。
//   pnpm deploy:all                        # vercel --prod
//   pnpm deploy:all -- --target=preview    # プレビューデプロイ等、任意の vercel 引数
// ※ vercel CLI に --preview フラグは存在しない。素のデプロイ (=プレビュー) は本コマンドでは
//    --prod フォールバックに塞がれているため、プレビューは --target=preview を明示すること
// 本番(アプリが --prod、またはルームの Worker を出す)ならセーフポイントの上でだけ出す
// (違えば何もデプロイせず止める。--allow-unsafe=<理由> で通す。scripts/operations/deploy/lib.ts)

import { execFileSync, execSync, spawnSync } from "node:child_process";
import path from "node:path";

import { REALTIME_ROOM_CONFIG } from "../src/config/app/realtime-room.config";
import { allowUnsafeArgs, guardSafePoint, takeAllowUnsafe } from "./operations/deploy/lib";

const repoRoot = path.resolve(import.meta.dirname, "..");

console.log("=== deploy:all (room → app) ===\n");

// --- 事前検査: セーフポイント(本番に出すときだけ。何かを打つ前に止める) ---
const allowUnsafe = takeAllowUnsafe();
const vercelArgs = process.argv.slice(2);
const args = vercelArgs.length > 0 ? vercelArgs : ["--prod"];
const productionApp = args.includes("--prod") || args.includes("--target=production");
guardSafePoint(productionApp || REALTIME_ROOM_CONFIG.enabled, allowUnsafe);

// --- 0. 事前検査: cron の配線（vercel.json の crons が全タスクの生成結果と一致するか） ---
// 配線漏れのまま本番に出すと prune 系が動かずテーブルが無制限に増えるため、デプロイ前に止める
try {
  execSync("pnpm cron:check", { cwd: repoRoot, stdio: "inherit" });
} catch {
  console.error("\n✗ cron の配線に問題があるため、デプロイを中止します（src/lib/cron/README.md 参照）");
  process.exit(1);
}

// --- 1. Worker (servers/room) ---
// skip (enabled=false) は exit 0 で返るため、そのままアプリへ進む
try {
  // 確かめは済んだので、子の pnpm room:deploy には同じ --allow-unsafe=<理由> を渡す
  execFileSync("pnpm", ["room:deploy", ...allowUnsafeArgs(allowUnsafe)], { cwd: repoRoot, stdio: "inherit" });
} catch {
  console.error("\n✗ ルームサーバーのデプロイに失敗したため、アプリのデプロイを中止します");
  process.exit(1);
}

// --- 2. アプリ (Vercel) ---
const versionCheck = spawnSync("vercel", ["--version"], { shell: false });
if (versionCheck.error || versionCheck.status !== 0) {
  console.error(`
✗ vercel CLI が見つかりません。インストールしてください:
    npm i -g vercel
  初回はプロジェクトのリンクが必要です:
    vercel link
`);
  process.exit(1);
}

console.log(`\n→ vercel ${args.join(" ")} を実行します...\n`);
const result = spawnSync("vercel", args, { cwd: repoRoot, stdio: "inherit", shell: false });
if (result.status !== 0) {
  console.error("\n✗ アプリのデプロイに失敗しました");
  process.exit(result.status ?? 1);
}

console.log("\n✓ デプロイ完了 (room + app)");

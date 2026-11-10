// scripts/operations/deploy/lib.ts
// 本番のデプロイのセーフポイントの止め(上流 ship-safe-points の緊急修正を先取りした部分だけ)。
// この fork のデプロイ入口は scripts/deploy.ts(pnpm deploy:all)と scripts/room/deploy.ts(pnpm room:deploy)で、
// 上流の scripts/operations/deploy/ の残り(app.ts・all.ts・room.ts・lib の他の関数)は後の区間の merge で届く。
// 本番に出す時は、台帳の最後の upstream:<sha> が直接の親の safe tag ちょうどでなければ止める
// (仕様 = 上流の .notices/README.md「区切り(checkpoint)と区間適用」のセーフポイント)。--allow-unsafe=<理由> で通す。

import path from "node:path";

import { deployVerdict } from "../../workflow/notices/safePoint.mjs";

export const repoRoot = path.resolve(import.meta.dirname, "../../..");

/** --allow-unsafe=<理由> を引数から外す。旗だけ・理由が空は error */
export function parseAllowUnsafe(args: readonly string[]): { reason: string | null; rest: string[]; error: string | null } {
  let reason: string | null = null;
  let error: string | null = null;
  const rest: string[] = [];
  for (const arg of args) {
    if (arg !== "--allow-unsafe" && !arg.startsWith("--allow-unsafe=")) {
      rest.push(arg);
      continue;
    }
    const value = arg.startsWith("--allow-unsafe=") ? arg.slice("--allow-unsafe=".length).trim() : "";
    if (value === "") error = "--allow-unsafe=<理由> の理由が空です(何もしていません)";
    else reason = value;
  }
  return { reason: error ? null : reason, rest, error };
}

/** process.argv から --allow-unsafe=<理由> を外して理由を返す(vercel・wrangler には渡さない)。理由が空なら exit 1 */
export function takeAllowUnsafe(): string | null {
  const { reason, rest, error } = parseAllowUnsafe(process.argv.slice(2));
  if (error) {
    console.error("✗ " + error);
    process.exit(1);
  }
  process.argv.splice(2, process.argv.length - 2, ...rest);
  return reason;
}

type SafePointVerdict = { ok: boolean; line: string; message: string };

/**
 * 本番に出す時だけ、セーフポイントの上かを確かめる(fork = 台帳の最後の upstream:<sha> が直接の親の safe tag ちょうど、
 * Tier1 = HEAD が自分の safe tag ちょうど)。違えば止める(exit 1)。allowUnsafe(理由)があれば警告と理由を出して通す。プレビューは見ない
 */
export function guardSafePoint(
  production: boolean,
  allowUnsafe: string | null,
  deps: { verdict?: () => SafePointVerdict; log?: (s: string) => void; error?: (s: string) => void; exit?: (code: number) => never } = {},
): void {
  if (!production) return;
  const verdict = deps.verdict ?? (() => deployVerdict(repoRoot) as SafePointVerdict);
  const log = deps.log ?? ((s: string) => console.log(s));
  const error = deps.error ?? ((s: string) => console.error(s));
  const exit = deps.exit ?? ((code: number): never => process.exit(code));
  const { ok, message } = verdict();
  if (ok) {
    log(`✓ ${message}`);
    return;
  }
  if (allowUnsafe) {
    error(`⚠ セーフポイントの外で本番に出します(--allow-unsafe): ${allowUnsafe}`);
    error(`  ${message}`);
    return;
  }
  error(`✗ ${message}`);
  exit(1);
}

/** 子の pnpm room:deploy に同じ理由を渡す引数 */
export const allowUnsafeArgs = (reason: string | null): string[] => (reason ? [`--allow-unsafe=${reason}`] : []);

// scripts/db/seed.ts

import { config } from "dotenv";

// .env.development を読み込む（import文より先に実行）
config({ path: ".env.development" });

async function main() {
  console.log("🌱 データベースの初期データを投入中...");
  console.log("");

  // 環境変数読み込み後に動的import
  const { seedDemoUser } = await import("./seeds");

  await seedDemoUser();

  console.log("");
  console.log("✅ 初期データの投入が完了しました");
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ 初期データの投入に失敗しました:", error);
  process.exit(1);
});

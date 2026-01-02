import type { ReactNode } from "react";

// プレイ専用レイアウト（フルスクリーン向け、最小限のUI）
// TODO: プレイ画面専用の軽量レイアウトを実装

export default function PlayLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}

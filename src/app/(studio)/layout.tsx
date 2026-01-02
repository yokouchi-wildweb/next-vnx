import type { ReactNode } from "react";

// スタジオ用レイアウト（シナリオ作成・管理、作者向け）
// TODO: サイドバー、ツールバーなどスタジオ専用UIを追加

export default function StudioLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}

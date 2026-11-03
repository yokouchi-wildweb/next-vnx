// src/app/lab/layout.tsx
//
// 方針(管理者カテゴリ + debugger、それ以外は 404)は隣の guard.ts。枠は持たない。

import type { ReactNode } from "react";

import { guard } from "./guard";

export default async function LabLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  await guard();

  return <>{children}</>;
}

// src/app/admin/(protected)/saves/new/_screen/AdminSaveCreateScreen.tsx
// このファイルは dc:generate が生成する(再生成で上書きされるため手で編集しない)。
// 画面を変えるときは _components/ にコピーして page.tsx の import 先を向ける。

import type { ScreenProps } from "@/lib/screens/types";
import { SWRConfig } from "swr";
import AdminSaveCreate from "@/features/save/components/AdminSaveCreate";
import AdminPage from "@/app/admin/_layout/AdminPage";
import PageTitle from "@/app/admin/_layout/PageTitle";

import { loadAdminSaveCreateScreen } from "./loader";

export const metadata = {
  title: "セーブデータ追加",
};

export async function AdminSaveCreateScreen(props: ScreenProps) {
  const { relationFallback } = await loadAdminSaveCreateScreen(props);
  return (
  <SWRConfig value={{ fallback: relationFallback }}>
    <AdminPage>
      <PageTitle placement="header">セーブデータ追加</PageTitle>
      <AdminSaveCreate redirectPath="/admin/saves" />
    </AdminPage>
  </SWRConfig>
  );
}

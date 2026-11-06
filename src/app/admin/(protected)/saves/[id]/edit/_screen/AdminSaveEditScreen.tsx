// src/app/admin/(protected)/saves/[id]/edit/_screen/AdminSaveEditScreen.tsx
// このファイルは dc:generate が生成する(再生成で上書きされるため手で編集しない)。
// 画面を変えるときは _components/ にコピーして page.tsx の import 先を向ける。

import type { AdminEditScreenParams, AdminEditScreenSearchParams } from "@/features/core/admin/services/server/screenData/adminEdit";
import type { ScreenProps } from "@/lib/screens/types";
import { SWRConfig } from "swr";
import AdminSaveEdit from "@/features/save/components/AdminSaveEdit";
import AdminPage from "@/app/admin/_layout/AdminPage";
import PageTitle from "@/app/admin/_layout/PageTitle";

import { loadAdminSaveEditScreen } from "./loader";

export const metadata = {
  title: "セーブデータ編集",
};

export async function AdminSaveEditScreen(props: ScreenProps<AdminEditScreenParams, AdminEditScreenSearchParams>) {
  const { record: save, redirectPath, relationFallback } = await loadAdminSaveEditScreen(props);
  return (
  <SWRConfig value={{ fallback: relationFallback }}>
    <AdminPage>
      <PageTitle placement="header">セーブデータ編集</PageTitle>
      <AdminSaveEdit save={save} redirectPath={redirectPath} />
    </AdminPage>
  </SWRConfig>
  );
}

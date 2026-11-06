// src/app/admin/(protected)/saves/_screen/AdminSaveListScreen.tsx
// このファイルは dc:generate が生成する(再生成で上書きされるため手で編集しない)。
// 画面を変えるときは _components/ にコピーして page.tsx の import 先を向ける。

import type { ListPageSearchParams } from "@/lib/crud";
import type { ScreenProps } from "@/lib/screens/types";
import AdminSaveList from "@/features/save/components/AdminSaveList";
import AdminPage from "@/app/admin/_layout/AdminPage";
import PageTitle from "@/app/admin/_layout/PageTitle";

import { loadAdminSaveListScreen } from "./loader";

export const metadata = {
  title: "セーブデータ一覧",
};

export async function AdminSaveListScreen(props: ScreenProps<Record<string, never>, ListPageSearchParams>) {
  const { results: saves, page, limit, total } = await loadAdminSaveListScreen(props);

  return (
    <AdminPage>
      <PageTitle placement="header">セーブデータ管理</PageTitle>
      <AdminSaveList saves={saves} page={page} perPage={limit} total={total} />
    </AdminPage>
  );
}

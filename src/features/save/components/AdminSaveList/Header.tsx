// src/features/save/components/AdminSaveList/Header.tsx

"use client";

import Link from "next/link";
import ListTop from "@/components/AppFrames/Admin/Elements/ListTop";
import { Pagination } from "@/components/Navigation";
import SearchBox from "@/components/AppFrames/Admin/Elements/SearchBox";
import { DataMigrationButton } from "@/lib/dataMigration";
import { Button } from "@/components/Form/Button/Button";
import { useSearchParams } from "next/navigation";
import { CreateButton } from "@/lib/crud/components";
import { getAdminPaths } from "@/lib/crud/utils";
import { domainDisplay as saveDisplay } from "@/features/save/entities/display";

const paths = getAdminPaths("saves");
const hasSearch = saveDisplay.searchFields.length > 0;

export type AdminSaveListHeaderProps = {
  page: number;
  perPage: number;
  total: number;
};

export default function AdminSaveListHeader({ page, perPage, total }: AdminSaveListHeaderProps) {
  const params = useSearchParams();

  return (
    <ListTop title="登録済みセーブデータの一覧">
      {hasSearch && <SearchBox makeHref={(p) => `${paths.list}?${p.toString()}`} />}
      {saveDisplay.useImportExport === true && (
        <DataMigrationButton domain={saveDisplay} searchParams={params.toString()} />
      )}
      <Pagination
        page={page}
        perPage={perPage}
        total={total}
        makeHref={(p) => {
          const search = new URLSearchParams(params.toString());
          search.set("page", String(p));
          return `${paths.list}?${search.toString()}`;
        }}
      />
      {Boolean(saveDisplay.sortOrderField) && (
        <Button variant="outline" asChild>
          <Link href={`${paths.list}/sort`}>並び替え</Link>
        </Button>
      )}
      <CreateButton domain={saveDisplay} />
    </ListTop>
  );
}

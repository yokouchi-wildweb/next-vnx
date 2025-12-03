// src/features/user/components/admin/GeneralUserList/Table.tsx

"use client";

import { useCallback, useMemo, useState } from "react";

import DataTable, {
  TableCellAction,
  type DataTableColumn,
} from "@/lib/tableSuite/DataTable";
import DeleteButton from "@/components/Fanctional/DeleteButton";
import EditButton from "@/components/Fanctional/EditButton";
import { Button } from "@/components/Form/Button/Button";
import { useDeleteUser } from "@/features/core/user/hooks/useDeleteUser";
import type { User } from "@/features/core/user/entities";
import { formatDateJa } from "@/utils/date";
import { UI_BEHAVIOR_CONFIG } from "@/config/ui-behavior-config";
import { formatUserStatusLabel } from "@/features/core/user/constants/status";
import AdminWalletAdjustModal from "@/features/core/wallet/components/AdminWalletAdjustModal";

type Props = {
  users: User[];
  editBasePath: string;
};

const [{ adminDataTable }] = UI_BEHAVIOR_CONFIG;
const adminDataTableFallback = adminDataTable?.emptyFieldFallback ?? "(未設定)";

const formatDateCell = (date: Date | string | null | undefined) => {
  const formatted = formatDateJa(date, { fallback: null });
  return formatted;
};

const createColumns = (
  editBasePath: string,
  onAdjust: (user: User) => void,
): DataTableColumn<User>[] => [
  {
    header: "ステータス",
    render: (user) => formatUserStatusLabel(user.status, user.status),
  },
  {
    header: "表示名",
    render: (user) => user.displayName ?? adminDataTableFallback,
  },
  {
    header: "認証方法",
    render: (user) => user.providerType ?? "-",
  },
  {
    header: "メールアドレス",
    render: (user) => user.email ?? adminDataTableFallback,
  },
  {
    header: "登録日",
    render: (user) => formatDateCell(user.createdAt),
  },
  {
    header: "操作",
    render: (user) => (
      <TableCellAction>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => onAdjust(user)}
        >
          ポイント操作
        </Button>
        <EditButton href={`${editBasePath}/${user.id}/edit`} />
        <DeleteButton id={user.id} useDelete={useDeleteUser} title="ユーザー削除" />
      </TableCellAction>
    ),
  },
];

export default function GeneralUserListTable({ users, editBasePath }: Props) {
  const [adjustTarget, setAdjustTarget] = useState<User | null>(null);

  const handleOpenAdjust = useCallback((user: User) => {
    setAdjustTarget(user);
  }, []);

  const handleCloseAdjust = useCallback(() => {
    setAdjustTarget(null);
  }, []);

  const columns = useMemo(() => createColumns(editBasePath, handleOpenAdjust), [editBasePath, handleOpenAdjust]);

  return (
    <>
      <DataTable
        items={users}
        columns={columns}
        getKey={(user) => user.id}
        emptyValueFallback={adminDataTableFallback}
      />
      <AdminWalletAdjustModal open={Boolean(adjustTarget)} user={adjustTarget} onClose={handleCloseAdjust} />
    </>
  );
}

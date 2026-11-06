// src/features/save/components/AdminSaveList/Table.tsx

"use client";

import type { Save } from "@/features/save/entities";
import { DataTable, TableCellAction, type DataTableColumn } from "@/lib/tableSuite";
import { EditButton, DeleteButton } from "@/lib/crud/components";
import presenters from "@/features/save/presenters";
import { buildDomainColumns } from "@/lib/crud";
import { UI_BEHAVIOR_CONFIG } from "@/config/ui/ui-behavior-config";
import { domainDisplay as saveDisplay } from "@/features/save/entities/display";

export type AdminSaveListTableProps = {
  /**
   * Records to display. Optional so the component can render before data loads
   * without throwing errors.
   */
  saves?: Save[];
};

const [{ adminDataTable }] = UI_BEHAVIOR_CONFIG;
const adminDataTableFallback = adminDataTable?.emptyFieldFallback ?? "(未設定)";

const columns: DataTableColumn<Save>[] = buildDomainColumns<Save>({
  config: saveDisplay,
  presenters,
  actionColumn: {
    header: "操作",
    render: (d: Save) => (
      <TableCellAction>
        <EditButton domain={saveDisplay} id={d.id} />
        <DeleteButton domain={saveDisplay} id={d.id} />
      </TableCellAction>
    ),
  },
});

export default function AdminSaveListTable({ saves }: AdminSaveListTableProps) {
  return <DataTable
    items={saves ?? []}
    columns={columns}
    getKey={(d) => d.id}
    emptyValueFallback={adminDataTableFallback}
  />;
}

// src/features/save/components/AdminSaveList/index.tsx

import type { Save } from "@/features/save/entities";
import Header from "./Header";
import Table from "./Table";
import { Section } from "@/components/Layout/Section";

export type AdminSaveListProps = {
  saves: Save[];
  page: number;
  perPage: number;
  total: number;
};

export default function AdminSaveList({
  saves,
  page,
  perPage,
  total,
}: AdminSaveListProps) {
  return (
    <Section>
      <Header page={page} perPage={perPage} total={total} />
      <Table saves={saves} />
    </Section>
  );
}

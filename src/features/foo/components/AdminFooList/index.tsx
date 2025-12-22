// src/features/foo/components/AdminFooList/index.tsx

import type { Foo } from "@/features/foo/entities";
import Header from "./Header";
import Table from "./Table";
import { Section } from "@/components/Layout/Section";

export type AdminFooListProps = {
  foo: Foo[];
  page: number;
  perPage: number;
  total: number;
};

export default function AdminFooList({
  foo,
  page,
  perPage,
  total,
}: AdminFooListProps) {
  return (
    <Section>
      <Header page={page} perPage={perPage} total={total} />
      <Table foo={foo} />
    </Section>
  );
}

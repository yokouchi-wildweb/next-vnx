import type { ReactNode } from "react";

import AdminPage from "@/components/AppFrames/Admin/Layout/AdminPage";
import PageTitle from "@/components/AppFrames/Admin/Elements/PageTitle";
import { PageTabs } from "@/components/Navigation/PageTabs";
import { Block } from "@/components/Layout/Block";
import { Section } from "@/components/Layout/Section";
import { SecTitle } from "@/components/TextBlocks/SecTitle";
import { Para } from "@/components/TextBlocks/Para";

import { ADMIN_TABS_DEMO_ITEMS } from "../../constants/adminTabsDemoItems";

type AdminTabsDemoProps = {
  pageTitle: string;
  sectionTitle: string;
  description: string;
  children: ReactNode;
};

export function AdminTabsDemo({ pageTitle, sectionTitle, description, children }: AdminTabsDemoProps) {
  return (
    <AdminPage>
      <PageTitle>{pageTitle}</PageTitle>
      <Section space="md">
        <SecTitle>{sectionTitle}</SecTitle>
        <Para tone="muted">{description}</Para>
        <PageTabs tabs={ADMIN_TABS_DEMO_ITEMS} ariaLabel="タブUIデモ" />
        <Block appearance="surface" padding="lg" space="sm">
          {children}
        </Block>
      </Section>
    </AdminPage>
  );
}

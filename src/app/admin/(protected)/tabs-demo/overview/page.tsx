import { ActivityIcon, LayoutDashboardIcon, Settings2Icon } from "lucide-react";

import AdminPage from "@/components/AppFrames/Admin/Layout/AdminPage";
import PageTitle from "@/components/AppFrames/Admin/Elements/PageTitle";
import { Block } from "@/components/Layout/Block";
import { Section } from "@/components/Layout/Section";
import { PageTabs, type PageTabItem } from "@/components/Navigation/PageTabs";
import { SecTitle } from "@/components/TextBlocks/SecTitle";
import { Para } from "@/components/TextBlocks/Para";

export const metadata = {
  title: "タブUIデモ - 概要",
};

const ADMIN_TABS_DEMO_ITEMS: PageTabItem[] = [
  {
    value: "overview",
    label: "タブデモ/概要",
    href: "/admin/tabs-demo/overview",
    icon: <LayoutDashboardIcon className="size-4" aria-hidden />,
  },
  {
    value: "insights",
    label: "タブデモ/インサイト",
    href: "/admin/tabs-demo/insights",
    icon: <ActivityIcon className="size-4" aria-hidden />,
  },
  {
    value: "actions",
    label: "タブデモ/アクション",
    href: "/admin/tabs-demo/actions",
    icon: <Settings2Icon className="size-4" aria-hidden />,
  },
];

export default function AdminTabsDemoOverviewPage() {
  return (
    <AdminPage>
      <PageTitle>タブUIデモ</PageTitle>
      <Section space="md">
        <SecTitle>タブ切り替えデモ（概要）</SecTitle>
        <Para tone="muted">
          ナビゲーション専用のタブ部品を導入し、URL 遷移とタブUIを一貫して扱うためのデモページです。
        </Para>
        <PageTabs tabs={ADMIN_TABS_DEMO_ITEMS} ariaLabel="タブUIデモ" />
        <Block appearance="surface" padding="lg" space="sm">
          <Para>
            このページではタブUIの概要を紹介しています。同じタブセットを各ページに設置しており、クリックと同時に対応するルートへ遷移します。
          </Para>
          <Para>
            体験としてはタブが切り替わっているように見えますが、実際には Next.js のルーティングが走ります。ルーティングに伴う状態管理や検証は各ページ側で責務を持ちます。
          </Para>
        </Block>
      </Section>
    </AdminPage>
  );
}

import { ActivityIcon, LayoutDashboardIcon, Settings2Icon } from "lucide-react";

import AdminPage from "@/components/AppFrames/Admin/Layout/AdminPage";
import PageTitle from "@/components/AppFrames/Admin/Elements/PageTitle";
import { Block } from "@/components/Layout/Block";
import { Section } from "@/components/Layout/Section";
import { PageTabs, type PageTabItem } from "@/components/Navigation/PageTabs";
import { SecTitle } from "@/components/TextBlocks/SecTitle";
import { Para } from "@/components/TextBlocks/Para";

export const metadata = {
  title: "タブUIデモ - インサイト",
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

export default function AdminTabsDemoInsightsPage() {
  return (
    <AdminPage>
      <PageTitle>タブUIデモ</PageTitle>
      <Section space="md">
        <SecTitle>タブ切り替えデモ（インサイト）</SecTitle>
        <Para tone="muted">
          タブを用いた複数ページ遷移の中で、インサイト表示や分析ビューのようなコンテンツを想定したレイアウト例です。
        </Para>
        <PageTabs tabs={ADMIN_TABS_DEMO_ITEMS} ariaLabel="タブUIデモ" />
        <Block appearance="surface" padding="lg" space="sm">
          <Para>
            ここではダッシュボードやメトリクスの概要など、メイン領域で集約したい情報を掲示するケースを想定しています。タブを切り替えることでページごとに関心の異なる利用者に対応できます。
          </Para>
          <Para>
            データ取得やチャート描画などの実装は各ページに委譲されているため、タブ自体はレイアウトやアクセシビリティを統一する役割だけに集中しています。
          </Para>
        </Block>
      </Section>
    </AdminPage>
  );
}

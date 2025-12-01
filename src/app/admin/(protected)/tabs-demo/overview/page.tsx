import { Para } from "@/components/TextBlocks/Para";

import { AdminTabsDemo } from "@/features/uiDemo/components/AdminTabsDemo";

export const metadata = {
  title: "タブUIデモ - 概要",
};

export default function AdminTabsDemoOverviewPage() {
  return (
    <AdminTabsDemo
      pageTitle="タブUIデモ"
      sectionTitle="タブ切り替えデモ（概要）"
      description="ナビゲーション専用のタブ部品を導入し、URL 遷移とタブUIを一貫して扱うためのデモページです。"
    >
      <Para>
        このページではタブUIの概要を紹介しています。同じタブセットを各ページに設置しており、クリックと同時に対応するルートへ遷移します。
      </Para>
      <Para>
        体験としてはタブが切り替わっているように見えますが、実際には Next.js のルーティングが走ります。ルーティングに伴う状態管理や検証は各ページ側で責務を持ちます。
      </Para>
    </AdminTabsDemo>
  );
}

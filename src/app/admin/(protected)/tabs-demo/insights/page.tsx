import { Para } from "@/components/TextBlocks/Para";

import { AdminTabsDemo } from "@/features/uiDemo/components/AdminTabsDemo";

export const metadata = {
  title: "タブUIデモ - インサイト",
};

export default function AdminTabsDemoInsightsPage() {
  return (
    <AdminTabsDemo
      pageTitle="タブUIデモ"
      sectionTitle="タブ切り替えデモ（インサイト）"
      description="タブを用いた複数ページ遷移の中で、インサイト表示や分析ビューのようなコンテンツを想定したレイアウト例です。"
    >
      <Para>
        ここではダッシュボードやメトリクスの概要など、メイン領域で集約したい情報を掲示するケースを想定しています。タブを切り替えることでページごとに関心の異なる利用者に対応できます。
      </Para>
      <Para>
        データ取得やチャート描画などの実装は各ページに委譲されているため、タブ自体はレイアウトやアクセシビリティを統一する役割だけに集中しています。
      </Para>
    </AdminTabsDemo>
  );
}

import { Para } from "@/components/TextBlocks/Para";

import { AdminTabsDemo } from "@/features/uiDemo/components/AdminTabsDemo";

export const metadata = {
  title: "タブUIデモ - アクション",
};

export default function AdminTabsDemoActionsPage() {
  return (
    <AdminTabsDemo
      pageTitle="タブUIデモ"
      sectionTitle="タブ切り替えデモ（アクション）"
      description="フォーム送信や個別オペレーションを想定したページの例です。タブの切り替え位置は共通化し、ページ毎の操作を明確に分離します。"
    >
      <Para>
        実際には複雑なフォームやテーブル操作を配置できますが、タブコンポーネント自体はナビゲーションだけに集中させています。ページ側で状態管理や離脱ガードを持つことで責務を分離できます。
      </Para>
      <Para>
        既存画面に導入する際もこのパターンを踏襲すれば、UI の統一感を保ちながら機能追加できます。
      </Para>
    </AdminTabsDemo>
  );
}

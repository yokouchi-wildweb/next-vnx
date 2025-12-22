import { UserPageTitle } from "@/components/AppFrames/User/Elements/PageTitle";
import { UserPage } from "@/components/AppFrames/User/Layout/UserPage";
import { Section } from "@/components/Layout/Section";
import { Para, SecTitle } from "@/components/TextBlocks";
import Link from "next/link";

// TODO: 各プロジェクトで適切な値に変更してください
const COMPANY_NAME = "株式会社サンプル";
const REPRESENTATIVE_NAME = "代表 太郎";
const POSTAL_CODE = "〒000-0000";
const ADDRESS = "東京都○○区○○1-2-3";
const PHONE_NUMBER = "03-0000-0000";
const EMAIL = "support@example.com";
const PAYMENT_METHODS = "クレジット決済、銀行振込、コンビニ払い";
// 古物商許可が必要な場合のみ設定（不要な場合は空文字）
const ANTIQUE_LICENSE = ""; // 例: "東京都公安委員会 第000000000000号"

export default function TradelawPage() {
  return (
    <UserPage containerType="narrowStack" space="md">
      <UserPageTitle>特定商取引法に基づく表示</UserPageTitle>

      {/* 1. 商品の販売価格・サービスの対価 */}
      <Section id="price" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          1. 商品の販売価格・サービスの対価
        </SecTitle>
        <Para>各商品のご購入ページにて表示する価格</Para>
        <Para tone="muted" size="sm">
          ※特別な販売条件または提供条件がある商品またはサービスについては、各商品またはサービスの購入ページにおいて条件を表示します。
        </Para>
      </Section>

      {/* 2. 対価以外に必要となる費用 */}
      <Section id="additional-cost" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          2. 上記対価以外に必要となる費用
        </SecTitle>
        <Para>
          インターネット接続料金その他の電気通信回線の通信に関する費用はお客様にて別途ご用意いただく必要があります（金額は、お客様が契約した各事業者が定める通り）。
        </Para>
      </Section>

      {/* 3. 支払方法 */}
      <Section id="payment-method" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          3. 支払方法
        </SecTitle>
        <Para>{PAYMENT_METHODS}</Para>
      </Section>

      {/* 4. 代金の支払時期 */}
      <Section id="payment-timing" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          4. 代金の支払時期
        </SecTitle>
        <Para>
          上記の支払方法を提供する決済会社の定めや、ご利用のクレジットカードの締め日や契約内容により異なります。決済会社や、ご利用されるカード会社までお問い合わせください。
        </Para>
      </Section>

      {/* 5. 商品引渡しまたはサービス提供の時期 */}
      <Section id="delivery-timing" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          5. 商品引渡しまたはサービス提供の時期
        </SecTitle>
        <Para>
          デジタルコンテンツについては、決済後ただちに提供します。
        </Para>
        <Para>
          配送を伴う商品については、原則として10日以内に発送いたします。
        </Para>
        <Para tone="muted" size="sm">
          ※商品により異なる場合は、各商品ページに記載します。
        </Para>
      </Section>

      {/* 6. 送料 */}
      <Section id="shipping" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          6. 送料
        </SecTitle>
        <Para>
          配送を伴う商品の送料は、原則として無料です。別途送料が発生する場合には、各商品のご購入ページにて表示します。
        </Para>
      </Section>

      {/* 7. 返品・キャンセルに関する特約 */}
      <Section id="return-policy" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          7. 返品・キャンセルに関する特約
        </SecTitle>
        <Para>
          デジタルコンテンツの性質上、購入後の返品・キャンセル・払い戻しはお受けいたしかねます。
        </Para>
        <Para>
          配送を伴う商品については、発送手続完了後の返品やキャンセルはお受けいたしかねます。
        </Para>
        <Para>
          商品の品違い、汚損や破損がある場合は、当社に故意又は重過失がある場合にのみ、返金または交換等の対応をいたします。
        </Para>
        <Para tone="muted" size="sm">
          ※詳細は
          <Link href="/terms" className="underline hover:text-primary">
            利用規約
          </Link>
          に定めるものとします。
        </Para>
      </Section>

      {/* 8. 販売数量の制限 */}
      <Section id="quantity-limit" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          8. 販売数量の制限
        </SecTitle>
        <Para>
          各商品の販売数量に制限が設けられている場合、個別のご購入ページに表示します。
        </Para>
      </Section>

      {/* 9. 古物商許可（該当する場合のみ表示） */}
      {ANTIQUE_LICENSE && (
        <Section id="antique-license" space="sm" marginBlock="lg">
          <SecTitle as="h2" size="lg">
            9. 古物商許可
          </SecTitle>
          <Para>{ANTIQUE_LICENSE}</Para>
        </Section>
      )}

      {/* 10. 事業者の名称・住所・連絡先 */}
      <Section id="business-info" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          {ANTIQUE_LICENSE ? "10" : "9"}. 事業者の名称・住所・連絡先
        </SecTitle>
        <Para>{POSTAL_CODE}</Para>
        <Para>{ADDRESS}</Para>
        <Para>{COMPANY_NAME}</Para>
        <Para>{REPRESENTATIVE_NAME}</Para>
        <Para>電話番号：{PHONE_NUMBER}</Para>
        <Para>メールアドレス：{EMAIL}</Para>
      </Section>
    </UserPage>
  );
}

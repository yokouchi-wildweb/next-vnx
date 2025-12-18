import { UserPageTitle } from "@/components/AppFrames/User/Elements/PageTitle";
import { UserPage } from "@/components/AppFrames/User/Layout/UserPage";
import { Section } from "@/components/Layout/Section";
import { Para, SecTitle, Span } from "@/components/TextBlocks";

// TODO: 各プロジェクトで適切な値に変更してください
const SERVICE_NAME = "本サービス";
const SUPPORT_EMAIL = "support@example.com";
const ENACTED_AT = "20XX年X月X日";
const LAST_UPDATED_AT = "20XX年X月X日";

const dataCategories = [
  {
    title: "アカウント情報",
    description: "氏名、ニックネーム、メールアドレス、認証に必要な識別子など、ユーザー登録や本人確認に必要な情報。",
  },
  {
    title: "決済・取引情報",
    description:
      "購入履歴、支払い方法に関する識別子、チャージ明細、返金や不正検知に必要な履歴など。",
  },
  {
    title: "利用環境情報",
    description:
      "アクセス日時、IPアドレス、端末情報、ブラウザの種類、Cookieや広告識別子などの技術情報。",
  },
  {
    title: "ユーザー生成コンテンツ",
    description: "レビュー、プロフィール画像、投稿内容など、ユーザーがサービス上にアップロードするデータ。",
  },
  {
    title: "お問い合わせ情報",
    description: "お問い合わせ時にいただく氏名、連絡先、内容、添付ファイル、サポート対応履歴など。",
  },
] as const;

const usagePurposes = [
  "本サービスの提供、本人確認、決済処理など、基本機能を安定して提供するため",
  "不正利用の監視・検知、セキュリティインシデントへの対応を行うため",
  "機能改善や新機能の企画、ユーザーサポート品質の向上を図るため",
  "キャンペーン、アンケート、マーケティング連絡などの各種告知を適切に実施するため（ユーザーの同意・設定に基づきます）",
  "法令・ガイドラインに基づく義務を履行し、権利を保護するため",
] as const;

const sharingCases = [
  "法令に基づく場合、または警察・裁判所などの公的機関から適法に開示要請を受けた場合",
  "決済代行、配送、カスタマーサポートなどを委託する業務委託先に、業務遂行に必要な範囲で提供する場合",
  "統計的に処理したデータなど、個人を特定できない形式に加工したうえで共有する場合",
  "事業承継その他の理由によりサービス運営主体が移転する場合。この際は適切な通知や同意取得を行います。",
] as const;

const userRights = [
  "保有する個人情報の開示および利用目的の通知",
  "内容が事実と異なる場合の訂正・追加・削除",
  "利用停止・消去、第三者提供の停止",
  "同意の撤回やプロモーション配信設定の変更",
] as const;

export default function PrivacyPolicyPage() {
  return (
    <UserPage containerType="narrowStack" space="md">
      <UserPageTitle>プライバシーポリシー</UserPageTitle>
      <Para tone="muted">
        {SERVICE_NAME}（以下「本サービス」といいます）は、ユーザーの皆さまの個人情報を適切に取り扱うことが重要な責務であると認識し、本ポリシーに従って透明性のある運用に努めます。
      </Para>

      <Section id="policy-overview" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          基本方針
        </SecTitle>
        <Para>
          本サービスは関連法令、ガイドライン、業界標準に基づき、個人情報の取得・利用・保管・廃棄を適切に行います。収集した情報は目的の範囲内でのみ利用し、不要になった情報は速やかに削除または匿名化します。
        </Para>
        <Para>
          また、個人情報保護の重要性について役職員への教育を継続的に行い、社内管理体制の点検と改善を繰り返すことで、安全で信頼されるサービス提供を目指します。
        </Para>
      </Section>

      <Section id="collected-data" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          取得する情報の種類
        </SecTitle>
        <Para>本サービスが取得しうる主な情報は以下のとおりです。必要最小限の情報のみを取得し、あらかじめ明示した目的で利用します。</Para>
        {dataCategories.map(({ title, description }) => (
          <Para key={title}>
            <Span weight="semiBold">{title}</Span>
            ：{description}
          </Para>
        ))}
      </Section>

      <Section id="usage-purpose" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          情報の利用目的
        </SecTitle>
        <Para>取得した情報は、以下の目的に限り利用します。</Para>
        {usagePurposes.map((purpose) => (
          <Para key={purpose}>・{purpose}</Para>
        ))}
        <Para tone="muted" size="sm">
          上記以外の目的で利用する場合は、新たに目的を明示し、必要に応じて同意を取得します。
        </Para>
      </Section>

      <Section id="sharing" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          第三者提供・業務委託
        </SecTitle>
        <Para>本サービスは、次のいずれかに該当する場合を除き、本人の同意なく第三者へ個人情報を提供しません。</Para>
        {sharingCases.map((item) => (
          <Para key={item}>・{item}</Para>
        ))}
        <Para tone="muted" size="sm">
          業務委託先については、秘密保持契約の締結や安全管理措置の確認など適切な監督を行います。
        </Para>
      </Section>

      <Section id="cookies" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          外部サービス・クッキー等の利用
        </SecTitle>
        <Para>
          本サービスでは、アクセス解析や広告配信、決済処理などのために、第三者が提供する SDK や Cookie、類似技術を利用する場合があります。これらの技術により取得される情報は、本サービスの利用状況把握や機能改善などに活用されます。
        </Para>
        <Para>
          ブラウザ設定で Cookie を無効化することもできますが、一部機能が利用できなくなる可能性があります。外部サービスが取得する情報の内容や利用目的については、各サービス提供者のプライバシーポリシーをご確認ください。
        </Para>
      </Section>

      <Section id="retention" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          情報の管理と保管期間
        </SecTitle>
        <Para>
          取得した情報は、アクセス権限の管理、通信の暗号化、ログ監視などの安全管理措置を講じた上で保管します。万一のインシデント発生時には、影響範囲の把握とユーザーへの連絡を迅速に行います。
        </Para>
        <Para>
          法令で定める保存期間を経過するか、利用目的が達成された場合には、再生できない方法で消去または匿名化します。ただし、紛争解決や監査対応のために合理的な範囲で保管が必要な場合は、この限りではありません。
        </Para>
      </Section>

      <Section id="user-rights" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          ユーザーの権利と手続き
        </SecTitle>
        <Para>ユーザーは、保有個人データに関して以下の権利を行使できます。手続きの詳細はお問い合わせ窓口までご連絡ください。</Para>
        {userRights.map((right) => (
          <Para key={right}>・{right}</Para>
        ))}
        <Para tone="muted" size="sm">
          ご請求時には、ご本人または代理人であることを確認するため、必要な書類の提出をお願いする場合があります。また、法令に基づきご希望に添えないことがある点をあらかじめご了承ください。
        </Para>
      </Section>

      <Section id="contact" space="sm" marginBlock="lg">
        <SecTitle as="h2" size="lg">
          お問い合わせ窓口
        </SecTitle>
        <Para>
          本ポリシーや個人情報の取扱いに関するご質問・ご相談は、アプリ内の「お問い合わせ」機能、または運営事務局（{SUPPORT_EMAIL}）までご連絡ください。内容を確認のうえ、迅速な対応に努めます。
        </Para>
      </Section>

      <Section id="policy-update" space="sm">
        <SecTitle as="h2" size="lg">
          ポリシーの改定
        </SecTitle>
        <Para>
          法令の改正やサービス内容の変更に伴い、本ポリシーを改定することがあります。重要な変更がある場合は、アプリ内告知やメールなど適切な方法で事前にお知らせします。
        </Para>
        <Para tone="muted" size="sm">
          制定日：{ENACTED_AT} / 最終改定日：{LAST_UPDATED_AT}
        </Para>
      </Section>
    </UserPage>
  );
}

import { Block, Flex, Grid } from "@/components/Layout";
import { Button } from "@/components/Form/Button/Button";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "¥0",
    period: "永久無料",
    description: "個人利用・お試しに最適",
    features: [
      "シナリオ3本まで",
      "基本的な演出機能",
      "コミュニティサポート",
      "VNX ウォーターマーク表示",
    ],
    cta: "無料で始める",
    href: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "¥1,980",
    period: "/月",
    description: "本格的な創作活動に",
    features: [
      "シナリオ無制限",
      "Live2D・AIダイアログ",
      "優先サポート",
      "ウォーターマーク非表示",
      "アクセス解析",
      "カスタムドメイン",
    ],
    cta: "Proを始める",
    href: "/signup?plan=pro",
    featured: true,
  },
  {
    name: "Team",
    price: "要相談",
    period: "",
    description: "チーム・法人利用に",
    features: [
      "Proの全機能",
      "チームメンバー管理",
      "共同編集機能",
      "専用サポート",
      "SLA保証",
      "請求書払い対応",
    ],
    cta: "お問い合わせ",
    href: "/contact",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section className="py-24 bg-slate-900">
      <Block className="max-w-6xl mx-auto px-4">
        {/* セクションタイトル */}
        <Flex direction="column" align="center" className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            料金プラン
          </h2>
          <p className="text-lg text-slate-400 text-center max-w-2xl">
            まずは無料で始めて、必要に応じてアップグレード
          </p>
        </Flex>

        {/* プランカード */}
        <Grid columns="three" gap="lg" className="max-md:grid-cols-1">
          {plans.map((plan) => (
            <Block
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.featured
                  ? "bg-purple-600 ring-4 ring-purple-400 scale-105"
                  : "bg-slate-800"
              }`}
            >
              {/* プラン名 */}
              <Flex direction="column" className="mb-6">
                {plan.featured && (
                  <span className="text-purple-200 text-sm font-medium mb-2">
                    人気プラン
                  </span>
                )}
                <h3
                  className={`text-2xl font-bold ${
                    plan.featured ? "text-white" : "text-white"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm ${
                    plan.featured ? "text-purple-200" : "text-slate-400"
                  }`}
                >
                  {plan.description}
                </p>
              </Flex>

              {/* 価格 */}
              <Flex align="end" className="mb-6">
                <span
                  className={`text-4xl font-bold ${
                    plan.featured ? "text-white" : "text-white"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`ml-1 ${
                    plan.featured ? "text-purple-200" : "text-slate-400"
                  }`}
                >
                  {plan.period}
                </span>
              </Flex>

              {/* 機能リスト */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg
                      className={`w-5 h-5 ${
                        plan.featured ? "text-purple-200" : "text-purple-400"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span
                      className={
                        plan.featured ? "text-purple-100" : "text-slate-300"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                asChild
                className={`w-full ${
                  plan.featured
                    ? "bg-white text-purple-600 hover:bg-purple-100"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </Block>
          ))}
        </Grid>
      </Block>
    </section>
  );
}

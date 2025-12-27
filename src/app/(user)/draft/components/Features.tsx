import { Block, Flex, Grid } from "@/components/Layout";
import Image from "next/image";

const features = [
  {
    title: "シナリオエディター",
    description:
      "直感的なエディターでシナリオを執筆。分岐・フラグ管理も視覚的に操作可能",
    image: "https://placehold.co/600x400/6366f1/ffffff?text=Scenario+Editor",
  },
  {
    title: "キャラクター演出",
    description:
      "Live2Dモデル対応。表情・モーション・ボイスでキャラクターに命を吹き込む",
    image: "https://placehold.co/600x400/8b5cf6/ffffff?text=Live2D+Support",
  },
  {
    title: "AIダイアログ",
    description:
      "AIがキャラクターとして応答。プレイヤーとの動的な会話体験を実現",
    image: "https://placehold.co/600x400/a855f7/ffffff?text=AI+Dialog",
  },
  {
    title: "サウンド演出",
    description: "BGM・SE・ボイス対応。音響効果でゲームに臨場感をプラス",
    image: "https://placehold.co/600x400/c084fc/ffffff?text=Sound+System",
  },
  {
    title: "ワンクリック公開",
    description: "作成完了後、ボタン一つで公開。共有リンクを即座に生成",
    image: "https://placehold.co/600x400/d946ef/ffffff?text=One+Click+Publish",
  },
  {
    title: "マルチデバイス対応",
    description: "PC・タブレット・スマホ。どの端末でも最適な表示でプレイ可能",
    image: "https://placehold.co/600x400/e879f9/ffffff?text=Multi+Device",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-white">
      <Block className="max-w-6xl mx-auto px-4">
        {/* セクションタイトル */}
        <Flex direction="column" align="center" className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            主要機能
          </h2>
          <p className="text-lg text-slate-600 text-center max-w-2xl">
            創作に必要なすべてが揃っています
          </p>
        </Flex>

        {/* 機能グリッド */}
        <Grid columns="three" gap="lg" className="max-sm:grid-cols-1 max-md:grid-cols-2">
          {features.map((feature) => (
            <Block
              key={feature.title}
              className="group bg-slate-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
              <Block className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </Block>
            </Block>
          ))}
        </Grid>
      </Block>
    </section>
  );
}

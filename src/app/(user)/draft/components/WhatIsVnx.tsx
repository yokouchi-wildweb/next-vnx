import { Block, Flex, Grid } from "@/components/Layout";

const highlights = [
  {
    icon: "🎮",
    title: "ブラウザ完結",
    description: "インストール不要。リンクを開くだけでプレイ開始",
  },
  {
    icon: "✍️",
    title: "直感的な創作",
    description: "シナリオを書くように、ゲームが作れる",
  },
  {
    icon: "🔗",
    title: "即座に共有",
    description: "作ったらすぐ公開。URLをシェアするだけ",
  },
];

export function WhatIsVnx() {
  return (
    <section className="py-24 bg-slate-50">
      <Block className="max-w-6xl mx-auto px-4">
        {/* セクションタイトル */}
        <Flex direction="column" align="center" className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Next VNX とは？
          </h2>
          <p className="text-lg text-slate-600 text-center max-w-2xl">
            ノベルゲーム・マーダーミステリーを誰でも簡単に創作・公開できる
            <br />
            次世代のビジュアルノベルプラットフォーム
          </p>
        </Flex>

        {/* ハイライト */}
        <Grid columns="three" gap="lg" className="max-md:grid-cols-1">
          {highlights.map((item) => (
            <Flex
              key={item.title}
              direction="column"
              align="center"
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-5xl mb-4">{item.icon}</span>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-slate-600 text-center">{item.description}</p>
            </Flex>
          ))}
        </Grid>
      </Block>
    </section>
  );
}

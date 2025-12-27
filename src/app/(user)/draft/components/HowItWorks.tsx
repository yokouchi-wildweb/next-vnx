import { Block, Flex } from "@/components/Layout";

const steps = [
  {
    number: "01",
    title: "シナリオを書く",
    description:
      "エディターでストーリーを執筆。セリフ、選択肢、分岐を設定していきます",
  },
  {
    number: "02",
    title: "演出を設定",
    description:
      "キャラクター、背景、BGMを配置。Live2Dやボイスで表現力をアップ",
  },
  {
    number: "03",
    title: "公開・シェア",
    description:
      "公開ボタンを押すだけ。生成されたリンクをSNSやサイトでシェア",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-purple-900">
      <Block className="max-w-6xl mx-auto px-4">
        {/* セクションタイトル */}
        <Flex direction="column" align="center" className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            かんたん3ステップ
          </h2>
          <p className="text-lg text-purple-200 text-center max-w-2xl">
            思いついたその日から、あなたも作家に
          </p>
        </Flex>

        {/* ステップ */}
        <Flex direction="column" gap="lg" className="relative">
          {/* 接続線 */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-purple-500/30 hidden md:block" />

          {steps.map((step, index) => (
            <Flex
              key={step.number}
              gap="lg"
              align="start"
              className="relative"
            >
              {/* ステップ番号 */}
              <Flex
                justify="center"
                align="center"
                className="w-16 h-16 rounded-full bg-purple-600 text-white text-2xl font-bold shrink-0 relative z-10"
              >
                {step.number}
              </Flex>

              {/* コンテンツ */}
              <Block className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-purple-200">{step.description}</p>
              </Block>
            </Flex>
          ))}
        </Flex>
      </Block>
    </section>
  );
}

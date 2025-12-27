import { Block, Flex, Grid } from "@/components/Layout";
import Image from "next/image";

const useCases = [
  {
    title: "同人ノベルゲーム",
    description: "個人クリエイターが自分だけの物語を世界に届ける",
    image: "https://placehold.co/400x300/4f46e5/ffffff?text=Indie+Game",
    tag: "個人制作",
  },
  {
    title: "マーダーミステリー",
    description: "サークルでオリジナルシナリオを制作・頒布",
    image: "https://placehold.co/400x300/7c3aed/ffffff?text=Murder+Mystery",
    tag: "サークル",
  },
  {
    title: "TRPG / 謎解きイベント",
    description: "オンラインイベントのシナリオを手軽に実装",
    image: "https://placehold.co/400x300/9333ea/ffffff?text=TRPG+Event",
    tag: "イベント",
  },
  {
    title: "教育・研修コンテンツ",
    description: "インタラクティブな学習教材やシミュレーション",
    image: "https://placehold.co/400x300/a855f7/ffffff?text=Education",
    tag: "教育",
  },
];

export function UseCases() {
  return (
    <section className="py-24 bg-slate-50">
      <Block className="max-w-6xl mx-auto px-4">
        {/* セクションタイトル */}
        <Flex direction="column" align="center" className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            活用シーン
          </h2>
          <p className="text-lg text-slate-600 text-center max-w-2xl">
            様々なクリエイターに選ばれています
          </p>
        </Flex>

        {/* ユースケースグリッド */}
        <Grid columns="two" gap="lg" className="max-md:grid-cols-1">
          {useCases.map((useCase) => (
            <Flex
              key={useCase.title}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* 画像 */}
              <div className="relative w-1/3 min-h-[180px]">
                <Image
                  src={useCase.image}
                  alt={useCase.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* コンテンツ */}
              <Flex direction="column" justify="center" className="flex-1 p-6">
                <span className="inline-block bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full w-fit mb-2">
                  {useCase.tag}
                </span>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {useCase.title}
                </h3>
                <p className="text-slate-600 text-sm">{useCase.description}</p>
              </Flex>
            </Flex>
          ))}
        </Grid>
      </Block>
    </section>
  );
}

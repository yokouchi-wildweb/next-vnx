import { Block, Flex } from "@/components/Layout";
import { Button } from "@/components/Form/Button/Button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <Block className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* メインキャッチコピー */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          物語を、遊べる体験へ。
        </h1>

        {/* サブコピー */}
        <Flex direction="column" gap="sm" className="mb-8">
          <p className="text-xl md:text-2xl text-purple-200">
            ノベルゲーム / マーダーミステリー
          </p>
          <p className="text-lg md:text-xl text-slate-300">
            オリジナルシナリオを自由に創作
          </p>
          <p className="text-lg md:text-xl text-slate-300">
            リンクひとつで公開・プレイ可能
          </p>
        </Flex>

        {/* CTA ボタン */}
        <Flex justify="center" gap="md" className="mb-12">
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6">
            <Link href="/signup">無料で始める</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
            <Link href="/lab">デモを見る</Link>
          </Button>
        </Flex>

        {/* コンセプト説明 */}
        <Block className="inline-block bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
          <p className="text-slate-300 text-sm">
            <span className="text-purple-300 font-semibold">Next VNX</span>
            {" "}= 次世代の + ビジュアルノベル体験
          </p>
        </Block>
      </Block>
    </section>
  );
}

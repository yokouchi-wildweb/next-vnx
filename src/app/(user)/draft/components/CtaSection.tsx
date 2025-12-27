import { Block, Flex } from "@/components/Layout";
import { Button } from "@/components/Form/Button/Button";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="py-24 bg-gradient-to-r from-purple-600 to-indigo-600">
      <Block className="max-w-4xl mx-auto px-4 text-center">
        {/* メッセージ */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          あなたの物語を、世界に届けよう
        </h2>
        <p className="text-xl text-purple-100 mb-8">
          無料で始められます。クレジットカード不要。
        </p>

        {/* CTA ボタン */}
        <Flex justify="center" gap="md" className="flex-wrap">
          <Button
            asChild
            size="lg"
            className="bg-white text-purple-600 hover:bg-purple-50 text-lg px-8 py-6"
          >
            <Link href="/signup">今すぐ始める</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
          >
            <Link href="/lab">デモを見る</Link>
          </Button>
        </Flex>

        {/* 補足 */}
        <p className="text-purple-200 text-sm mt-8">
          Next VNX = 次世代の + ビジュアルノベル体験
        </p>
      </Block>
    </section>
  );
}

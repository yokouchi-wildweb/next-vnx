import { Block, Flex } from "@/components/Layout";
import { Button } from "@/components/Form/Button/Button";
import Link from "next/link";
import Image from "next/image";

export function Demo() {
  return (
    <section className="py-24 bg-white">
      <Block className="max-w-6xl mx-auto px-4">
        {/* セクションタイトル */}
        <Flex direction="column" align="center" className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            体験してみる
          </h2>
          <p className="text-lg text-slate-600 text-center max-w-2xl">
            サンプルシナリオをプレイして、Next VNXの可能性を体感
          </p>
        </Flex>

        {/* デモプレビュー */}
        <Block className="relative max-w-4xl mx-auto">
          {/* プレビュー画像 */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            <Image
              src="https://placehold.co/1280x720/1e1b4b/ffffff?text=Demo+Preview"
              alt="Demo Preview"
              fill
              className="object-cover"
              unoptimized
            />
            {/* 再生ボタンオーバーレイ */}
            <Flex
              justify="center"
              align="center"
              className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors cursor-pointer group"
            >
              <Flex
                justify="center"
                align="center"
                className="w-20 h-20 rounded-full bg-white/90 group-hover:bg-white transition-colors"
              >
                <svg
                  className="w-8 h-8 text-purple-600 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </Flex>
            </Flex>
          </div>

          {/* 機能バッジ */}
          <Flex justify="center" gap="sm" className="mt-6 flex-wrap">
            {["Live2D対応", "AIダイアログ", "BGM・SE", "選択肢分岐"].map(
              (badge) => (
                <span
                  key={badge}
                  className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full"
                >
                  {badge}
                </span>
              )
            )}
          </Flex>
        </Block>

        {/* CTA */}
        <Flex justify="center" className="mt-12">
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link href="/lab">デモをプレイする</Link>
          </Button>
        </Flex>
      </Block>
    </section>
  );
}

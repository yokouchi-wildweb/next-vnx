"use client";

import { useState } from "react";
import { Block, Flex } from "@/components/Layout";

const faqs = [
  {
    question: "プログラミングの知識は必要ですか？",
    answer:
      "いいえ、必要ありません。直感的なエディターで、テキストを書くように物語を作成できます。分岐やフラグの設定も視覚的に行えます。",
  },
  {
    question: "作成したゲームの著作権は誰のものですか？",
    answer:
      "作成したシナリオ、アップロードした素材の著作権はすべて制作者に帰属します。Next VNXはプラットフォームの利用権のみを提供します。",
  },
  {
    question: "商用利用は可能ですか？",
    answer:
      "はい、Proプラン以上で商用利用が可能です。有料コンテンツの販売、企業研修での利用などにお使いいただけます。",
  },
  {
    question: "Live2Dモデルは自分で用意する必要がありますか？",
    answer:
      "はい、Live2Dモデルは別途ご用意いただく必要があります。ただし、静止画キャラクターでも十分なゲーム体験を提供できます。",
  },
  {
    question: "オフラインでプレイできますか？",
    answer:
      "現在はオンライン接続が必要です。将来的にPWA対応によるオフラインプレイを検討しています。",
  },
  {
    question: "データのバックアップはできますか？",
    answer:
      "はい、シナリオデータはいつでもエクスポート可能です。また、クラウド上で自動バックアップも行われています。",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-slate-50">
      <Block className="max-w-3xl mx-auto px-4">
        {/* セクションタイトル */}
        <Flex direction="column" align="center" className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            よくある質問
          </h2>
          <p className="text-lg text-slate-600 text-center">
            その他のご質問はお気軽にお問い合わせください
          </p>
        </Flex>

        {/* FAQ アコーディオン */}
        <Block className="space-y-4">
          {faqs.map((faq, index) => (
            <Block
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-lg font-medium text-slate-900">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-slate-500 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <Block className="px-6 pb-5">
                  <p className="text-slate-600">{faq.answer}</p>
                </Block>
              )}
            </Block>
          ))}
        </Block>
      </Block>
    </section>
  );
}

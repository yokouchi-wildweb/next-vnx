"use client";

import { imgPath } from "@/utils/assets";
import Image from "next/image";

type HeroSectionProps = {
  imageSrc?: string;
  imageAlt?: string;
  aspectRatio?: string;
};

export function HeroSection({
  imageSrc = "heroes/dream_sity_with_logo.png",
  imageAlt = "Hero Image",
  aspectRatio = "16/9",
}: HeroSectionProps) {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-8">
      {/* コンテナ */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* ヒーロー画像（背景として全体に広がる） */}
        <div
          className="relative w-full"
          style={{ aspectRatio }}
        >
          <Image
            src={imgPath(imageSrc)}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 内側のグラデーションボーダー（画像の上に重なる） */}
        <div
          className="pointer-events-none absolute inset-3 rounded-xl"
          style={{
            border: "4px solid transparent",
            background: "linear-gradient(90deg, oklch(0.72 0.22 350), oklch(0.62 0.23 280)) border-box",
            mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
          }}
        />

        {/* 左下の白いドット（装飾） */}
        <div className="absolute bottom-6 left-6 z-10 size-3 rounded-full bg-white/60" />
        <div className="absolute bottom-6 left-12 z-10 size-2 rounded-full bg-white/40" />
        <div className="absolute bottom-8 left-8 z-10 size-1.5 rounded-full bg-white/30" />
      </div>
    </section>
  );
}

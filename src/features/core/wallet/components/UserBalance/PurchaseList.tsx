// src/features/core/wallet/components/UserBalance/PurchaseList.tsx

"use client";

import { CircleDollarSign } from "lucide-react";

import { Block } from "@/components/Layout/Block";
import { Flex } from "@/components/Layout/Flex";
import { Section } from "@/components/Layout/Section";
import { SecTitle, Span } from "@/components/TextBlocks";
import { LinkButton } from "@/components/Form/Button/LinkButton";

/** 購入パッケージ定義 */
const PURCHASE_PACKAGES = [
  { amount: 100, price: 100 },
  { amount: 500, price: 480, bonus: "4%お得" },
  { amount: 1000, price: 900, bonus: "10%お得" },
  { amount: 3000, price: 2500, bonus: "17%お得" },
  { amount: 5000, price: 4000, bonus: "20%お得" },
];

type PurchaseListProps = {
  label?: string;
};

export function PurchaseList({ label = "コイン" }: PurchaseListProps) {
  return (
    <Section space="sm">
      <SecTitle as="h2" size="lg">
        {label}購入
      </SecTitle>
      <Block space="none">
        {PURCHASE_PACKAGES.map((pkg) => (
          <Flex
            key={pkg.amount}
            justify="between"
            align="center"
            className="border-b-2 border-gray-100 py-4 last:border-b-0"
          >
            <Flex align="center" gap="xs">
              <CircleDollarSign className="size-5 text-coin" />
              <Span size="lg" weight="medium" className="text-coin">
                {pkg.amount.toLocaleString()}
              </Span>
              {pkg.bonus && (
                <Span size="sm" tone="success">
                  {pkg.bonus}
                </Span>
              )}
            </Flex>
            <LinkButton
              href={`/coins/purchase?amount=${pkg.amount}&price=${pkg.price}`}
              variant="default"
              size="sm"
              className="min-w-24 rounded-full"
            >
              ¥{pkg.price.toLocaleString()}
            </LinkButton>
          </Flex>
        ))}
      </Block>
    </Section>
  );
}

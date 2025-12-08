// src/features/core/wallet/components/UserBalance/PurchaseList.tsx

"use client";

import { CircleDollarSign } from "lucide-react";

import { Block } from "@/components/Layout/Block";
import { Flex } from "@/components/Layout/Flex";
import { Section } from "@/components/Layout/Section";
import { SecTitle, Span } from "@/components/TextBlocks";
import { Button } from "@/components/Form/Button/Button";

const COIN_PRICE_RATE = 10; // 1単位 = 10円

const PURCHASE_OPTIONS = [
  50, 100, 200, 300, 400, 500, 1000, 3000, 5000, 10000,
] as const;

function formatPrice(amount: number): string {
  const price = amount * COIN_PRICE_RATE;
  return `¥${price.toLocaleString()}`;
}

type PurchaseListProps = {
  label: string;
  onPurchase?: (amount: number) => void;
};

export function PurchaseList({ label, onPurchase }: PurchaseListProps) {
  const handlePurchase = (amount: number) => {
    if (onPurchase) {
      onPurchase(amount);
    } else {
      // ダミー: 実際の購入処理は後で実装
      console.log(`購入: ${amount}${label} (${formatPrice(amount)})`);
    }
  };

  return (
    <Section space="sm">
      <Flex justify="between" align="center">
        <SecTitle as="h2" size="lg">
          {label}購入
        </SecTitle>
        <Span size="sm" tone="muted">
          (1{label}/{COIN_PRICE_RATE}円)
        </Span>
      </Flex>
      <Block space="none">
        {PURCHASE_OPTIONS.map((amount) => (
          <Flex
            key={amount}
            justify="between"
            align="center"
            className="border-b-2 border-gray-100 py-4 last:border-b-0"
          >
            <Flex align="center" gap="xs">
              <CircleDollarSign className="size-5 text-coin" />
              <Span size="lg" weight="medium" className="text-coin">
                {amount.toLocaleString()}
              </Span>
            </Flex>
            <Button
              variant="default"
              size="sm"
              className="min-w-24 rounded-full"
              onClick={() => handlePurchase(amount)}
            >
              {formatPrice(amount)}
            </Button>
          </Flex>
        ))}
      </Block>
    </Section>
  );
}

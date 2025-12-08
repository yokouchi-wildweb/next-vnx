// src/features/core/wallet/components/CurrencyPurchase/PurchaseSummaryCard.tsx

import { Block } from "@/components/Layout/Block";
import { Flex } from "@/components/Layout/Flex";
import { Section } from "@/components/Layout/Section";
import { Span } from "@/components/TextBlocks";

type PurchaseSummaryCardProps = {
  purchaseAmount: number;
  paymentAmount: number;
  currentBalance: number;
  label: string;
};

export function PurchaseSummaryCard({
  purchaseAmount,
  paymentAmount,
  currentBalance,
  label,
}: PurchaseSummaryCardProps) {
  const balanceAfterPurchase = currentBalance + purchaseAmount;

  return (
    <Section className="-mx-4 bg-gray-100 px-4 py-4">
      <Block className="rounded-lg bg-white" padding="lg" space="sm">
        <Flex justify="between" align="center" className="py-2">
          <Span tone="muted">ご購入{label}</Span>
          <Span weight="bold" className="text-coin">
            {purchaseAmount.toLocaleString()}{label}
          </Span>
        </Flex>
        <Flex justify="between" align="center" className="border-t border-gray-200 py-2">
          <Span tone="muted">お支払い金額</Span>
          <Span weight="bold" size="lg">
            ¥{paymentAmount.toLocaleString()}
          </Span>
        </Flex>
        <Flex justify="between" align="center" className="border-t border-gray-200 py-2">
          <Span tone="muted">購入後の{label}残高</Span>
          <Span weight="bold" className="text-coin">
            {balanceAfterPurchase.toLocaleString()}{label}
          </Span>
        </Flex>
      </Block>
    </Section>
  );
}

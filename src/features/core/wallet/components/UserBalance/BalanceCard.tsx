// src/features/core/wallet/components/UserBalance/BalanceCard.tsx

import { CircleDollarSign } from "lucide-react";

import { Block } from "@/components/Layout/Block";
import { Flex } from "@/components/Layout/Flex";
import { Section } from "@/components/Layout/Section";
import { Span } from "@/components/TextBlocks";

type BalanceCardProps = {
  balance: number;
  label: string;
};

export function BalanceCard({ balance, label }: BalanceCardProps) {
  return (
    <Section className="-mx-4 bg-gray-100 px-4 py-4">
      <Block className="rounded-lg bg-white" padding="lg">
        <Flex direction="column" align="center" gap="xs">
          <Span size="sm" tone="muted">
            保有{label}
          </Span>
          <Flex align="center" gap="xs">
            <CircleDollarSign className="size-8 text-coin" />
            <Span size="xxxl" weight="bold" className="text-coin">
              {balance.toLocaleString()}
            </Span>
          </Flex>
        </Flex>
        <Block className="mt-4 border-t border-gray-200 pt-4">
          <Flex justify="between" align="center">
            <Span size="sm" tone="muted">
              通常{label}
            </Span>
            <Flex align="center" gap="xs">
              <CircleDollarSign className="size-5 text-coin" />
              <Span size="lg" weight="medium" className="text-coin">
                {balance.toLocaleString()}
              </Span>
            </Flex>
          </Flex>
        </Block>
      </Block>
    </Section>
  );
}

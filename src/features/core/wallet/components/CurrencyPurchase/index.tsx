// src/features/core/wallet/components/CurrencyPurchase/index.tsx

import { Block } from "@/components/Layout/Block";

import { PaymentMethodForm } from "./PaymentMethodForm";
import { PurchaseSummaryCard } from "./PurchaseSummaryCard";

type CurrencyPurchaseProps = {
  purchaseAmount?: number;
  currentBalance?: number;
  label?: string;
  priceRate?: number;
};

export function CurrencyPurchase({
  purchaseAmount = 100,
  currentBalance = 1000,
  label = "コイン",
  priceRate = 10,
}: CurrencyPurchaseProps) {
  const paymentAmount = purchaseAmount * priceRate;

  return (
    <Block space="md">
      <PurchaseSummaryCard
        purchaseAmount={purchaseAmount}
        paymentAmount={paymentAmount}
        currentBalance={currentBalance}
        label={label}
      />
      <PaymentMethodForm />
    </Block>
  );
}

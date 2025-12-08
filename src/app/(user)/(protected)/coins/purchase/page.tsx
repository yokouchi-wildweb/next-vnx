// src/app/(user)/(protected)/coins/purchase/page.tsx

import { UserPageTitle } from "@/components/AppFrames/User/Elements/PageTitle";
import { UserPage } from "@/components/AppFrames/User/Layout/UserPage";
import { CurrencyPurchase } from "@/features/core/wallet/components/CurrencyPurchase";

export default function CoinPurchasePage() {
  return (
    <UserPage containerType="narrowStack" space="md">
      <UserPageTitle>コインのご購入</UserPageTitle>
      <CurrencyPurchase purchaseAmount={100} currentBalance={1000} label="コイン" />
    </UserPage>
  );
}

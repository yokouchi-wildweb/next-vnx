// src/features/core/wallet/components/CoinPurchasePage/index.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { Block } from "@/components/Layout/Block";
import { Flex } from "@/components/Layout/Flex";
import { Para } from "@/components/TextBlocks/Para";
import { Spinner } from "@/components/Overlays/Loading/Spinner";
import { LinkButton } from "@/components/Form/Button/LinkButton";
import { useAuthSession } from "@/features/core/auth/hooks/useAuthSession";
import { useWalletBalances } from "@/features/core/wallet/hooks/useWalletBalances";
import { CurrencyPurchase } from "../CurrencyPurchase";

export function CoinPurchasePage() {
  const searchParams = useSearchParams();
  const amountParam = searchParams.get("amount");
  const priceParam = searchParams.get("price");

  const { user } = useAuthSession();
  const { data, isLoading, error } = useWalletBalances(user?.userId);

  // パラメータ不足チェック
  if (!amountParam || !priceParam) {
    return (
      <Block space="lg">
        <Para tone="danger" align="center">
          購入情報が指定されていません。
        </Para>
        <Flex justify="center">
          <LinkButton href="/coins" variant="outline">
            コイン管理ページへ戻る
          </LinkButton>
        </Flex>
      </Block>
    );
  }

  const purchaseAmount = Number(amountParam);
  const paymentAmount = Number(priceParam);

  // 数値バリデーション
  if (isNaN(purchaseAmount) || isNaN(paymentAmount) || purchaseAmount <= 0 || paymentAmount <= 0) {
    return (
      <Block space="lg">
        <Para tone="danger" align="center">
          無効な購入情報です。
        </Para>
        <Flex justify="center">
          <LinkButton href="/coins" variant="outline">
            コイン管理ページへ戻る
          </LinkButton>
        </Flex>
      </Block>
    );
  }

  // ローディング中
  if (isLoading) {
    return (
      <Flex justify="center" padding="lg">
        <Spinner className="h-8 w-8" />
      </Flex>
    );
  }

  // エラー
  if (error) {
    return (
      <Block padding="lg">
        <Para tone="danger" align="center">
          残高情報の取得に失敗しました。
        </Para>
      </Block>
    );
  }

  // regular_coin の残高を取得
  const coinWallet = data?.wallets.find((w) => w.type === "regular_coin");
  const currentBalance = coinWallet?.balance ?? 0;

  return (
    <Block space="md">
      <CurrencyPurchase
        purchaseAmount={purchaseAmount}
        paymentAmount={paymentAmount}
        currentBalance={currentBalance}
        label="コイン"
        walletType="regular_coin"
      />
    </Block>
  );
}

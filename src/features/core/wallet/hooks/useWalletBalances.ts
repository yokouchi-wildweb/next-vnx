// src/features/wallet/hooks/useWalletBalances.ts

"use client";

import useSWR from "swr";
import axios from "axios";

import type { Wallet } from "@/features/core/wallet/entities";

type WalletBalanceResult = {
  wallets: Wallet[];
};

export const useWalletBalances = (userId?: string | null) =>
  useSWR<WalletBalanceResult>(
    userId ? `wallet-balances:${userId}` : null,
    async () => {
      if (!userId) {
        return { wallets: [] };
      }
      const response = await axios.get<Wallet[]>(`/api/wallet`, {
        params: {
          where: JSON.stringify({ field: "user_id", op: "eq", value: userId }),
        },
      });
      return { wallets: response.data ?? [] };
    },
  );

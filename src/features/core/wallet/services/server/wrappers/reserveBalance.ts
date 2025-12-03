// src/features/wallet/services/server/wrappers/reserveBalance.ts

import type { ReserveWalletParams } from "@/features/core/wallet/services/types";
import { WalletTable } from "@/features/core/wallet/entities/drizzle";
import { eq } from "drizzle-orm";
import {
  ensureSufficientAvailable,
  getOrCreateWallet,
  normalizeAmount,
  runWithTransaction,
  type TransactionClient,
} from "./utils";

export async function reserveBalance(params: ReserveWalletParams, tx?: TransactionClient) {
  const amount = normalizeAmount(params.amount);

  return runWithTransaction(tx, async (trx) => {
    const wallet = await getOrCreateWallet(trx, params.userId, params.walletType);
    ensureSufficientAvailable(wallet, amount);

    const [updated] = await trx
      .update(WalletTable)
      .set({
        locked_balance: wallet.locked_balance + amount,
        updatedAt: new Date(),
      })
      .where(eq(WalletTable.id, wallet.id))
      .returning();

    return updated;
  });
}

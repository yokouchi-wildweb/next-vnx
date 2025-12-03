// src/features/wallet/services/server/walletService.ts

import type {
  AdjustWalletParams,
  ReserveWalletParams,
  ReleaseReservationParams,
  ConsumeReservationParams,
  WalletAdjustmentResult,
} from "@/features/core/wallet/services/types";
import { base } from "./drizzleBase";
import { adjustBalance } from "./wrappers/adjustBalance";
import { consumeReservedBalance } from "./wrappers/consumeReservedBalance";
import { releaseReservation } from "./wrappers/releaseReservation";
import { reserveBalance } from "./wrappers/reserveBalance";
import type { TransactionClient } from "./wrappers/utils";

export const walletService = {
  ...base,
  adjustBalance: (params: AdjustWalletParams, tx?: TransactionClient): Promise<WalletAdjustmentResult> =>
    adjustBalance(params, tx),
  reserveBalance: (params: ReserveWalletParams, tx?: TransactionClient) => reserveBalance(params, tx),
  releaseReservation: (params: ReleaseReservationParams, tx?: TransactionClient) =>
    releaseReservation(params, tx),
  consumeReservedBalance: (params: ConsumeReservationParams, tx?: TransactionClient) =>
    consumeReservedBalance(params, tx),
};

// src/features/core/wallet/index.ts
// Barrel export for wallet feature

// コンポーネント
export { CurrencyDisplay } from './components/common/CurrencyDisplay';

// 型
export type { WalletType, CurrencyConfig } from './currencyConfig';
export type {
  WalletAdjustmentResult,
  AdjustWalletParams,
  ReserveWalletParams,
  ReleaseReservationParams,
  ConsumeReservationParams,
  WalletOperationOptions,
  AdjustBalanceOptions,
  GetWalletOptions,
} from './services/types';

// トランザクション関連の型
export type { TransactionClient } from './services/server/wrappers/utils';

// 設定・ユーティリティ
export {
  CURRENCY_CONFIG,
  WalletTypeOptions,
  getCurrencyConfig,
  getCurrencyConfigBySlug,
  getWalletTypeBySlug,
  getSlugByWalletType,
  isValidSlug,
} from './currencyConfig';

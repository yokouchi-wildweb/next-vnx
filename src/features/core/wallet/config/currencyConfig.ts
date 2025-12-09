// src/features/core/wallet/config/currencyConfig.ts

import { CircleDollarSign, Coins, Gift } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * 購入パッケージの型定義
 */
export type PurchasePackage = {
  /** 購入数量 */
  amount: number;
  /** 支払い金額（円） */
  price: number;
  /** ボーナス表示（例: "10%お得"） */
  bonus?: string;
};

/**
 * 通貨設定の型定義
 */
export type CurrencyConfig = {
  /** URLパス用スラッグ */
  slug: string;
  /** 表示ラベル */
  label: string;
  /** テーマカラー（HEX） */
  color: string;
  /** アイコンコンポーネント */
  icon: LucideIcon;
  /** 購入パッケージ一覧 */
  packages: PurchasePackage[];
};

/**
 * ウォレット種別の型（キーから自動推論）
 */
export type WalletType = keyof typeof CURRENCY_CONFIG;

/**
 * 通貨設定マップ
 * キー = walletType（DB値）
 */
export const CURRENCY_CONFIG = {
  regular_coin: {
    slug: "coin",
    label: "通常コイン",
    color: "#F59E0B", // amber-500
    icon: CircleDollarSign,
    packages: [
      { amount: 100, price: 100 },
      { amount: 500, price: 480, bonus: "4%お得" },
      { amount: 1000, price: 900, bonus: "10%お得" },
      { amount: 3000, price: 2500, bonus: "17%お得" },
      { amount: 5000, price: 4000, bonus: "20%お得" },
    ],
  },
  regular_point: {
    slug: "point",
    label: "通常ポイント",
    color: "#3B82F6", // blue-500
    icon: Coins,
    packages: [
      { amount: 100, price: 100 },
      { amount: 500, price: 500 },
      { amount: 1000, price: 1000 },
      { amount: 3000, price: 3000 },
      { amount: 5000, price: 5000 },
    ],
  },
  temporary_point: {
    slug: "temporary-point",
    label: "期間限定ポイント",
    color: "#EC4899", // pink-500
    icon: Gift,
    packages: [
      { amount: 100, price: 80, bonus: "20%お得" },
      { amount: 500, price: 400, bonus: "20%お得" },
      { amount: 1000, price: 800, bonus: "20%お得" },
    ],
  },
} as const satisfies Record<string, CurrencyConfig>;

/**
 * WalletTypeOptions（セレクトボックス等で使用）
 * CURRENCY_CONFIG から自動生成
 */
export const WalletTypeOptions = Object.entries(CURRENCY_CONFIG).map(
  ([value, config]) => ({
    value: value as WalletType,
    label: config.label,
  })
);

/**
 * 有効なスラッグの一覧
 */
export const VALID_SLUGS = Object.values(CURRENCY_CONFIG).map((c) => c.slug) as string[];

/**
 * スラッグが有効かどうかを判定
 */
export function isValidSlug(slug: string): boolean {
  return VALID_SLUGS.includes(slug);
}

/**
 * スラッグから walletType を取得
 */
export function getWalletTypeBySlug(slug: string): WalletType | null {
  const entry = Object.entries(CURRENCY_CONFIG).find(
    ([, config]) => config.slug === slug
  );
  return entry ? (entry[0] as WalletType) : null;
}

/**
 * スラッグから通貨設定を取得
 */
export function getCurrencyConfigBySlug(
  slug: string
): (CurrencyConfig & { walletType: WalletType }) | null {
  const walletType = getWalletTypeBySlug(slug);
  if (!walletType) return null;
  return {
    ...CURRENCY_CONFIG[walletType],
    walletType,
  };
}

/**
 * walletType から通貨設定を取得
 */
export function getCurrencyConfig(
  walletType: WalletType
): CurrencyConfig & { walletType: WalletType } {
  return {
    ...CURRENCY_CONFIG[walletType],
    walletType,
  };
}

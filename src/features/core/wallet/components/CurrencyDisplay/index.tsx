// src/features/core/wallet/components/CurrencyDisplay/index.tsx

import { Flex } from "@/components/Layout/Flex";
import { Span } from "@/components/TextBlocks";
import {
  getCurrencyConfig,
  type WalletType,
} from "@/features/core/wallet/currencyConfig";

const SIZE_CONFIG = {
  xs: { icon: "size-3", text: "xs", gap: "xs" },
  sm: { icon: "size-4", text: "sm", gap: "xs" },
  md: { icon: "size-5", text: "md", gap: "xs" },
  lg: { icon: "size-6", text: "lg", gap: "sm" },
  xl: { icon: "size-8", text: "xl", gap: "sm" },
} as const;

type CurrencyDisplayProps = {
  /** ウォレット種別 */
  walletType: WalletType;
  /** 表示金額 */
  amount: number;
  /** サイズ */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** アイコンを表示するか */
  showIcon?: boolean;
  /** ラベルを表示するか（例: "1,000 コイン"） */
  showLabel?: boolean;
  /** 単位を表示するか（例: "1,000 コイン" or "1,000 pt"） */
  showUnit?: boolean;
  /** 太字にするか */
  bold?: boolean;
};

/**
 * 通貨表示コンポーネント
 * 各通貨の色・アイコンを統一フォーマットで表示
 */
export function CurrencyDisplay({
  walletType,
  amount,
  size = "md",
  showIcon = true,
  showLabel = false,
  showUnit = false,
  bold = false,
}: CurrencyDisplayProps) {
  const config = getCurrencyConfig(walletType);
  const Icon = config.icon;
  const sizeConfig = SIZE_CONFIG[size];

  // サフィックスの決定: showLabel > showUnit の優先度
  const suffix = showLabel ? config.label : showUnit ? config.unit : "";

  return (
    <Flex
      align="center"
      gap={sizeConfig.gap}
      className="inline-flex"
    >
      {showIcon && (
        <Icon
          className={sizeConfig.icon}
          style={{ color: config.color }}
        />
      )}
      <Span
        size={sizeConfig.text}
        weight={bold ? "bold" : "medium"}
        style={{ color: config.color }}
      >
        {amount.toLocaleString()}
        {suffix && ` ${suffix}`}
      </Span>
    </Flex>
  );
}

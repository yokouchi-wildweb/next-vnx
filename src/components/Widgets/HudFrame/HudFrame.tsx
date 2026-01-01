"use client";

import { cn } from "@/lib/cn";
import { HudFrameProps } from "./types";
import { getHudFrameTheme } from "./theme";
import { CornerDecoration } from "./parts/CornerDecoration";
import { HudFrameTitleBar } from "./HudFrameTitleBar";
import { HudFrameStatusBar } from "./HudFrameStatusBar";

/** HUDフレーム メインコンポーネント */
export function HudFrame({
  children,
  variant = "dark",
  accentColor = "cyan",
  maxWidth,
  className,
  // タイトルバー
  title,
  subtitle,
  titleIcon,
  titleRight,
  // ステータスバー
  showStatusBar = false,
  statusText,
  statusRight,
  // 装飾オプション
  showCorners = true,
  showScanlines = true,
  showTopLight = true,
  showReflection = true,
}: HudFrameProps) {
  const theme = getHudFrameTheme(variant, accentColor);
  const hasTitle = title !== undefined;

  // フレームボーダー用のクラスを生成
  const frameBorderClass = theme.borderClass
    .replace("/60", theme.frameBorderOpacity)
    .replace("/50", theme.frameBorderOpacity);
  const innerBorderClass = theme.borderClass
    .replace("/60", theme.innerBorderOpacity)
    .replace("/50", theme.innerBorderOpacity);

  return (
    <div
      className={cn("relative", className)}
      style={maxWidth ? { maxWidth } : undefined}
    >
      {/* 外側のグロー */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-50 blur-xl"
        style={{
          background: `linear-gradient(135deg, ${theme.glowRgba}, rgba(168, 85, 247, 0.15), rgba(244, 114, 182, 0.1))`,
        }}
      />

      {/* メインフレーム */}
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden",
          "border",
          frameBorderClass,
          "bg-gradient-to-br",
          theme.frameBg,
          "backdrop-blur-md"
        )}
        style={{
          boxShadow: theme.boxShadow,
        }}
      >
        {/* 内側の装飾ボーダー */}
        <div
          className={cn(
            "absolute inset-2 md:inset-3 rounded-xl border pointer-events-none",
            innerBorderClass
          )}
        />

        {/* コーナー装飾 */}
        {showCorners && (
          <>
            <CornerDecoration position="tl" variant={variant} accentColor={accentColor} />
            <CornerDecoration position="tr" variant={variant} accentColor={accentColor} />
            <CornerDecoration position="bl" variant={variant} accentColor={accentColor} />
            <CornerDecoration position="br" variant={variant} accentColor={accentColor} />
          </>
        )}

        {/* スキャンライン効果 */}
        {showScanlines && (
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                ${theme.scanline} 2px,
                ${theme.scanline} 4px
              )`,
            }}
          />
        )}

        {/* 上部ライトエフェクト */}
        {showTopLight && (
          <div
            className="absolute top-0 left-1/4 right-1/4 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${theme.lightRgba}, transparent)`,
            }}
          />
        )}

        {/* タイトルバー */}
        {hasTitle && (
          <HudFrameTitleBar
            variant={variant}
            accentColor={accentColor}
            title={title}
            subtitle={subtitle}
            icon={titleIcon}
            right={titleRight}
          />
        )}

        {/* メインコンテンツ */}
        <div className="relative">{children}</div>

        {/* ステータスバー */}
        {showStatusBar && (
          <HudFrameStatusBar
            variant={variant}
            accentColor={accentColor}
            text={statusText}
            right={statusRight}
          />
        )}
      </div>

      {/* 下部の反射 */}
      {showReflection && (
        <div
          className={cn(
            "absolute -bottom-4 left-1/4 right-1/4 h-8 rounded-full blur-2xl",
            theme.reflectionOpacity
          )}
          style={{
            background: `linear-gradient(90deg, ${theme.glowRgba.replace("0.15", "0.5").replace("0.2", "0.3")}, rgba(168, 85, 247, 0.5))`,
          }}
        />
      )}
    </div>
  );
}

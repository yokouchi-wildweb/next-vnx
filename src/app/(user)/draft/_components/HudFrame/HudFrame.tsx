"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { HudFrameProps } from "./types";
import { createHudFrameTheme } from "./theme";
import { HUD_ACCENT_PRESETS, DEFAULT_HUD_ACCENT, DEFAULT_HUD_MODE } from "./presets";
import { CornerDecoration } from "./parts/CornerDecoration";
import { HudFrameTitleBar } from "./HudFrameTitleBar";
import { HudFrameStatusBar } from "./HudFrameStatusBar";

/** HUDフレーム メインコンポーネント */
export function HudFrame({
  children,
  accent = DEFAULT_HUD_ACCENT,
  mode = DEFAULT_HUD_MODE,
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
  const hasTitle = title !== undefined;
  const accentRgb = HUD_ACCENT_PRESETS[accent];
  const theme = useMemo(() => createHudFrameTheme(mode), [mode]);

  return (
    <div
      className={cn("relative", className)}
      style={{
        "--hud-accent": accentRgb,
        ...(maxWidth ? { maxWidth } : {}),
      } as React.CSSProperties}
    >
      {/* 外側のグロー */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-50 blur-xl"
        style={{ background: theme.glowGradient }}
      />

      {/* メインフレーム */}
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden",
          "border",
          theme.frameBorderClass,
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
            theme.innerBorderClass
          )}
        />

        {/* コーナー装飾 */}
        {showCorners && (
          <>
            <CornerDecoration position="tl" />
            <CornerDecoration position="tr" />
            <CornerDecoration position="bl" />
            <CornerDecoration position="br" />
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
            title={title}
            subtitle={subtitle}
            icon={titleIcon}
            right={titleRight}
            theme={theme}
          />
        )}

        {/* メインコンテンツ */}
        <div className={cn("relative", theme.contentText)}>{children}</div>

        {/* ステータスバー */}
        {showStatusBar && (
          <HudFrameStatusBar text={statusText} right={statusRight} theme={theme} />
        )}
      </div>

      {/* 下部の反射 */}
      {showReflection && (
        <div
          className={cn(
            "absolute -bottom-4 left-1/4 right-1/4 h-8 rounded-full blur-2xl",
            theme.reflectionOpacity
          )}
          style={{ background: theme.reflectionGradient }}
        />
      )}
    </div>
  );
}

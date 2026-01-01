import { cn } from "@/lib/cn";
import { HudFrameTitleBarProps } from "./types";
import { getHudFrameTheme } from "./theme";

const WINDOW_DOT_COLORS = ["pink", "cyan", "purple"] as const;

const WINDOW_DOT_SHADOWS = {
  dark: {
    pink: "rgba(244, 114, 182, 0.5)",
    cyan: "rgba(6, 182, 212, 0.5)",
    purple: "rgba(168, 85, 247, 0.5)",
  },
  light: {
    pink: "rgba(244, 114, 182, 0.4)",
    cyan: "rgba(6, 182, 212, 0.4)",
    purple: "rgba(168, 85, 247, 0.4)",
  },
};

/** HUDフレーム タイトルバーコンポーネント */
export function HudFrameTitleBar({
  variant = "dark",
  accentColor = "cyan",
  title,
  subtitle,
  icon,
  right,
  showWindowDots = true,
}: HudFrameTitleBarProps) {
  const theme = getHudFrameTheme(variant, accentColor);

  return (
    <div
      className={cn(
        "relative flex items-center justify-between px-4 md:px-6 py-3 border-b",
        theme.borderClass.replace("/60", theme.titleBarBorderOpacity).replace("/50", theme.titleBarBorderOpacity)
      )}
    >
      {/* 左側: アイコン + タイトル */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          {/* アイコン */}
          {icon !== undefined ? (
            <span className={cn("text-lg", theme.iconClass)}>{icon}</span>
          ) : (
            <span className={cn("text-lg", theme.iconClass)}>◈</span>
          )}
          {/* タイトル */}
          <span
            className={cn(
              "text-xs md:text-sm font-mono tracking-widest",
              theme.textClass
            )}
          >
            {title}
          </span>
        </div>

        {/* サブタイトル */}
        {subtitle && (
          <>
            <div className={cn("hidden md:block w-px h-4", theme.dividerBg)} />
            <span
              className={cn("hidden md:block text-xs font-mono", theme.titleSubtext)}
            >
              {subtitle}
            </span>
          </>
        )}
      </div>

      {/* 右側 */}
      <div className="flex items-center gap-2">
        {/* カスタムコンテンツ */}
        {right}

        {/* ウィンドウコントロール風ドット */}
        {showWindowDots && (
          <>
            <div className="flex gap-1.5">
              {WINDOW_DOT_COLORS.map((color, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full",
                    theme.windowDots[color]
                  )}
                  style={{
                    boxShadow: `0 0 6px ${WINDOW_DOT_SHADOWS[variant][color]}`,
                  }}
                />
              ))}
            </div>
            <span className={cn("text-sm ml-2", theme.starClass)}>✦</span>
          </>
        )}
      </div>
    </div>
  );
}

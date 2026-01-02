import { cn } from "@/lib/cn";
import { HudFrameTitleBarProps } from "./types";
import { HUD_FRAME_THEME } from "./theme";

const WINDOW_DOT_COLORS = ["pink", "accent", "purple"] as const;
const theme = HUD_FRAME_THEME;

/** HUDフレーム タイトルバーコンポーネント */
export function HudFrameTitleBar({
  title,
  subtitle,
  icon,
  right,
  showWindowDots = true,
}: HudFrameTitleBarProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-between px-4 md:px-6 py-3 border-b",
        theme.titleBarBorderClass
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
                    boxShadow: `0 0 6px ${theme.windowDotShadows[color]}`,
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

import { cn } from "@/lib/cn";
import { HudFrameStatusBarProps } from "./types";
import { getHudFrameTheme } from "./theme";

/** デフォルトのプログレスバー */
function DefaultProgressBar({
  variant = "dark",
  accentColor = "cyan",
}: {
  variant?: "dark" | "light";
  accentColor?: "cyan" | "pink" | "purple" | "green" | "orange";
}) {
  const theme = getHudFrameTheme(variant, accentColor);

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "relative w-24 md:w-32 h-1 rounded-full overflow-hidden",
          theme.progressBg
        )}
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 bg-gradient-to-r rounded-full animate-status-progress",
            theme.progressBar
          )}
          style={{ width: "100%" }}
        />
        {/* 光のスキャン */}
        <div className="absolute inset-0 animate-status-scan">
          <div
            className={cn(
              "w-8 h-full bg-gradient-to-r from-transparent to-transparent",
              variant === "dark" ? "via-white/40" : "via-white/70"
            )}
          />
        </div>
      </div>
      <span className={cn("text-xs font-mono", theme.progressStarClass)}>✦</span>
    </div>
  );
}

/** HUDフレーム ステータスバーコンポーネント */
export function HudFrameStatusBar({
  variant = "dark",
  accentColor = "cyan",
  text = "READY",
  right,
  showProgress = true,
}: HudFrameStatusBarProps) {
  const theme = getHudFrameTheme(variant, accentColor);

  return (
    <div
      className={cn(
        "relative flex items-center justify-between px-4 md:px-6 py-2.5 border-t",
        theme.borderClass.replace("/60", theme.titleBarBorderOpacity).replace("/50", theme.titleBarBorderOpacity)
      )}
    >
      {/* 左側: ステータステキスト */}
      <div className="flex items-center gap-2">
        <span className={cn("text-xs", theme.arrowClass)}>▸</span>
        <span className={cn("text-xs font-mono tracking-wide", theme.statusText)}>
          {text}
        </span>
      </div>

      {/* 右側 */}
      {right !== undefined ? (
        right
      ) : showProgress ? (
        <DefaultProgressBar variant={variant} accentColor={accentColor} />
      ) : null}
    </div>
  );
}

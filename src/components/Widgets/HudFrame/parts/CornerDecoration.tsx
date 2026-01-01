import { cn } from "@/lib/cn";
import { CornerDecorationProps } from "../types";
import { getHudFrameTheme } from "../theme";

const POSITION_CLASSES = {
  tl: "top-0 left-0 border-t-2 border-l-2 rounded-tl-xl",
  tr: "top-0 right-0 border-t-2 border-r-2 rounded-tr-xl",
  bl: "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl",
  br: "bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl",
};

const DOT_POSITION_CLASSES = {
  tl: "top-1 left-1",
  tr: "top-1 right-1",
  bl: "bottom-1 left-1",
  br: "bottom-1 right-1",
};

/** コーナー装飾コンポーネント */
export function CornerDecoration({
  position,
  variant = "dark",
  accentColor = "cyan",
}: CornerDecorationProps) {
  const theme = getHudFrameTheme(variant, accentColor);

  return (
    <div
      className={cn(
        "absolute w-6 h-6 md:w-8 md:h-8",
        theme.borderClass,
        POSITION_CLASSES[position]
      )}
    >
      {/* 内側のドット */}
      <div
        className={cn(
          "absolute w-1.5 h-1.5 rounded-full",
          theme.dotClass,
          "animate-pulse-slow",
          DOT_POSITION_CLASSES[position]
        )}
      />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useHeaderVisibility } from "../contexts/HeaderVisibilityContext";

export type HideHeaderProps = {
  /** スマホでヘッダーを非表示にする */
  sp?: boolean;
  /** PCでヘッダーを非表示にする */
  pc?: boolean;
};

/**
 * ページ単位でヘッダーの表示/非表示を制御するコンポーネント
 *
 * @example
 * // 両方非表示（props未指定で両方非表示）
 * <HideHeader />
 *
 * @example
 * // スマホのみ非表示
 * <HideHeader sp />
 *
 * @example
 * // PCのみ非表示
 * <HideHeader pc />
 */
export const HideHeader = ({ sp, pc }: HideHeaderProps) => {
  const { setVisibility, reset } = useHeaderVisibility();

  useEffect(() => {
    // 両方未指定の場合は両方非表示
    const hideAll = sp === undefined && pc === undefined;
    const hideSp = hideAll || sp === true;
    const hidePc = hideAll || pc === true;

    setVisibility({
      sp: !hideSp,
      pc: !hidePc,
    });

    return () => {
      reset();
    };
  }, [sp, pc, setVisibility, reset]);

  return null;
};

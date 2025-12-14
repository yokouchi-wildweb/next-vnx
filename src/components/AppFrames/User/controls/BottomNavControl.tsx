"use client";

import { useEffect } from "react";

import { useBottomNavVisibility } from "../contexts/BottomNavVisibilityContext";

export type HideBottomNavProps = {
  /** スマホでボトムナビを非表示にする */
  sp?: boolean;
  /** PCでボトムナビを非表示にする */
  pc?: boolean;
};

/**
 * ページ単位でボトムナビゲーションの表示/非表示を制御するコンポーネント
 *
 * @example
 * // 両方非表示（props未指定で両方非表示）
 * <HideBottomNav />
 *
 * @example
 * // スマホのみ非表示（デフォルトはスマホのみ表示なので、これで完全非表示になる）
 * <HideBottomNav sp />
 *
 * @example
 * // PCでも表示したい場合（ShowBottomNav的な使い方）
 * // → useBottomNavVisibilityを直接使用してください
 */
export const HideBottomNav = ({ sp, pc }: HideBottomNavProps) => {
  const { setVisibility, reset } = useBottomNavVisibility();

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

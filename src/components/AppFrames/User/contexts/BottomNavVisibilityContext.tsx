"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

export type BottomNavVisibility = {
  sp: boolean;
  pc: boolean;
};

type BottomNavVisibilityContextValue = {
  visibility: BottomNavVisibility;
  setVisibility: (visibility: Partial<BottomNavVisibility>) => void;
  reset: () => void;
};

// デフォルト: スマホのみ表示
const DEFAULT_VISIBILITY: BottomNavVisibility = {
  sp: true,
  pc: false,
};

const BottomNavVisibilityContext =
  createContext<BottomNavVisibilityContextValue | null>(null);

export const BottomNavVisibilityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [visibility, setVisibilityState] =
    useState<BottomNavVisibility>(DEFAULT_VISIBILITY);

  const setVisibility = useCallback((partial: Partial<BottomNavVisibility>) => {
    setVisibilityState((prev) => ({ ...prev, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setVisibilityState(DEFAULT_VISIBILITY);
  }, []);

  const value = useMemo(
    () => ({ visibility, setVisibility, reset }),
    [visibility, setVisibility, reset],
  );

  return (
    <BottomNavVisibilityContext.Provider value={value}>
      {children}
    </BottomNavVisibilityContext.Provider>
  );
};

export const useBottomNavVisibility = (): BottomNavVisibilityContextValue => {
  const context = useContext(BottomNavVisibilityContext);
  if (!context) {
    throw new Error(
      "useBottomNavVisibility must be used within BottomNavVisibilityProvider",
    );
  }
  return context;
};

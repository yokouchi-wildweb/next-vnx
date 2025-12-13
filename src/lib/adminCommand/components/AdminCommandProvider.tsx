// src/lib/adminCommand/components/AdminCommandProvider.tsx

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAuthSession } from "@/features/core/auth/hooks/useAuthSession";
import { AdminCommandPalette } from "./AdminCommandPalette";

type AdminCommandContextValue = {
  /** パレットを開く */
  openPalette: () => void;
  /** パレットを閉じる */
  closePalette: () => void;
  /** パレットの開閉状態を切り替える */
  togglePalette: () => void;
  /** パレットが開いているかどうか */
  isOpen: boolean;
};

const AdminCommandContext = createContext<AdminCommandContextValue | null>(null);

/**
 * 管理者コマンドの Context を利用するフック
 */
export function useAdminCommand(): AdminCommandContextValue {
  const context = useContext(AdminCommandContext);
  if (!context) {
    throw new Error("useAdminCommand must be used within AdminCommandProvider");
  }
  return context;
}

type AdminCommandProviderProps = {
  children: React.ReactNode;
};

/**
 * 管理者コマンドパレットの Provider
 * - ショートカットキー監視
 * - パレット表示制御
 * - コマンド登録の初期化
 */
export function AdminCommandProvider({ children }: AdminCommandProviderProps) {
  const { user } = useAuthSession();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  // ショートカットキーの監視
  useEffect(() => {
    if (!isAdmin) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + Alt + A (Windows/Linux)
      // Cmd + Shift + Option + A (Mac)
      const isMac = /mac/i.test(navigator.userAgent);
      const modifierKey = isMac ? e.metaKey : e.ctrlKey;

      if (modifierKey && e.shiftKey && e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdmin]);

  const openPalette = useCallback(() => setIsOpen(true), []);
  const closePalette = useCallback(() => setIsOpen(false), []);
  const togglePalette = useCallback(() => setIsOpen((prev) => !prev), []);

  const contextValue = useMemo<AdminCommandContextValue>(
    () => ({
      openPalette,
      closePalette,
      togglePalette,
      isOpen,
    }),
    [openPalette, closePalette, togglePalette, isOpen]
  );

  return (
    <AdminCommandContext.Provider value={contextValue}>
      {children}
      {isAdmin && <AdminCommandPalette open={isOpen} onOpenChange={setIsOpen} />}
    </AdminCommandContext.Provider>
  );
}

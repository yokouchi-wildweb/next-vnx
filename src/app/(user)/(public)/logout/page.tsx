// src/app/(user)/(public)/logout/page.tsx

"use client";

import { useEffect, useRef } from "react";

import { UserPage } from "@/components/AppFrames/User/Layout/UserPage";
import { Flex } from "@/components/Layout/Flex";
import { LogoutButton } from "@/features/core/auth/components/common/LogoutButton";
import { useLogout } from "@/features/core/auth/hooks/useLogout";

export default function LogoutPage() {
  const { logout, isLoading, error } = useLogout({ redirectTo: "/" });
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;
    logout();
  }, [logout]);

  return (
    <UserPage containerType="narrowStack">
      <Flex direction="column" justify="center" align="center" space="md">
        {error ? (
          <>
            <p>ログアウトに失敗しました</p>
            <LogoutButton redirectTo="/" />
          </>
        ) : (
          <p>{isLoading ? "ログアウト中..." : "リダイレクト中..."}</p>
        )}
      </Flex>
    </UserPage>
  );
}

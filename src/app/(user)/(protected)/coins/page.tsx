// src/app/(user)/(protected)/coins/page.tsx

import { UserPageTitle } from "@/components/AppFrames/User/Elements/PageTitle";
import { UserPage } from "@/components/AppFrames/User/Layout/UserPage";
import { UserBalance } from "@/features/core/wallet/components/UserBalance";

export default function CoinsPage() {
  return (
    <UserPage containerType="narrowStack" space="md">
      <UserPageTitle>コイン管理</UserPageTitle>
      <UserBalance balance={1000} label="コイン" />
    </UserPage>
  );
}

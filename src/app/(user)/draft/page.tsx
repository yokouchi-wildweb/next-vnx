import { UserPageTitle } from "@/components/AppFrames/User/Elements/PageTitle";
import { UserPage } from "@/components/AppFrames/User/Layout/UserPage";
import { Para } from "@/components/TextBlocks";
import { TunnelBackground } from "@/components/Background";

export default function ServicesPage() {
  return (
    <>
      <TunnelBackground preset="pentagonDeep" />
      <UserPage containerType="contentShell">
        <UserPageTitle>サービス概要</UserPageTitle>
        <Para>
          準備中
        </Para>
      </UserPage>
    </>
  );
}

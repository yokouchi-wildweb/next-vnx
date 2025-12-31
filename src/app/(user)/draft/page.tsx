import { UserPage } from "@/components/AppFrames/User/Layout/UserPage";
import { TunnelBackground } from "@/components/Background";
import { HeroSection } from "./HeroSection";

export default function DraftPage() {
  return (
    <>
      <TunnelBackground preset="pentagonDeep" />
      <UserPage containerType="full">
        <HeroSection />
      </UserPage>
    </>
  );
}

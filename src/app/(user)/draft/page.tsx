import { UserPage } from "@/components/AppFrames/User/Layout/UserPage";
import { TunnelBackground } from "@/components/Background";
import { HeroSection } from "./HeroSection";
import { FeatureCarousel } from "./FeatureCarousel";

export default function DraftPage() {
  return (
    <>
      <TunnelBackground preset="pentagonDeep" />
      <UserPage containerType="full">
        <HeroSection />
        <FeatureCarousel />
      </UserPage>
    </>
  );
}

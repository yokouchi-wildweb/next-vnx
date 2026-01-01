import { UserPage } from "@/components/AppFrames/User/Layout/UserPage";
import { TunnelBackground } from "@/components/Background";
import { HeroSection } from "./HeroSection";
import { ServiceAboutSection } from "./ServiceAboutSection";
import { HudFrameSection } from "./HudFrameSection";
import { AboutSection } from "./AboutSection";
import { CyberGridSection } from "./CyberGridSection";
import { FeatureCarousel } from "./FeatureCarousel";

export default function DraftPage() {
  return (
    <>
      <TunnelBackground preset="unicorn" />
      <UserPage containerType="contentShell" paddingInline="none">
        <HeroSection />
        <ServiceAboutSection />
        <HudFrameSection />
        <AboutSection />
        <CyberGridSection />
        <FeatureCarousel />
      </UserPage>
    </>
  );
}

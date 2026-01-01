import { UserPage } from "@/components/AppFrames/User/Layout/UserPage";
import { TunnelBackground } from "@/components/Background";
import { HeroSection } from "./HeroSection";
import { HudFrameSection } from "./HudFrameSection";
import { AboutSection } from "./AboutSection";
import { CyberGridSection } from "./CyberGridSection";
import { FeatureCarousel } from "./FeatureCarousel";

export default function DraftPage() {
  return (
    <>
      <TunnelBackground preset="darkNet" />
      <UserPage containerType=

                  "full" paddingInline="none">
        <HeroSection />
        <HudFrameSection variant="dark" accentColor="cyan" />
        <HudFrameSection variant="light" accentColor="pink" />
        <AboutSection />
        <CyberGridSection />
        <FeatureCarousel />
      </UserPage>
    </>
  );
}

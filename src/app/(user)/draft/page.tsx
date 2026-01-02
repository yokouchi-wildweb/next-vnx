import { UserPage } from "@/components/AppFrames/User/Layout/UserPage";
import { TunnelBackground } from "@/components/Background";
import { HeroSection } from "./HeroSection";
import { ServiceAboutSection } from "./ServiceAboutSection";
import { HudFrameSection } from "./HudFrameSection";
import { AboutSection } from "./AboutSection";
import { CyberGridSection } from "./CyberGridSection";
import { FeatureCarousel } from "./FeatureCarousel";
import { HideBottomNav } from "@/components/AppFrames/User/controls";

export default function DraftPage() {
  return (
    <>
      <HideBottomNav />
      <TunnelBackground preset="unicorn" />
      <UserPage containerType="full" paddingInline="none" className="pt-0 sm:pt-4">
        <div className="w-[72rem] mx-auto max-w-full">
          <HeroSection />
          <ServiceAboutSection />
          {/*<HudFrameSection />*/}
          {/*<AboutSection />*/}
          {/*<CyberGridSection />*/}
          <FeatureCarousel />

        </div>
      </UserPage>
    </>
  );
}

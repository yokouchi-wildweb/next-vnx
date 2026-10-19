// src/app/(user)/draft/_screen/DraftScreen.tsx
// トップページ案(ドラフト)の Screen。page.tsx は 1 行スイッチでここを参照する。

import { UserPage } from "@/components/AppFrames/User/Layout/UserPage";
import { TunnelBackground } from "../_components/TunnelBackground";
import { HeroSection } from "../HeroSection";
import { ServiceAboutSection } from "../ServiceAboutSection";
import { HudFrameSection } from "../HudFrameSection";
import { AboutSection } from "../AboutSection";
import { CyberGridSection } from "../CyberGridSection";
import { FeatureCarousel } from "../FeatureCarousel";
import { HideBottomNav } from "@/components/AppFrames/User/controls";

export function DraftScreen() {
  return (
    <>
      <HideBottomNav />
      <TunnelBackground preset="unicorn" />
      <UserPage containerType="wideShowcase" paddingInline="none" className="pt-0 sm:pt-4">
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

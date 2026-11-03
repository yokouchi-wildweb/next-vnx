// src/app/lab/004-tunnel-background/_screen/TunnelBackgroundScreen.tsx
// lab の Screen。loader(access の評価)を待ってから、クライアントの実験用モック(TunnelBackgroundView)を描く。

import type { ScreenProps } from "@/lib/screens/types";
import { loadTunnelBackgroundScreen } from "./loader";
import { TunnelBackgroundView } from "./TunnelBackgroundView";

export async function TunnelBackgroundScreen(props: ScreenProps) {
  await loadTunnelBackgroundScreen(props);
  return <TunnelBackgroundView />;
}

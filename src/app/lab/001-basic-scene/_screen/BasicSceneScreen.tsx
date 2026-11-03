// src/app/lab/001-basic-scene/_screen/BasicSceneScreen.tsx
// lab の Screen。loader(access の評価)を待ってから、クライアントの実験用モック(BasicSceneView)を描く。

import type { ScreenProps } from "@/lib/screens/types";
import { loadBasicSceneScreen } from "./loader";
import { BasicSceneView } from "./BasicSceneView";

export async function BasicSceneScreen(props: ScreenProps) {
  await loadBasicSceneScreen(props);
  return <BasicSceneView />;
}

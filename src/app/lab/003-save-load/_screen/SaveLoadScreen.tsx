// src/app/lab/003-save-load/_screen/SaveLoadScreen.tsx
// lab の Screen。loader(access の評価)を待ってから、クライアントの実験用モック(SaveLoadView)を描く。

import type { ScreenProps } from "@/lib/screens/types";
import { loadSaveLoadScreen } from "./loader";
import { SaveLoadView } from "./SaveLoadView";

export async function SaveLoadScreen(props: ScreenProps) {
  await loadSaveLoadScreen(props);
  return <SaveLoadView />;
}

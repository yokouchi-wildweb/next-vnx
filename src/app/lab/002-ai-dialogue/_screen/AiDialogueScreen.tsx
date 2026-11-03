// src/app/lab/002-ai-dialogue/_screen/AiDialogueScreen.tsx
// lab の Screen。loader(access の評価)を待ってから、クライアントの実験用モック(AiDialogueView)を描く。

import type { ScreenProps } from "@/lib/screens/types";
import { loadAiDialogueScreen } from "./loader";
import { AiDialogueView } from "./AiDialogueView";

export async function AiDialogueScreen(props: ScreenProps) {
  await loadAiDialogueScreen(props);
  return <AiDialogueView />;
}

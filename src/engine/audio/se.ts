// src/engine/audio/se.ts

import { Howl } from "howler"

/**
 * SE再生オプション
 */
type SeOptions = {
  /** 音量（0-1、デフォルト: 0.5） */
  volume?: number
  /** 再生速度（デフォルト: 1.0） */
  rate?: number
}

/**
 * SEを再生する
 *
 * SEは単発再生のため、グローバル状態管理不要。
 * 同時に複数のSEを再生可能。
 *
 * @param src - 音声ファイルのパス
 * @param options - 再生オプション
 * @returns Howlインスタンス（停止したい場合に使用）
 */
export function playSe(src: string, options: SeOptions = {}): Howl {
  const { volume = 0.5, rate = 1.0 } = options

  const howl = new Howl({
    src: [src],
    volume,
    rate,
  })

  howl.play()

  // 再生終了後に自動でunload
  howl.once("end", () => {
    howl.unload()
  })

  return howl
}

/**
 * 複数のSEを順番に再生する
 *
 * @param sources - 音声ファイルのパス配列
 * @param options - 再生オプション
 * @param delay - 各SE間の遅延（ms）
 */
export async function playSeSequence(
  sources: string[],
  options: SeOptions = {},
  delay = 0
): Promise<void> {
  for (const src of sources) {
    await new Promise<void>((resolve) => {
      const howl = playSe(src, options)
      howl.once("end", () => {
        setTimeout(resolve, delay)
      })
    })
  }
}

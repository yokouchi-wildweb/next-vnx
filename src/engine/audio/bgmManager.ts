// src/engine/audio/bgmManager.ts

import { Howl } from "howler"
import { bgmInternalStore } from "../stores/bgm"

/**
 * BGM再生オプション
 */
type BgmPlayOptions = {
  /** ループ再生（デフォルト: true） */
  loop?: boolean
  /** 音量（0-1、省略時はストアの値を使用） */
  volume?: number
}

/**
 * BgmManager - BGM再生ロジック
 *
 * Howler.js を使った実際の再生制御を担当。
 * 状態は stores/bgm で管理し、このクラスは実行時インスタンスのみ保持。
 */
class BgmManager {
  private howl: Howl | null = null

  /**
   * BGMを再生（既存があれば停止してから）
   */
  play(key: string, src: string, options: BgmPlayOptions = {}): void {
    const { loop = true, volume } = options
    const state = bgmInternalStore.getState()
    const effectiveVolume = volume ?? state.volume

    // 同じBGMが既に再生中なら何もしない
    if (state.currentBgmKey === key && state.isPlaying) {
      return
    }

    // 既存のBGMを停止
    this.cleanup()

    // 新しいBGMを作成・再生
    this.howl = new Howl({
      src: [src],
      loop,
      volume: effectiveVolume,
      html5: true, // 大きなファイルのストリーミング用
    })

    this.howl.play()

    bgmInternalStore.getState()._setState({
      currentBgmKey: key,
      volume: effectiveVolume,
      isPlaying: true,
    })
  }

  /**
   * BGMを停止
   */
  stop(): void {
    this.cleanup()
    bgmInternalStore.getState()._setState({
      currentBgmKey: null,
      isPlaying: false,
    })
  }

  /**
   * BGMを一時停止
   */
  pause(): void {
    if (this.howl) {
      this.howl.pause()
      bgmInternalStore.getState()._setState({ isPlaying: false })
    }
  }

  /**
   * BGMを再開
   */
  resume(): void {
    if (this.howl) {
      this.howl.play()
      bgmInternalStore.getState()._setState({ isPlaying: true })
    }
  }

  /**
   * 音量を設定
   */
  setVolume(volume: number): void {
    if (this.howl) {
      this.howl.volume(volume)
    }
    bgmInternalStore.getState().setVolume(volume)
  }

  /**
   * フェードアウトして停止
   */
  fadeOut(duration = 1000): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.howl) {
        resolve()
        return
      }

      const currentVolume = this.howl.volume()
      this.howl.fade(currentVolume, 0, duration)

      setTimeout(() => {
        this.stop()
        resolve()
      }, duration)
    })
  }

  /**
   * Howlインスタンスをクリーンアップ
   */
  private cleanup(): void {
    if (this.howl) {
      this.howl.stop()
      this.howl.unload()
      this.howl = null
    }
  }
}

/**
 * BGMマネージャーのシングルトンインスタンス
 */
export const bgmManager = new BgmManager()

/**
 * Lab 001: 基本シーン
 *
 * 目的: 背景 + 立ち絵 + 台詞表示の最小構成を実装
 * UI: チャットアプリ風メッセージ表示（革新的VN UI）
 *
 * 検証項目:
 * - PixiJS + Next.js SSR の統合
 * - 背景画像の表示（ぼかし + 暗めフィルター）
 * - キャラクター立ち絵の左右固定表示
 * - チャット風メッセージUI + スクロール
 * - 発言者強調（非発言者を暗く）
 * - BGM再生（Howler.js）
 *
 * 完了後の抽出先:
 * - src/engine/renderer/
 * - src/engine/ui/
 * - src/engine/stores/
 * - src/engine/audio/
 * - game/scenes/
 */
"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Application, Assets, Sprite, Container, BlurFilter, ColorMatrixFilter } from "pixi.js"

// Howler.jsはブラウザ専用（SSR時にimportするとエラー）
// 使用時に動的importする
type HowlType = import("howler").Howl

// ============================================================
// BGM定義（SceneCommandより先に定義が必要）
// ============================================================

type BGMKey = "main" | "tension"

const BGM_TRACKS: Record<BGMKey, { src: string; volume: number }> = {
  main: {
    src: "/game/assets/audio/存在しない街.mp3",
    volume: 0.5,
  },
  tension: {
    src: "/game/assets/audio/かたまる脳みそ.mp3",
    volume: 0.5,
  },
}

const BGM_FADE = {
  duration: 1500,  // フェード時間（ms）
}

const INITIAL_BGM: BGMKey = "main"

// ============================================================
// SE（効果音）定義
// ============================================================

type SEKey = "cheer" | "cold" | "jajaan" | "explosion"

const SE_TRACKS: Record<SEKey, { src: string; volume: number }> = {
  cheer: {
    src: "/game/assets/se/スタジアムの歓声1.mp3",
    volume: 0.7,
  },
  cold: {
    src: "/game/assets/se/「冷気よ！」.mp3",
    volume: 0.7,
  },
  jajaan: {
    src: "/game/assets/se/ジャジャーン.mp3",
    volume: 0.7,
  },
  explosion: {
    src: "/game/assets/se/爆発2.mp3",
    volume: 0.7,
  },
}

// ============================================================
// シーンコマンド定義（拡張可能）
// ============================================================

/**
 * シーンコマンド型定義
 * 新しいコマンドを追加する場合はここに型を追加
 */
type SceneCommand =
  | { type: "bgm"; value: BGMKey }                              // BGM変更
  | { type: "bgm_stop" }                                        // BGM停止
  | { type: "se"; value: SEKey }                                // 効果音再生
  // 以下は将来の拡張用（実装時にコメント解除）
  // | { type: "shake"; intensity?: number; duration?: number } // 画面揺れ
  // | { type: "flash"; color?: string; duration?: number }     // フラッシュ
  // | { type: "wait"; duration: number }                       // 待機
  // | { type: "background"; value: string }                    // 背景変更
  // | { type: "expression"; character: string; value: string } // 表情変更

// ============================================================
// キャラクター定義
// ============================================================

type CharacterId = "circus" | "tatsumi"

// キャラクター情報（名前・カラーを一元管理）
const CHARACTERS: Record<CharacterId, { name: string; color: string }> = {
  circus: { name: "サーカス", color: "#e63946" },      // 赤系
  tatsumi: { name: "妻夫木 達巳", color: "#4361ee" },  // 青系
}

// ============================================================
// ダイアログ定義
// ============================================================

interface Dialogue {
  speaker: CharacterId
  text: string
  commands?: SceneCommand[]  // このダイアログ表示時に実行するコマンド
}

// ダミーセリフデータ
const DIALOGUES: Dialogue[] = [
  { speaker: "circus", text: "ここが噂の教会か...。思っていたより立派な建物だな。" },
  { speaker: "tatsumi", text: "ああ、この地域では一番古い教会らしい。築200年以上だとか。" },
  { speaker: "circus", text: "それにしても、こんな場所に呼び出すとは...一体何の用なんだ？" },
  { speaker: "tatsumi", text: "まあ、そう急ぐな。少し話がしたかっただけさ。" },
  { speaker: "circus", text: "話？お前がわざわざ呼び出すなんて、ただ事じゃないだろう。" },
  {
    speaker: "tatsumi",
    text: "...実は、あの件について新しい情報が入ったんだ。",
  },
  {
    speaker: "circus",
    text: "なに…！？そんなに早く進展があったのか？",
  },
  {
    speaker: "tatsumi",
    text: "ああそうだ。",
  },
  {
    speaker: "tatsumi",
    text: "ここにきて、思わぬ収穫があった…",
  },
  {
    speaker: "tatsumi",
    text: "なんと…池袋に30名くらいまで余裕で収容できる格安のレンスペを見つけた！",
  },
  {
    speaker: "circus",
    text: "………",
  },
  {
    speaker: "circus",
    text: "ん、レンスペ？いったい何の話をしている。",
  },
  {
    speaker: "tatsumi",
    text: "だからレンスペだよ！パーティ会場。",
    commands: [{ type: "bgm", value: "tension" }],  // ← BGM変更コマンド
  },
  {
    speaker: "circus",
    text: "パーティーなんてしているヒマはない。早く事件について話せ。",
  },
  {
    speaker: "tatsumi",
    text: "そんなことより。クリスマスの話をしよう。",
  },
  {
    speaker: "circus",
    text: "なに…！？",
  },
  {
    speaker: "tatsumi",
    text: "そんなことより。クリスマスの話をしよう。",
  },
  {
    speaker: "circus",
    text: "別に聞き取れなかったわけではないぞ。",
  },
  {
    speaker: "circus",
    text: "それに、そんなこととはなんだ。ふざけてるのか！",
  },
  {
    speaker: "tatsumi",
    text: "うぅ…クリスマスパーティが…………",
  },
  {
    speaker: "tatsumi",
    text: "…………",
  },
  {
    speaker: "tatsumi",
    text: "したいだけなんだが！！！",
    commands: [{ type: "se", value: "jajaan" }],
  },
  {
    speaker: "circus",
    text: "だから、それが問題だと言っている。",
  },
  {
    speaker: "tatsumi",
    text: "あーはいはい！メリクリメリクリ！",
    commands: [{ type: "se", value: "cheer" }],  // ← SE再生コマンド
  },
  { speaker: "circus", text: "……待て。お前正気か？" },
  {
    speaker: "tatsumi",
    text: "それはそれとして、教会って寒くないか？暖房とかないしな…",
    commands: [{ type: "se", value: "cold" }],
  },
  { speaker: "circus", text: "おい、無理やりパーティ会場に案内しようとするな" },
  { speaker: "tatsumi", text: "神の前だからこそ正直に言うが、俺はまじめだ。" },
  { speaker: "circus", text: "だったら今おもむろに装着しだした、そのモサモサの付け髭と、とんがり帽子は何の真似だ？" },
  {
    speaker: "tatsumi",
    text: "雰囲気作り？鐘の音とか、ほら…それっぽいだろ。" ,
    commands: [{ type: "se", value: "cold" }],
  },
  { speaker: "circus", text: "だからパーティをしに来たわけでは…" },
  {
    speaker: "tatsumi",
    text: "まあまあ。クリスマスだし、心を清めようじゃないか。" ,
    commands: [{ type: "se", value: "cold" }],
  },
  { speaker: "circus", text: "心を清める前に今すぐ頭を冷やせ。" },
  { speaker: "tatsumi", text: "ひどいな。せっかくプレゼントも用意してるのに。" },
  { speaker: "circus", text: "……嫌な予感しかしないんだが。" },
  {
    speaker: "tatsumi",
    text: "安心しろ。ちゃんと\"爆発しない\"やつだ。",
    commands: [{ type: "se", value: "cheer" }],
  },
  { speaker: "circus", text: "爆発だと！？そんな可能性はもとより想定していな…" },
  {
    speaker: "circus",
    text: "（ドゴオオオーーーン）",
    commands: [{ type: "se", value: "explosion" }],
  },
  { speaker: "tatsumi", text: "爆発オチなんてサイテー……!" },
  { speaker: "circus", text: "オチが思いつかない場合に、とりあえず爆発させて無理やり終わらせる合理的な手段だ。" },
]

// アセットパス
const ASSETS = {
  background: "/game/assets/backgrounds/church/default.png",
  characters: {
    circus: "/game/assets/characters/circus_hartluhl/default.png",
    tatsumi: "/game/assets/characters/tsumabuki_tatsumi/default.png",
  },
}

// キャラクター位置設定
const CHARACTER_CONFIG = {
  circus: { side: "left" as const },
  tatsumi: { side: "right" as const },
}

// メッセージ領域配置設定
const MESSAGE_AREA = {
  topOffset: 0,       // 上端（画面上から %）
  bottomOffset: 35,   // 下端（画面下から %）
  width: 500,         // 幅（px）
  fadeTop: 20,        // 上部フェード終了位置（%）
  fadeBottom: 90,     // 下部フェード開始位置（%）
  paddingBottom: 40,  // 下部パディング（px）
}

// キャラクター透明度設定
const CHARACTER_ALPHA = {
  active: 1.0,    // アクティブ（発言中）
  inactive: 0.7,  // 非アクティブ
}

// キャラクター名表示設定
const CHARACTER_NAME_DISPLAY = {
  bottomOffset: 8,        // 画面下からの距離（%）
  leftCharacterX: 18,     // 左キャラの名前X位置（画面左から%）
  rightCharacterX: 82,    // 右キャラの名前X位置（画面左から%）
  textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 0 8px rgba(0,0,0,0.8)",  // テキストシャドウ（アウトライン + ぼかし）
}

// 立ち絵下の名前アンダーライン設定
const STANDING_NAME_UNDERLINE = {
  width: 3,                 // ラインの太さ（px）
}

// メッセージボックス上の名前アンダーライン設定
const MESSAGE_NAME_UNDERLINE = {
  width: 3,                 // ラインの太さ（px）
  gap: 6,                   // 名前とラインの間隔（px）
  shimmerSpeed: 3.5,        // シマーが流れる速度（秒）- 小さいほど速い
}

// 次へインジケーター設定（テキスト末尾のダイヤモンド）
const NEXT_INDICATOR = {
  symbol: "◆",              // 表示するシンボル
  size: "text-xs",          // サイズ（Tailwindクラス）
  baselineOffset: 2,        // ベースラインオフセット（px）- 正で下、負で上
  bounceDuration: 1.2,      // バウンドアニメーション周期（秒）
  bounceHeight: 3,          // バウンドの高さ（px）
  pulseDuration: 2.1,       // 明滅アニメーション周期（秒）
  minOpacity: 0.4,          // 明滅時の最小不透明度
}

// 下部オーバーレイ設定（システムパネル領域）
const BOTTOM_OVERLAY = {
  height: 20,             // 高さ（画面下から%）
  opacity: 1,           // 不透明度（0-1）
  color: "0, 0, 0",       // RGB値（カンマ区切り）
}

// ============================================================
// BGM管理フック
// ============================================================

/**
 * BGM管理フック
 * - シーン開始時に自動再生（ループ）
 * - changeBGM()でクロスフェード切り替え
 * - アンマウント時に自動停止
 */
function useBGM() {
  const currentHowlRef = useRef<HowlType | null>(null)
  const currentKeyRef = useRef<BGMKey | null>(null)
  const howlerRef = useRef<typeof import("howler") | null>(null)
  const isMountedRef = useRef(true)

  // BGMを再生（内部用）
  const playBGM = useCallback(async (key: BGMKey, fadeIn: boolean = true) => {
    // 既存のBGMを先に停止（二重再生防止）
    if (currentHowlRef.current) {
      currentHowlRef.current.stop()
      currentHowlRef.current.unload()
      currentHowlRef.current = null
    }

    // Howler.jsを動的インポート（ブラウザ環境でのみ）
    if (!howlerRef.current) {
      howlerRef.current = await import("howler")
    }
    const { Howl } = howlerRef.current

    const track = BGM_TRACKS[key]
    const howl = new Howl({
      src: [track.src],
      loop: true,
      volume: 0,  // 常に0から開始
      onload: () => {
        // マウント解除後やBGM切り替え後は再生しない
        if (!isMountedRef.current || currentHowlRef.current !== howl) {
          howl.unload()
          return
        }
        // ロード完了後に再生開始
        howl.play()
        if (fadeIn) {
          howl.fade(0, track.volume, BGM_FADE.duration)
        } else {
          howl.volume(track.volume)
        }
      },
    })

    currentHowlRef.current = howl
    currentKeyRef.current = key
  }, [])

  // BGMを切り替え（クロスフェード）
  const changeBGM = useCallback((newKey: BGMKey) => {
    // 同じBGMなら何もしない
    if (currentKeyRef.current === newKey) return

    const oldHowl = currentHowlRef.current

    // 新しいBGMを開始（フェードイン）
    playBGM(newKey, true)

    // 古いBGMをフェードアウトして停止
    if (oldHowl) {
      const currentVolume = oldHowl.volume()
      oldHowl.fade(currentVolume, 0, BGM_FADE.duration)
      setTimeout(() => {
        oldHowl.stop()
        oldHowl.unload()
      }, BGM_FADE.duration)
    }
  }, [playBGM])

  // BGMを停止
  const stopBGM = useCallback((fadeOut: boolean = true) => {
    const howl = currentHowlRef.current
    if (!howl) return

    if (fadeOut) {
      const currentVolume = howl.volume()
      howl.fade(currentVolume, 0, BGM_FADE.duration)
      setTimeout(() => {
        howl.stop()
        howl.unload()
        currentHowlRef.current = null
        currentKeyRef.current = null
      }, BGM_FADE.duration)
    } else {
      howl.stop()
      howl.unload()
      currentHowlRef.current = null
      currentKeyRef.current = null
    }
  }, [])

  // アンマウント時に停止
  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      // アンマウント時は即座に停止（フェードなし）
      if (currentHowlRef.current) {
        currentHowlRef.current.stop()
        currentHowlRef.current.unload()
        currentHowlRef.current = null
      }
    }
  }, [])

  return {
    playBGM,     // 初回再生用に公開
    changeBGM,
    stopBGM,
    currentBGM: currentKeyRef.current,
  }
}

// ============================================================
// SE（効果音）再生関数
// ============================================================

/**
 * 効果音を再生する（ワンショット）
 * BGMと異なり状態管理不要なのでシンプルな関数として実装
 */
async function playSE(key: SEKey) {
  // Howler.jsを動的インポート（ブラウザ環境でのみ）
  const { Howl } = await import("howler")

  const track = SE_TRACKS[key]
  const howl = new Howl({
    src: [track.src],
    volume: track.volume,
  })
  howl.play()
}

// ============================================================
// コマンドハンドラ型定義
// ============================================================

/**
 * コマンドハンドラのマップ型
 * 新しいコマンドを追加する場合、ここにハンドラを定義
 */
type CommandHandlers = {
  [K in SceneCommand["type"]]: (
    command: Extract<SceneCommand, { type: K }>
  ) => void
}

// ============================================================
// コマンド実行フック
// ============================================================

/**
 * シーンコマンド実行フック
 * ダイアログ表示時にコマンドを実行する
 *
 * @param handlers コマンドタイプごとのハンドラ関数
 * @returns executeCommands - コマンド配列を実行する関数
 */
function useCommandExecutor(handlers: CommandHandlers) {
  const executeCommands = useCallback(
    (commands: SceneCommand[] | undefined) => {
      if (!commands || commands.length === 0) return

      for (const command of commands) {
        const handler = handlers[command.type] as (cmd: SceneCommand) => void
        if (handler) {
          handler(command)
        } else {
          console.warn(`Unknown command type: ${command.type}`)
        }
      }
    },
    [handlers]
  )

  return { executeCommands }
}

export default function BasicScenePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<Application | null>(null)
  const spritesRef = useRef<{ circus: Sprite | null; tatsumi: Sprite | null }>({
    circus: null,
    tatsumi: null,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [displayedMessages, setDisplayedMessages] = useState<Dialogue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSpeaker, setCurrentSpeaker] = useState<CharacterId | null>(null)

  // BGM管理（クリックして開始時に再生開始）
  const { playBGM, changeBGM, stopBGM } = useBGM()

  // コマンドハンドラ定義（新しいコマンドはここに追加）
  const commandHandlers: CommandHandlers = {
    bgm: (cmd) => changeBGM(cmd.value),
    bgm_stop: () => stopBGM(),
    se: (cmd) => playSE(cmd.value),
    // 将来の拡張例:
    // shake: (cmd) => shakeScreen(cmd.intensity, cmd.duration),
    // flash: (cmd) => flashScreen(cmd.color, cmd.duration),
  }

  // コマンド実行フック
  const { executeCommands } = useCommandExecutor(commandHandlers)

  const isLastDialogue = dialogueIndex >= DIALOGUES.length

  // 次のセリフへ進む
  const handleAdvance = useCallback(() => {
    if (dialogueIndex < DIALOGUES.length) {
      // 初回クリック時にBGM開始
      if (dialogueIndex === 0) {
        playBGM(INITIAL_BGM, true)
      }

      const newDialogue = DIALOGUES[dialogueIndex]
      setDisplayedMessages((prev) => [...prev, newDialogue])
      setCurrentSpeaker(newDialogue.speaker)
      setDialogueIndex((prev) => prev + 1)

      // ダイアログに紐づくコマンドを実行
      executeCommands(newDialogue.commands)
    }
  }, [dialogueIndex, executeCommands, playBGM])

  // メッセージ追加時に自動スクロール（instantでframer-motionのlayoutアニメーションと競合を避ける）
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" })
  }, [displayedMessages])

  // 発言者に応じてキャラクターのエフェクトを更新
  useEffect(() => {
    const { circus, tatsumi } = spritesRef.current
    if (!circus || !tatsumi) return

    const applyEffect = (sprite: Sprite, isActive: boolean) => {
      sprite.alpha = isActive ? CHARACTER_ALPHA.active : CHARACTER_ALPHA.inactive
    }

    if (currentSpeaker === "circus") {
      applyEffect(circus, true)
      applyEffect(tatsumi, false)
    } else if (currentSpeaker === "tatsumi") {
      applyEffect(circus, false)
      applyEffect(tatsumi, true)
    } else {
      applyEffect(circus, true)
      applyEffect(tatsumi, true)
    }
  }, [currentSpeaker])

  // PixiJS 初期化
  useEffect(() => {
    if (!containerRef.current) return

    let mounted = true
    const container = containerRef.current

    const initPixi = async () => {
      // Application 作成
      const app = new Application()
      await app.init({
        width: 1280,
        height: 720,
        backgroundColor: 0x000000,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      })

      if (!mounted) {
        app.destroy(true)
        return
      }

      appRef.current = app
      container.appendChild(app.canvas)

      // アセットロード
      const [bgTexture, circusTexture, tatsumiTexture] = await Promise.all([
        Assets.load(ASSETS.background),
        Assets.load(ASSETS.characters.circus),
        Assets.load(ASSETS.characters.tatsumi),
      ])

      if (!mounted) {
        app.destroy(true)
        return
      }

      // 背景（ぼかし + 暗めフィルター）
      const background = new Sprite(bgTexture)
      background.width = app.screen.width
      background.height = app.screen.height

      // ぼかしフィルター
      const blurFilter = new BlurFilter({
        strength: 4,
        quality: 4,
      })

      // 暗めフィルター
      const colorMatrix = new ColorMatrixFilter()
      colorMatrix.brightness(0.6, false)

      background.filters = [blurFilter, colorMatrix]
      app.stage.addChild(background)

      // キャラクターコンテナ
      const charactersContainer = new Container()
      app.stage.addChild(charactersContainer)

      // キャラクター配置設定
      const characterWidthRatio = 0.4 // 画面幅の30%
      const verticalPullUp = 0.8 // 画面高さの80%上に引き上げ
      const horizontalOverflow = 0.1 // 幅の10%を画面外に見切れさせる

      // マーカス（左側）
      const circus = new Sprite(circusTexture)
      const circusTargetWidth = app.screen.width * characterWidthRatio
      const circusScale = circusTargetWidth / circusTexture.width
      circus.scale.set(circusScale)
      circus.anchor.set(0, 0) // 左上基準
      circus.x = -circusTargetWidth * horizontalOverflow // 少し左に見切れ
      circus.y = app.screen.height - (app.screen.height * verticalPullUp) // top 100%から80%上へ
      charactersContainer.addChild(circus)
      spritesRef.current.circus = circus

      // 辻吹（右側）
      const tatsumi = new Sprite(tatsumiTexture)
      const tatsumiTargetWidth = app.screen.width * characterWidthRatio
      const tatsumiScale = tatsumiTargetWidth / tatsumiTexture.width
      tatsumi.scale.set(tatsumiScale)
      tatsumi.anchor.set(1, 0) // 右上基準
      tatsumi.x = app.screen.width + tatsumiTargetWidth * horizontalOverflow // 少し右に見切れ
      tatsumi.y = app.screen.height - (app.screen.height * verticalPullUp) // top 100%から80%上へ
      charactersContainer.addChild(tatsumi)
      spritesRef.current.tatsumi = tatsumi

      setIsLoading(false)
    }

    initPixi()

    return () => {
      mounted = false
      if (appRef.current) {
        appRef.current.destroy(true)
        appRef.current = null
      }
    }
  }, [])

  // 吹き出しのスタイルを取得
  const getBubbleStyle = (speaker: CharacterId) => {
    const side = CHARACTER_CONFIG[speaker].side
    return {
      alignSelf: side === "left" ? "flex-start" : "flex-end",
      marginLeft: side === "left" ? "0" : "auto",
      marginRight: side === "right" ? "0" : "auto",
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div
        className="relative cursor-pointer"
        style={{ width: 1280, height: 720 }}
        onClick={handleAdvance}
      >
        {/* PixiJS Canvas コンテナ */}
        <div ref={containerRef} className="absolute inset-0" />

        {/* ローディング表示 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <p className="text-white text-xl">Loading...</p>
          </div>
        )}

        {/* キャラクター名前表示 */}
        {!isLoading && (
          <>
            {/* 左キャラ名（マーカス） */}
            <div
              className="absolute z-30 -translate-x-1/2"
              style={{
                bottom: `${CHARACTER_NAME_DISPLAY.bottomOffset}%`,
                left: `${CHARACTER_NAME_DISPLAY.leftCharacterX}%`,
              }}
            >
              <span
                className="inline-block px-3 py-1 text-lg font-bold text-white"
                style={{
                  borderBottom: `${STANDING_NAME_UNDERLINE.width}px solid ${CHARACTERS.circus.color}`,
                  textShadow: CHARACTER_NAME_DISPLAY.textShadow,
                }}
              >
                {CHARACTERS.circus.name}
              </span>
            </div>

            {/* 右キャラ名（妻夫木） */}
            <div
              className="absolute z-30 -translate-x-1/2"
              style={{
                bottom: `${CHARACTER_NAME_DISPLAY.bottomOffset}%`,
                left: `${CHARACTER_NAME_DISPLAY.rightCharacterX}%`,
              }}
            >
              <span
                className="inline-block px-3 py-1 text-lg font-bold text-white"
                style={{
                  borderBottom: `${STANDING_NAME_UNDERLINE.width}px solid ${CHARACTERS.tatsumi.color}`,
                  textShadow: CHARACTER_NAME_DISPLAY.textShadow,
                }}
              >
                {CHARACTERS.tatsumi.name}
              </span>
            </div>
          </>
        )}

        {/* 下部オーバーレイ（システムパネル領域） */}
        {!isLoading && (
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: `${BOTTOM_OVERLAY.height}%`,
              background: `linear-gradient(to top, rgba(${BOTTOM_OVERLAY.color},${BOTTOM_OVERLAY.opacity}) 0%, transparent 100%)`,
              zIndex: 25,
            }}
          />
        )}

        {/* 中央メッセージ領域 */}
        {!isLoading && (
          <div
            className="absolute inset-x-0 flex items-end justify-center z-20 pointer-events-none"
            style={{
              top: `${MESSAGE_AREA.topOffset}%`,
              bottom: `${MESSAGE_AREA.bottomOffset}%`,
            }}
          >
            <div
              className="max-h-full overflow-y-auto pointer-events-auto px-4 [&::-webkit-scrollbar]:hidden"
              style={{
                width: MESSAGE_AREA.width,
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE/Edge
                WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black ${MESSAGE_AREA.fadeTop}%, black ${MESSAGE_AREA.fadeBottom}%, transparent 100%)`,
                maskImage: `linear-gradient(to bottom, transparent 0%, black ${MESSAGE_AREA.fadeTop}%, black ${MESSAGE_AREA.fadeBottom}%, transparent 100%)`,
              }}
            >
              {/* 内部コンテナ: 下揃え用 */}
              <div
                className="min-h-full flex flex-col justify-end gap-3 pt-6"
                style={{ paddingBottom: `${MESSAGE_AREA.paddingBottom}px` }}
              >
              {/* メッセージ一覧 */}
              <AnimatePresence>
                {displayedMessages.map((msg, index) => {
                  const isLatest = index === displayedMessages.length - 1
                  const side = CHARACTER_CONFIG[msg.speaker].side

                  return (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: isLatest ? 1 : 0.7, y: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                        layout: { duration: 0.3, ease: "easeOut" }
                      }}
                      className="flex flex-col gap-1"
                      style={getBubbleStyle(msg.speaker)}
                    >
                      {/* 発言者名 */}
                      <div className={`relative inline-block ${side === "left" ? "text-left" : "text-right"}`}>
                        <span
                          className="inline-block text-base font-bold"
                          style={{
                            color: "rgba(255,255,255,0.9)",
                            textShadow: CHARACTER_NAME_DISPLAY.textShadow,
                            paddingBottom: `${MESSAGE_NAME_UNDERLINE.gap}px`,
                          }}
                        >
                          {CHARACTERS[msg.speaker].name}
                        </span>
                        {/* アンダーライン + シマーエフェクト */}
                        <div
                          className="absolute bottom-0 left-0 right-0 overflow-hidden"
                          style={{
                            height: `${MESSAGE_NAME_UNDERLINE.width}px`,
                            backgroundColor: CHARACTERS[msg.speaker].color,
                          }}
                        >
                          {isLatest && (
                            <div
                              className="absolute inset-0 animate-shimmer"
                              style={{
                                background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)`,
                                backgroundSize: "200% 100%",
                                animationDuration: `${MESSAGE_NAME_UNDERLINE.shimmerSpeed}s`,
                                animationDirection: side === "right" ? "reverse" : "normal",
                              }}
                            />
                          )}
                        </div>
                      </div>

                      {/* 吹き出し */}
                      <div
                        className={`w-[350px] px-4 py-3 rounded-2xl bg-gray-800/80 ${
                          side === "left" ? "rounded-tl-sm" : "rounded-tr-sm"
                        }`}
                      >
                        <p className="text-white text-base leading-relaxed">
                          {msg.text}
                          {/* 次へインジケーター（アクティブ時のみ） */}
                          {isLatest && (
                            <motion.span
                              className={`inline-block ml-2 ${NEXT_INDICATOR.size}`}
                              style={{
                                color: CHARACTERS[msg.speaker].color,
                                position: "relative",
                                top: `${NEXT_INDICATOR.baselineOffset}px`,
                              }}
                              animate={{
                                y: [0, -NEXT_INDICATOR.bounceHeight, 0],
                                opacity: [1, NEXT_INDICATOR.minOpacity, 1],
                              }}
                              transition={{
                                y: {
                                  duration: NEXT_INDICATOR.bounceDuration,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                },
                                opacity: {
                                  duration: NEXT_INDICATOR.pulseDuration,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                },
                              }}
                            >
                              {NEXT_INDICATOR.symbol}
                            </motion.span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {/* スクロール位置用 */}
              <div ref={messagesEndRef} />

              {/* 初期表示（メッセージがない時） */}
              {displayedMessages.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center animate-pulse">
                    <p className="text-white/50 text-lg">クリックして開始</p>
                    <p className="text-white/30 text-sm">BGMが流れます</p>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        )}

        {/* 進行インジケーター */}
        {!isLoading && displayedMessages.length > 0 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30">
            {!isLastDialogue ? (
              <span className="text-white/60 text-sm animate-pulse">
                ▼ クリックで次へ
              </span>
            ) : (
              <span className="text-white/40 text-sm">— END —</span>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

/**
 * Lab 001: 基本シーン
 *
 * 目的: 背景 + 立ち絵 + 台詞表示の最小構成を実装
 * UI: チャットアプリ風メッセージ表示（革新的VN UI）
 *
 * 検証項目:
 * - @pixi/react + Next.js SSR の統合
 * - 背景画像の表示（ぼかし + 暗めフィルター）
 * - キャラクター立ち絵の左右固定表示
 * - チャット風メッセージUI + スクロール
 * - 発言者強調（非発言者を暗く）
 * - BGM再生（Howler.js）
 * - 完全レスポンシブ対応（FullScreen + 相対レイアウト）
 *
 * 完了後の抽出先:
 * - src/engine/renderer/
 * - src/engine/ui/
 * - src/engine/stores/
 * - src/engine/audio/
 * - game/scenes/
 */
"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Application, extend, useApplication } from "@pixi/react"
import { Container, Sprite, BlurFilter, ColorMatrixFilter, Texture, Assets } from "pixi.js"
import FullScreen from "@/components/Layout/FullScreen"
import { useViewportSize } from "@/stores/useViewportSize"
import MessageBubble from "./components/MessageBubble"
import CharacterSprite from "./components/CharacterSprite"
import { character, background, bgm, se } from "@/engine/utils/assetResolver"
import { defaultMessageBubbleStyle } from "./components/MessageBubble/defaults"

// PixiJSコンポーネントを登録
extend({ Container, Sprite })

// Howler.jsはブラウザ専用（SSR時にimportするとエラー）
// 使用時に動的importする
type HowlType = import("howler").Howl

// ============================================================
// BGM定義（SceneCommandより先に定義が必要）
// ============================================================

type BGMKey = "main" | "tension"

const BGM_TRACKS: Record<BGMKey, { id: string; volume: number }> = {
  main: {
    id: "存在しない街",
    volume: 0.5,
  },
  tension: {
    id: "かたまる脳みそ",
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

const SE_TRACKS: Record<SEKey, { id: string; volume: number }> = {
  cheer: {
    id: "スタジアムの歓声1",
    volume: 0.7,
  },
  cold: {
    id: "「冷気よ！」",
    volume: 0.7,
  },
  jajaan: {
    id: "ジャジャーン",
    volume: 0.7,
  },
  explosion: {
    id: "爆発2",
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

// シナリオID
const SCENARIO_ID = "_sample"

// アセットパス（シナリオ固有アセットは scenarios/ 配下）
const ASSETS = {
  background: background(SCENARIO_ID, "church/default"),
  characters: {
    circus: character(SCENARIO_ID, "circus_hartluhl/default"),
    tatsumi: character(SCENARIO_ID, "tsumabuki_tatsumi/default"),
  },
}

// キャラクター位置設定
const CHARACTER_CONFIG = {
  circus: { side: "left" as const },
  tatsumi: { side: "right" as const },
}

// メッセージ領域配置設定（すべて相対値）
const MESSAGE_AREA = {
  topOffset: 0,       // 上端（画面上から %）
  bottomOffset: 35,   // 下端（画面下から %）
  widthPercent: 40,   // 幅（画面幅の %）
  minWidth: 300,      // 最小幅（px）
  maxWidth: 600,      // 最大幅（px）
  fadeTop: 20,        // 上部フェード終了位置（%）
  fadeBottom: 90,     // 下部フェード開始位置（%）
  paddingBottomPercent: 5,  // 下部パディング（画面高さの %）
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

    // アセットパスを解決
    const src = await bgm(track.id)
    if (!src) {
      console.warn(`BGMアセットが見つかりません: ${track.id}`)
      return
    }

    const howl = new Howl({
      src: [src],
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

  // アセットパスを解決
  const src = await se(track.id)
  if (!src) {
    console.warn(`SEアセットが見つかりません: ${track.id}`)
    return
  }

  const howl = new Howl({
    src: [src],
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

// ============================================================
// PixiJS 背景スプライトコンポーネント
// ============================================================

interface BackgroundSpriteProps {
  texture: Texture
  screenWidth: number
  screenHeight: number
}

/**
 * 背景スプライト（ぼかし + 暗めフィルター適用）
 */
function BackgroundSprite({
  texture,
  screenWidth,
  screenHeight,
}: BackgroundSpriteProps) {
  // フィルターをメモ化
  const filters = useMemo(() => {
    const blurFilter = new BlurFilter({
      strength: 4,
      quality: 4,
    })
    const colorMatrix = new ColorMatrixFilter()
    colorMatrix.brightness(0.6, false)
    return [blurFilter, colorMatrix]
  }, [])

  // Cover方式でサイズ計算
  const bgAspect = texture.width / texture.height
  const screenAspect = screenWidth / screenHeight

  let width: number, height: number
  if (screenAspect > bgAspect) {
    // 画面が横長: 幅に合わせる
    width = screenWidth
    height = screenWidth / bgAspect
  } else {
    // 画面が縦長: 高さに合わせる
    height = screenHeight
    width = screenHeight * bgAspect
  }

  // 中央配置
  const x = (screenWidth - width) / 2
  const y = (screenHeight - height) / 2

  return (
    <pixiSprite
      texture={texture}
      x={x}
      y={y}
      width={width}
      height={height}
      filters={filters}
    />
  )
}

// ============================================================
// PixiJS シーンコンテナ
// ============================================================

interface SceneContainerProps {
  currentSpeaker: CharacterId | null
  onReady: () => void
}

interface LoadedAssets {
  background: Texture
  circus: Texture
  tatsumi: Texture
}

/**
 * シーン全体を管理するPixiJSコンテナ
 * Assets.loadでアセットをロード
 */
function SceneContainer({ currentSpeaker, onReady }: SceneContainerProps) {
  const { app } = useApplication()
  const { width: viewportWidth, height: viewportHeight } = useViewportSize()
  const [assets, setAssets] = useState<LoadedAssets | null>(null)

  // 実際の画面サイズ（ビューポートサイズがまだ0の場合はappサイズを使用）
  const screenWidth = viewportWidth || app.screen.width
  const screenHeight = viewportHeight || app.screen.height

  // アセットをロード
  useEffect(() => {
    let mounted = true

    const loadAssets = async () => {
      const [bgTexture, circusTexture, tatsumiTexture] = await Promise.all([
        Assets.load(ASSETS.background),
        Assets.load(ASSETS.characters.circus),
        Assets.load(ASSETS.characters.tatsumi),
      ])

      if (!mounted) return

      setAssets({
        background: bgTexture,
        circus: circusTexture,
        tatsumi: tatsumiTexture,
      })
      onReady()
    }

    loadAssets()

    return () => {
      mounted = false
    }
  }, [onReady])

  // ビューポートサイズ変更時にrendererをリサイズ
  useEffect(() => {
    if (viewportWidth > 0 && viewportHeight > 0 && app.renderer) {
      app.renderer.resize(viewportWidth, viewportHeight)
    }
  }, [app, viewportWidth, viewportHeight])

  if (!assets) {
    return null
  }

  return (
    <pixiContainer>
      {/* 背景 */}
      <BackgroundSprite
        texture={assets.background}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
      />

      {/* キャラクターコンテナ */}
      <pixiContainer>
        {/* サーカス（左側） */}
        <CharacterSprite
          texture={assets.circus}
          side="left"
          isActive={currentSpeaker === "circus" || currentSpeaker === null}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
        />

        {/* 妻夫木（右側） */}
        <CharacterSprite
          texture={assets.tatsumi}
          side="right"
          isActive={currentSpeaker === "tatsumi" || currentSpeaker === null}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
        />
      </pixiContainer>
    </pixiContainer>
  )
}

// ============================================================
// メインページコンポーネント
// ============================================================

export default function BasicScenePage() {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [displayedMessages, setDisplayedMessages] = useState<Dialogue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSpeaker, setCurrentSpeaker] = useState<CharacterId | null>(null)

  // ビューポートサイズを取得（FullScreenが更新する）
  const { width: viewportWidth, height: viewportHeight } = useViewportSize()

  // BGM管理（クリックして開始時に再生開始）
  const { playBGM, changeBGM, stopBGM } = useBGM()

  // コマンドハンドラ定義（新しいコマンドはここに追加）
  const commandHandlers: CommandHandlers = useMemo(() => ({
    bgm: (cmd) => changeBGM(cmd.value),
    bgm_stop: () => stopBGM(),
    se: (cmd) => playSE(cmd.value),
    // 将来の拡張例:
    // shake: (cmd) => shakeScreen(cmd.intensity, cmd.duration),
    // flash: (cmd) => flashScreen(cmd.color, cmd.duration),
  }), [changeBGM, stopBGM])

  // コマンド実行フック
  const { executeCommands } = useCommandExecutor(commandHandlers)

  const isLastDialogue = dialogueIndex >= DIALOGUES.length

  // PixiJSシーンの準備完了
  const handleSceneReady = useCallback(() => {
    setIsLoading(false)
  }, [])

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

  return (
    <FullScreen layer="base" className="bg-black">
      <div
        className="relative w-full h-full cursor-pointer"
        onClick={handleAdvance}
      >
        {/* @pixi/react Application */}
        <div className="absolute inset-0">
          {viewportWidth > 0 && viewportHeight > 0 && (
            <Application
              width={viewportWidth}
              height={viewportHeight}
              backgroundColor={0x000000}
              resolution={typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1}
              autoDensity
            >
              <SceneContainer
                currentSpeaker={currentSpeaker}
                onReady={handleSceneReady}
              />
            </Application>
          )}
        </div>

        {/* ローディング表示 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <p className="text-white text-xl">Loading...</p>
          </div>
        )}

        {/* キャラクター名前表示 */}
        {!isLoading && (
          <>
            {/* 左キャラ名（サーカス） */}
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
                width: `clamp(${MESSAGE_AREA.minWidth}px, ${MESSAGE_AREA.widthPercent}%, ${MESSAGE_AREA.maxWidth}px)`,
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE/Edge
                WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black ${MESSAGE_AREA.fadeTop}%, black ${MESSAGE_AREA.fadeBottom}%, transparent 100%)`,
                maskImage: `linear-gradient(to bottom, transparent 0%, black ${MESSAGE_AREA.fadeTop}%, black ${MESSAGE_AREA.fadeBottom}%, transparent 100%)`,
              }}
            >
              {/* 内部コンテナ: 下揃え用 */}
              <div
                className="min-h-full flex flex-col justify-end pt-6"
                style={{
                  gap: `${defaultMessageBubbleStyle.gap}px`,
                  paddingBottom: `${MESSAGE_AREA.paddingBottomPercent}%`,
                }}
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
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                        layout: { duration: 0.3, ease: "easeOut" }
                      }}
                      style={{
                        width: `${defaultMessageBubbleStyle.widthPercent}%`,
                        alignSelf: side === "left" ? "flex-start" : "flex-end",
                      }}
                    >
                      <MessageBubble
                        speakerName={CHARACTERS[msg.speaker].name}
                        speakerColor={CHARACTERS[msg.speaker].color}
                        text={msg.text}
                        side={side}
                        isLatest={isLatest}
                        opacity={isLatest ? 1 : 0.7}
                      />
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
          <div className="absolute left-1/2 -translate-x-1/2 z-30" style={{ bottom: "10%" }}>
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
    </FullScreen>
  )
}

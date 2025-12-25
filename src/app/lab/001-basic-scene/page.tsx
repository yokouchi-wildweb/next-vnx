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
 *
 * 完了後の抽出先:
 * - src/engine/renderer/
 * - src/engine/ui/
 * - src/engine/stores/
 * - game/scenes/
 */
"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Application, Assets, Sprite, Container, BlurFilter, ColorMatrixFilter } from "pixi.js"

// キャラクター定義
type CharacterId = "marcus" | "tatsumi"

// キャラクター情報（名前・カラーを一元管理）
const CHARACTERS: Record<CharacterId, { name: string; color: string }> = {
  marcus: { name: "マーカス", color: "#e63946" },      // 赤系
  tatsumi: { name: "妻夫木 龍己", color: "#4361ee" },  // 青系
}

interface Dialogue {
  speaker: CharacterId
  text: string
}

// ダミーセリフデータ（6つ）
const DIALOGUES: Dialogue[] = [
  { speaker: "marcus", text: "ここが噂の教会か...。思っていたより立派な建物だな。" },
  { speaker: "tatsumi", text: "ああ、この地域では一番古い教会らしい。築200年以上だとか。" },
  { speaker: "marcus", text: "それにしても、こんな場所に呼び出すとは...一体何の用なんだ？" },
  { speaker: "tatsumi", text: "まあ、そう急ぐな。少し話がしたかっただけさ。" },
  { speaker: "marcus", text: "話？お前がわざわざ呼び出すなんて、ただ事じゃないだろう。" },
  { speaker: "tatsumi", text: "...実は、あの件について新しい情報が入ったんだ。" },
  { speaker: "marcus", text: "そんなことより。クリスマスの話をしよう。" },
  { speaker: "tatsumi", text: "ああそうだったな！メリクリメリクリ！" },
]

// アセットパス
const ASSETS = {
  background: "/game/assets/backgrounds/church/default.png",
  characters: {
    marcus: "/game/assets/characters/marcus_hartluhl/default.png",
    tatsumi: "/game/assets/characters/tsumabuki_tatsumi/default.png",
  },
}

// キャラクター位置設定
const CHARACTER_CONFIG = {
  marcus: { side: "left" as const },
  tatsumi: { side: "right" as const },
}

// メッセージ領域配置設定
const MESSAGE_AREA = {
  topOffset: 0,      // 上端（画面上から %）
  bottomOffset: 35,   // 下端（画面下から %）
  width: 500,         // 幅（px）
  fadeStart: 20,      // フェード開始位置（%）
}

// キャラクター透明度設定
const CHARACTER_ALPHA = {
  active: 1.0,    // アクティブ（発言中）
  inactive: 0.8,  // 非アクティブ
}

// キャラクター名表示設定
const CHARACTER_NAME_DISPLAY = {
  bottomOffset: 8,        // 画面下からの距離（%）
  leftCharacterX: 18,     // 左キャラの名前X位置（画面左から%）
  rightCharacterX: 82,    // 右キャラの名前X位置（画面左から%）
  underlineWidth: 3,      // アンダーラインの太さ（px）
  textShadow: "0 2px 4px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.9)",  // テキストシャドウ
}

// 下部オーバーレイ設定（システムパネル領域）
const BOTTOM_OVERLAY = {
  height: 20,             // 高さ（画面下から%）
  opacity: 1,           // 不透明度（0-1）
  color: "0, 0, 0",       // RGB値（カンマ区切り）
}

export default function BasicScenePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<Application | null>(null)
  const spritesRef = useRef<{ marcus: Sprite | null; tatsumi: Sprite | null }>({
    marcus: null,
    tatsumi: null,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [displayedMessages, setDisplayedMessages] = useState<Dialogue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSpeaker, setCurrentSpeaker] = useState<CharacterId | null>(null)

  const isLastDialogue = dialogueIndex >= DIALOGUES.length

  // 次のセリフへ進む
  const handleAdvance = useCallback(() => {
    if (dialogueIndex < DIALOGUES.length) {
      const newDialogue = DIALOGUES[dialogueIndex]
      setDisplayedMessages((prev) => [...prev, newDialogue])
      setCurrentSpeaker(newDialogue.speaker)
      setDialogueIndex((prev) => prev + 1)
    }
  }, [dialogueIndex])

  // メッセージ追加時に自動スクロール（instantでframer-motionのlayoutアニメーションと競合を避ける）
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" })
  }, [displayedMessages])

  // 発言者に応じてキャラクターのエフェクトを更新
  useEffect(() => {
    const { marcus, tatsumi } = spritesRef.current
    if (!marcus || !tatsumi) return

    const applyEffect = (sprite: Sprite, isActive: boolean) => {
      sprite.alpha = isActive ? CHARACTER_ALPHA.active : CHARACTER_ALPHA.inactive
    }

    if (currentSpeaker === "marcus") {
      applyEffect(marcus, true)
      applyEffect(tatsumi, false)
    } else if (currentSpeaker === "tatsumi") {
      applyEffect(marcus, false)
      applyEffect(tatsumi, true)
    } else {
      applyEffect(marcus, true)
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
      const [bgTexture, marcusTexture, tatsumiTexture] = await Promise.all([
        Assets.load(ASSETS.background),
        Assets.load(ASSETS.characters.marcus),
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
      const marcus = new Sprite(marcusTexture)
      const marcusTargetWidth = app.screen.width * characterWidthRatio
      const marcusScale = marcusTargetWidth / marcusTexture.width
      marcus.scale.set(marcusScale)
      marcus.anchor.set(0, 0) // 左上基準
      marcus.x = -marcusTargetWidth * horizontalOverflow // 少し左に見切れ
      marcus.y = app.screen.height - (app.screen.height * verticalPullUp) // top 100%から80%上へ
      charactersContainer.addChild(marcus)
      spritesRef.current.marcus = marcus

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
                className={`inline-block px-3 py-1 text-lg font-bold transition-opacity duration-300 ${
                  currentSpeaker === "marcus" ? "text-white" : "text-white/50"
                }`}
                style={{
                  borderBottom: `${CHARACTER_NAME_DISPLAY.underlineWidth}px solid ${CHARACTERS.marcus.color}`,
                  textShadow: CHARACTER_NAME_DISPLAY.textShadow,
                }}
              >
                {CHARACTERS.marcus.name}
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
                className={`inline-block px-3 py-1 text-lg font-bold transition-opacity duration-300 ${
                  currentSpeaker === "tatsumi" ? "text-white" : "text-white/50"
                }`}
                style={{
                  borderBottom: `${CHARACTER_NAME_DISPLAY.underlineWidth}px solid ${CHARACTERS.tatsumi.color}`,
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
                WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black ${MESSAGE_AREA.fadeStart}%, black 100%)`,
                maskImage: `linear-gradient(to bottom, transparent 0%, black ${MESSAGE_AREA.fadeStart}%, black 100%)`,
              }}
            >
              {/* 内部コンテナ: 下揃え用 */}
              <div className="min-h-full flex flex-col justify-end gap-3 py-6">
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
                      <span
                        className={`text-sm font-bold border-b-2 pb-0.5 ${
                          side === "left" ? "text-left" : "text-right"
                        }`}
                        style={{
                          color: "rgba(255,255,255,0.9)",
                          borderColor: CHARACTERS[msg.speaker].color,
                        }}
                      >
                        {CHARACTERS[msg.speaker].name}
                      </span>

                      {/* 吹き出し */}
                      <div
                        className={`max-w-[350px] px-4 py-3 rounded-2xl bg-gray-800/80 ${
                          side === "left" ? "rounded-tl-sm" : "rounded-tr-sm"
                        }`}
                      >
                        <p className="text-white text-base leading-relaxed">
                          {msg.text}
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
                  <p className="text-white/50 text-lg animate-pulse">
                    クリックして開始
                  </p>
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

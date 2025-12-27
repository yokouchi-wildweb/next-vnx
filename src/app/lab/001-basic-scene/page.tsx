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

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { extend } from "@pixi/react"
import { Container, Sprite, Texture, Assets } from "pixi.js"
import { GameScreen, PixiCanvas, useGameSize, type DisplayConfig } from "@/engine/components/Screen"
import MessageBubble from "./components/MessageBubble"
import { BgSwitcherSprite } from "@/engine/features/Background"
import { CharacterSprite, CharacterNameCard } from "@/engine/features/Character"
import { createScenarioResolver, type ScenarioResolver } from "@/engine/utils/assetResolver"
import { bgmManager, playSe } from "@/engine/audio"
import { defaultMessageBubbleStyle } from "./components/MessageBubble/defaults"
import type { Scenario, Scene, Dialogue, SceneCommand } from "@/engine/types"

// PixiJSコンポーネントを登録
extend({ Container, Sprite })

// シナリオ/シーン設定
const SCENARIO_ID = "_sample"
const SCENE_ID = "church"

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

// キャラクター配置設定（チャット型レイアウト）
const CHARACTER_LAYOUT = {
  left: { x: 0.18, y: 1.0 },   // 左キャラ位置（相対座標）
  right: { x: 0.82, y: 1.0 },  // 右キャラ位置（相対座標）
  scale: 0.8,                   // 基本スケール
  activeOpacity: 1.0,           // アクティブ時の透明度
  inactiveOpacity: 0.7,         // 非アクティブ時の透明度
}

// キャラクター名表示設定
const CHARACTER_NAME_DISPLAY = {
  left: { x: 0.18, y: 0.92 },   // 左キャラの名前位置
  right: { x: 0.82, y: 0.92 },  // 右キャラの名前位置
}

// 下部オーバーレイ設定（システムパネル領域）
const BOTTOM_OVERLAY = {
  height: 20,             // 高さ（画面下から%）
  opacity: 1,           // 不透明度（0-1）
  color: "0, 0, 0",       // RGB値（カンマ区切り）
}

// ============================================================
// PixiJS シーンコンテナ
// ============================================================

interface SceneContainerProps {
  currentSpeaker: string | null
  scenario: Scenario
  scene: Scene
  resolver: ScenarioResolver
  onReady: () => void
}

interface LoadedAssets {
  background: Texture
  characters: Record<string, Texture>
}

/**
 * シーン全体を管理するPixiJSコンテナ
 * Assets.loadでアセットをロード
 */
function SceneContainer({ currentSpeaker, scenario, scene, resolver, onReady }: SceneContainerProps) {
  const [assets, setAssets] = useState<LoadedAssets | null>(null)

  // ゲームサイズを取得（GameScreenのContextから）
  const { width: screenWidth, height: screenHeight } = useGameSize()

  // シーンに登場するキャラクターIDリスト
  const characterIds = Object.keys(scene.characters)

  // アセットをロード
  useEffect(() => {
    let mounted = true

    const loadAssets = async () => {
      // 背景をロード
      const bgPath = resolver.background(scene.backgrounds[scene.initialBackground])
      const bgTexture = await Assets.load(bgPath)

      // キャラクター立ち絵をロード
      const characterTextures: Record<string, Texture> = {}
      for (const charId of characterIds) {
        const charDef = scenario.characters[charId]
        if (charDef) {
          const spritePath = resolver.character(charDef.sprites.default)
          characterTextures[charId] = await Assets.load(spritePath)
        }
      }

      if (!mounted) return

      setAssets({
        background: bgTexture,
        characters: characterTextures,
      })
      onReady()
    }

    loadAssets()

    return () => {
      mounted = false
    }
  }, [resolver, scenario, scene, characterIds, onReady])

  // リサイズ処理はPixiCanvasが担当するため削除

  if (!assets) {
    return null
  }

  // ポジションを side に変換（chat レイアウト用）
  const positionToSide = (position: string | number): "left" | "right" => {
    if (position === "left") return "left"
    if (position === "right") return "right"
    // 数値の場合は 0.5 を基準に左右判定
    if (typeof position === "number") return position < 0.5 ? "left" : "right"
    return "left"
  }

  return (
    <pixiContainer>
      {/* 背景 */}
      <BgSwitcherSprite
        texture={assets.background}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
      />

      {/* キャラクターコンテナ */}
      <pixiContainer>
        {characterIds.map((charId) => {
          const charConfig = scene.characters[charId]
          const texture = assets.characters[charId]
          if (!texture) return null

          const side = positionToSide(charConfig.position)
          const isActive = currentSpeaker === charId || currentSpeaker === null
          const position = side === "left" ? CHARACTER_LAYOUT.left : CHARACTER_LAYOUT.right
          const opacity = isActive ? CHARACTER_LAYOUT.activeOpacity : CHARACTER_LAYOUT.inactiveOpacity

          return (
            <CharacterSprite
              key={charId}
              texture={texture}
              position={position}
              scale={CHARACTER_LAYOUT.scale}
              opacity={opacity}
            />
          )
        })}
      </pixiContainer>
    </pixiContainer>
  )
}

// ============================================================
// メインページコンポーネント
// ============================================================

export default function BasicScenePage() {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // データ読み込み状態
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [scene, setScene] = useState<Scene | null>(null)
  const [resolver, setResolver] = useState<ScenarioResolver | null>(null)

  // ダイアログ進行状態
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [displayedMessages, setDisplayedMessages] = useState<Dialogue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null)

  // display設定（scenarioから取得）
  const displayConfig: DisplayConfig | undefined = scenario?.display as DisplayConfig | undefined


  // シナリオ・シーンデータを読み込む
  useEffect(() => {
    const loadData = async () => {
      const res = createScenarioResolver(SCENARIO_ID)
      setResolver(res)

      const [scenarioData, sceneData] = await Promise.all([
        res.loadScenario(),
        res.loadScene(SCENE_ID),
      ])

      setScenario(scenarioData)
      setScene(sceneData)
    }

    loadData()
  }, [])

  // コマンド実行関数
  const executeCommand = useCallback(async (command: SceneCommand) => {
    if (!resolver) return

    switch (command.type) {
      case "bgm": {
        const src = await resolver.bgm(command.assetId)
        if (src) {
          bgmManager.play(command.assetId, src, { volume: command.volume ?? 0.5 })
        }
        break
      }
      case "bgm_stop": {
        bgmManager.fadeOut(command.fadeOut)
        break
      }
      case "se": {
        const src = await resolver.se(command.assetId)
        if (src) {
          playSe(src, { volume: command.volume ?? 0.7 })
        }
        break
      }
      case "background": {
        // 将来実装: 背景変更
        console.log("背景変更コマンド（未実装）:", command)
        break
      }
    }
  }, [resolver])

  // コマンド配列を実行
  const executeCommands = useCallback((commands: SceneCommand[] | undefined) => {
    if (!commands || commands.length === 0) return
    for (const cmd of commands) {
      executeCommand(cmd)
    }
  }, [executeCommand])

  // ダイアログ配列（シーンデータから取得）
  const dialogues = scene?.dialogues ?? []
  const isLastDialogue = dialogueIndex >= dialogues.length

  // PixiJSシーンの準備完了
  const handleSceneReady = useCallback(() => {
    setIsLoading(false)
  }, [])

  // 初期BGM再生
  const playInitialBgm = useCallback(async () => {
    if (!resolver || !scene?.initialBgm) return
    const src = await resolver.bgm(scene.initialBgm.assetId)
    if (src) {
      bgmManager.play(scene.initialBgm.assetId, src, { volume: scene.initialBgm.volume ?? 0.5 })
    }
  }, [resolver, scene])

  // 次のセリフへ進む
  const handleAdvance = useCallback(() => {
    if (dialogueIndex < dialogues.length) {
      // 初回クリック時にBGM開始
      if (dialogueIndex === 0) {
        playInitialBgm()
      }

      const newDialogue = dialogues[dialogueIndex]
      setDisplayedMessages((prev) => [...prev, newDialogue])
      setCurrentSpeaker(newDialogue.speaker)
      setDialogueIndex((prev) => prev + 1)

      // ダイアログに紐づくコマンドを実行
      executeCommands(newDialogue.commands)
    }
  }, [dialogueIndex, dialogues, playInitialBgm, executeCommands])

  // コンポーネントアンマウント時にBGM停止
  useEffect(() => {
    return () => {
      bgmManager.stop()
    }
  }, [])

  // メッセージ追加時に自動スクロール（instantでframer-motionのlayoutアニメーションと競合を避ける）
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" })
  }, [displayedMessages])

  // ポジションを side に変換（chat レイアウト用）
  const positionToSide = (position: string | number): "left" | "right" => {
    if (position === "left") return "left"
    if (position === "right") return "right"
    if (typeof position === "number") return position < 0.5 ? "left" : "right"
    return "left"
  }

  // キャラクター情報を取得（scenario.characters から）
  const getCharacter = (charId: string) => scenario?.characters[charId]

  // キャラクター位置を取得（scene.characters から）
  const getCharacterPosition = (charId: string) => scene?.characters[charId]?.position ?? "left"

  // シーンに登場するキャラクターリスト（位置でソート：left → right）
  const characterEntries = scene
    ? Object.entries(scene.characters).sort(([, a], [, b]) => {
        const posA = a.position === "left" ? 0 : a.position === "right" ? 1 : typeof a.position === "number" ? a.position : 0.5
        const posB = b.position === "left" ? 0 : b.position === "right" ? 1 : typeof b.position === "number" ? b.position : 0.5
        return posA - posB
      })
    : []

  // データ読み込み中
  if (!scenario || !scene || !resolver) {
    return (
      <GameScreen>
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-white text-xl">データ読み込み中...</p>
        </div>
      </GameScreen>
    )
  }

  return (
    <GameScreen displayConfig={displayConfig}>
      <div
        className="relative w-full h-full cursor-pointer"
        onClick={handleAdvance}
      >
        {/* PixiJS描画レイヤー */}
        <PixiCanvas>
          <SceneContainer
            currentSpeaker={currentSpeaker}
            scenario={scenario}
            scene={scene}
            resolver={resolver}
            onReady={handleSceneReady}
          />
        </PixiCanvas>

        {/* ローディング表示 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <p className="text-white text-xl">Loading...</p>
          </div>
        )}

        {/* キャラクター名前表示（動的生成） */}
        {!isLoading && characterEntries.map(([charId, charConfig]) => {
          const charDef = getCharacter(charId)
          if (!charDef) return null

          const side = positionToSide(charConfig.position)
          const namePosition = side === "left" ? CHARACTER_NAME_DISPLAY.left : CHARACTER_NAME_DISPLAY.right

          return (
            <CharacterNameCard
              key={charId}
              name={charDef.name}
              color={charDef.color}
              position={namePosition}
              variant="underline"
            />
          )
        })}

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
                  const charDef = getCharacter(msg.speaker)
                  const side = positionToSide(getCharacterPosition(msg.speaker))

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
                        speakerName={charDef?.name ?? msg.speaker}
                        speakerColor={charDef?.color ?? "#888888"}
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
    </GameScreen>
  )
}

/**
 * Character Feature 型定義
 */

import type { Texture } from "pixi.js"

// ============================================================
// 基本型
// ============================================================

/** キャラクター配置位置 */
export type Position = "left" | "center" | "right" | number

// ============================================================
// Scene Character Config（scene.json から読み込む設定）
// ============================================================

/** キャラクター設定 */
export type SceneCharacter = {
  /** 表示名 */
  name: string
  /** テーマカラー */
  color: string
  /** スプライトマップ */
  sprites: Record<string, string>
  /** デフォルトスプライト */
  sprite?: string
  /** デフォルト位置 */
  position: Position
  /** デフォルトスケール */
  scale?: number
}

// ============================================================
// Standing Sprite（立ち絵）
// ============================================================

/** 2D座標（相対値 0-1） */
export type Position2D = {
  x: number
  y: number
}

/** アンカーポイント */
export type Anchor2D = {
  x: number
  y: number
}

/** Standing スプライトのProps */
export type StandingProps = {
  /** テクスチャ */
  texture: Texture
  /** 配置位置（相対座標 0-1、画面に対する割合） */
  position: Position2D
  /** 拡大縮小（デフォルト: 1） */
  scale?: number
  /** アンカーポイント（デフォルト: { x: 0.5, y: 1 } = 下中央） */
  anchor?: Anchor2D
  /** 透明度（0-1、デフォルト: 1） */
  opacity?: number
}

// ============================================================
// NameCard（名前表示）
// ============================================================

/** 名前カードのバリアント */
export type NameCardVariant =
  | "none"       // 非表示
  | "underline"  // アンダーライン型
  // 将来追加
  // | "badge"
  // | "plate"
  // | "bubble"

/** NameCard のProps */
export type NameCardProps = {
  /** 表示名 */
  name: string
  /** テーマカラー */
  color: string
  /** 配置位置（相対座標 0-1） */
  position: Position2D
  /** バリアント（デフォルト: "underline"） */
  variant?: NameCardVariant
}

/** Underline バリアントのスタイル */
export type UnderlineStyle = {
  /** アンダーラインの太さ（px） */
  lineWidth: number
  /** テキストシャドウ */
  textShadow: string
  /** フォントサイズ */
  fontSize: string
  /** フォントウェイト */
  fontWeight: string
}

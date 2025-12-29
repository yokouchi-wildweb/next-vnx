/**
 * Engine Core エクスポート
 *
 * ゲーム実行の制御層（編集非推奨）
 * - GameOrchestrator: ゲーム全体統括
 * - SceneController: シーン制御
 * - SceneComposer: デフォルト Composer
 * - registries: Scene/Feature レジストリ
 * - SaveManager: セーブ/ロード（TODO）
 * - SceneRouter: シーン遷移（TODO）
 */

export * from "./GameOrchestrator"
export * from "./SceneController"
export * from "./SceneComposer"
export * from "./registries"

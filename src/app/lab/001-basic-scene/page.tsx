/**
 * Lab 001: 基本シーン
 *
 * 目的: 背景 + 立ち絵 + 台詞表示の最小構成を実装
 *
 * 検証項目:
 * - PixiJS + Next.js SSR の統合
 * - 背景画像の表示
 * - キャラクター立ち絵の表示
 * - テキストボックス + 台詞送り
 * - Zustand による状態管理
 *
 * 完了後の抽出先:
 * - src/engine/renderer/
 * - src/engine/ui/
 * - src/engine/stores/
 * - game/scenes/
 */
export default function BasicScenePage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Lab 001: 基本シーン</h1>
        <p className="text-gray-400">背景 + 立ち絵 + 台詞表示</p>
        <p className="text-gray-500 mt-8 text-sm">実装予定</p>
      </div>
    </main>
  )
}

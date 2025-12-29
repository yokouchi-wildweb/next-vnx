# Core

## 概要

VN エンジンのコア機能を提供するディレクトリ。
シーンの再生フローを管理するコンポーネント群。

## 階層構造

```
ScenarioManager
  ├─ タイトル画面管理
  ├─ 実績管理
  ├─ フラグ管理
  └─ SceneRouter
       ↓ (sceneId)
       SceneLoader
         ↓ (data)
         SceneInitializer
           ↓ (featureMap)
           SceneComposer
             └─ Executor → ScenarioManager に通知
```

## コンポーネントの責務

| コンポーネント | 責務 |
|---------------|------|
| ScenarioManager | シナリオ全体の管理（タイトル、実績、フラグ等） |
| SceneRouter | どのシーンを再生するか決定（フラグ確認、分岐判定） |
| SceneLoader | シーンデータの取得（fetch + merge） |
| SceneInitializer | Feature の初期化（commands.init 呼び出し） |
| SceneComposer | UI の配置・描画（arrangement に従う） |
| Executor | シーンの進行制御（ダイアログ進行等） |

## データの流れ

```
SceneRouter
  │
  │  sceneId + SceneRequest
  ↓
SceneLoader
  │
  │  Scene（マージ済みデータ）
  ↓
SceneInitializer
  │
  │  featureMap + arrangement
  ↓
SceneComposer
  │
  │  描画完了
  ↓
Executor（進行制御開始）
```

## 通知の流れ

Executor は以下のイベントを ScenarioManager に通知する：

| イベント | 用途 |
|---------|------|
| フラグ変更 | フラグ状態の更新 |
| シーン終了 | 次のシーン決定のトリガー |
| 選択肢選択 | 選択履歴の記録 |
| 分岐発生 | 分岐結果の処理 |

通知方式は Zustand ストアを介して行う（ScenarioManager が store を監視）。

## SceneRequest

SceneRouter → SceneLoader に渡される情報。

```ts
type SceneRequest = {
  scenarioId: string
  sceneId: string
  mode?: "play" | "replay"      // 通常再生 or 回想
  state?: SceneProgressState    // セーブロード時の進行状態
}
```

## シーン再生のトリガー

| トリガー | 渡される情報 |
|---------|-------------|
| ニューゲーム | scenarioId（initialScene は scenario.json から取得） |
| セーブロード | scenarioId + sceneId + 進行状態 |
| シーン終了 | nextSceneId or 分岐結果 |
| シーン回想 | scenarioId + sceneId |

## ディレクトリ構成

```
core/
├─ README.md                 # このファイル
├─ index.ts                  # 再エクスポート
├─ GameOrchestrator/         # ゲーム全体の管理（将来）
├─ scene/                    # シーン再生のコア機能
│   ├─ SceneRouter/          # シーン決定
│   ├─ SceneLoader/          # データ取得
│   ├─ SceneInitializer/     # Feature 初期化
│   └─ SceneComposer/        # UI 配置・描画
├─ arrangement/              # 配置ヘルパー関数
└─ registries/               # 各種レジストリ
```

## 設計原則

1. **単一責務**: 各コンポーネントは1つの責務に集中
2. **ウォーターフォール**: データが上から下に流れる
3. **上位への通知**: Executor は ScenarioManager に通知（store 経由）
4. **疎結合**: コンポーネント間は明確なインターフェースで接続

## 参照

- `src/engine/scene/`: シーンタイプ定義（dialogueScene 等）
- `src/engine/features/`: Feature Bundle 定義
- `src/engine/types/`: 型定義

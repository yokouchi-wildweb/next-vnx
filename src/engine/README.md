# VNX Engine

ビジュアルノベルエンジンのコア実装。

## 設計方針

- DDD層（features/）とは完全に分離
- DBアクセスなし、APIなし
- 受け取ったデータを再生するだけの純粋なビューア

## features/ と engine/ の境界

```
┌────────────────────────────┬─────────────────────────────────────┐
│      features/             │           engine/                   │
│      (データ層)             │           (表示層)                   │
├────────────────────────────┼─────────────────────────────────────┤
│  save/                     │       stores/                       │
│  scenario/          ─────────────→ playState/                    │
│  project/            データを     scenario/                      │
│  asset/              渡す                                        │
│          ↓                 │               ↓                     │
│  DB / Storage              │       SceneLoader                   │
│                            │       SceneComposer                 │
│                            │       Executor                      │
└────────────────────────────┴─────────────────────────────────────┘
```

### engine/ が DB に触らない理由

1. **純粋性**: 入力が同じなら出力も同じ（テストしやすい）
2. **再利用性**: engine 単体で別プロジェクトに持っていける
3. **責務の明確化**: features/ = 永続化、engine/ = 表示
4. **オフライン対応**: ローカルデータでも動く
5. **SaaS としての柔軟性**: DB を変えても engine は変更不要

### データの流れ

```
【ロード時】
features/save/ → API → DB
    │
    │  saveData を取得
    ↓
engine/stores/playState.set(saveData.playState)
    │
    ↓
engine/core/SceneLoader（純粋にデータを使う）


【セーブ時】
engine/stores/playState.get()
    │
    │  現在の playState を取得
    ↓
features/save/ → API → DB
```

## ディレクトリ構造

```
engine/
├── core/       # シーン実行ロジック（React非依存）
├── renderer/   # PixiJS描画層
├── ui/         # React UIコンポーネント
├── stores/     # Zustand状態管理（状態保持のみ、ロジックなし）
└── types/      # 型定義
```

## 開発フロー

1. `src/app/lab/` で画面モックを作成（ハードコード可）
2. 動作確認後、汎用化できる部分をこのディレクトリに切り出す
3. 繰り返し

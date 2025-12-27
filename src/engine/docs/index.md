# VNエンジン ドキュメント

## ドキュメント一覧

| ファイル | 内容 |
|----------|------|
| [architecture-overview.md](./architecture-overview.md) | レイヤー構成、PixiJS/HTML使い分け |
| [component-contract.md](./component-contract.md) | コンテナ・Widget間の契約 |
| [directory-structure.md](./directory-structure.md) | ディレクトリ構成、命名規則 |
| [feature-implementation.md](./feature-implementation.md) | Feature実装ガイド、createWidget |
| [scene-composition.md](./scene-composition.md) | Scene構成、Widget配置 |

## クイックリファレンス

### レイヤー構成

```
HTML層（上）: メッセージ、選択肢、設定UI
PixiJS層（下）: 背景、立ち絵、エフェクト
```

### 主要コンポーネント

| コンポーネント | 役割 |
|----------------|------|
| GameScreen | Scene側が使うインターフェース |
| GameContainer | Widget配置のコンテナ（内部） |
| PixiCanvas | PixiJSアプリケーションラッパー |
| createWidget | Widget生成ファクトリ |
| Layer | Widgetグループ化（オプション） |

### z-index（GameContainer内）

```
SystemMenu   z: 100
Choice       z: 50
Dialogue     z: 10
PixiCanvas   z: 0
```

### Feature構成

```
features/Xxx/
├── components/    # 純粋なUIパーツ
├── widget/        # Scene用（ファクトリ適用）
├── hooks/         # 状態・ロジック
├── constants.ts   # 設定値
└── index.ts       # 公開API
```

### Scene基本構造

```tsx
<GameScreen>
  <PixiCanvas>
    {/* PixiJS Widgets */}
  </PixiCanvas>
  {/* HTML Widgets */}
</GameScreen>
```

## 確定方針サマリ

1. **2層構成**: ベースPixiJS + インタラクティブHTML
2. **オーバーレイPixi**: 必要時に追加（現時点では未実装）
3. **Feature単位**: engine/features/ でDDD風に整理
4. **Widget契約**: createWidget ファクトリで強制
5. **スタックコンテキスト**: GameContainer内で isolation: isolate
6. **配置責務**: 登場=Scene、レイアウト=Feature、インスタンス=シナリオデータ
7. **Layer**: 複雑なシーンでのWidgetグループ化（オプション、スタッキングコンテキスト分離）

## 未決定事項

- [ ] Executor（シナリオ実行系）とFeatureの接続方法
- [ ] レイヤー間通信（props経由 vs store）
- [ ] 動的レイヤー構成の詳細設計
- [ ] 入力イベント優先度の仕組み

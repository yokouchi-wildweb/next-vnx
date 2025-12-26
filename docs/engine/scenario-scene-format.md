# シナリオ・シーン データ形式

VNXエンジンで使用するシナリオとシーンのJSONデータ形式を定義する。

## ディレクトリ構造

```
public/game/scenarios/<scenarioId>/
├── scenario.json              # シナリオ設定
├── assets/
│   ├── manifest.json          # アセットマニフェスト（自動生成）
│   ├── bgm/
│   └── se/
├── characters/                # キャラクター立ち絵
│   └── <characterId>/
│       ├── default.png
│       ├── happy.png
│       └── ...
├── backgrounds/               # 背景画像
│   └── <backgroundId>/
│       ├── default.png
│       ├── night.png
│       └── ...
└── scenes/
    └── <sceneId>/
        └── scene.json         # シーンデータ
```

---

## scenario.json

シナリオ全体の設定。キャラクター定義など、複数シーンで共有するデータ。

### 構造

```json
{
  "id": "_sample",
  "title": "サンプルシナリオ",
  "type": "visual-novel",
  "description": "クリスマスの教会で繰り広げられる会話",
  "characters": {
    "circus": {
      "name": "サーカス",
      "color": "#e63946",
      "sprites": {
        "default": "circus_hartluhl/default",
        "happy": "circus_hartluhl/happy",
        "angry": "circus_hartluhl/angry"
      }
    },
    "tatsumi": {
      "name": "妻夫木 達巳",
      "color": "#4361ee",
      "sprites": {
        "default": "tsumabuki_tatsumi/default",
        "serious": "tsumabuki_tatsumi/serious"
      }
    }
  }
}
```

### プロパティ

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | string | ✓ | シナリオID（ディレクトリ名と一致） |
| `title` | string | ✓ | シナリオタイトル |
| `type` | string | ✓ | `"visual-novel"` \| `"murder-mystery"` |
| `description` | string | - | 説明文 |
| `characters` | object | ✓ | キャラクター定義 |

### characters の各キャラクター

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `name` | string | ✓ | 表示名 |
| `color` | string | ✓ | テーマカラー（HEX形式） |
| `sprites` | object | ✓ | 立ち絵バリエーション（キー→パス） |

---

## scene.json

個別シーンのデータ。ダイアログ、背景、演出などを含む。

### 構造

```json
{
  "id": "church",
  "layout": "chat",
  "backgrounds": {
    "default": "church/default",
    "night": "church/night",
    "rain": "church/rain"
  },
  "initialBackground": "default",
  "characters": {
    "circus": { "position": "left" },
    "tatsumi": { "position": "right" }
  },
  "initialBgm": {
    "assetId": "存在しない街",
    "volume": 0.5
  },
  "dialogues": [
    { "speaker": "circus", "text": "ここが噂の教会か..." },
    {
      "speaker": "tatsumi",
      "text": "そうだ！",
      "sprite": "happy",
      "commands": [{ "type": "bgm", "assetId": "かたまる脳みそ", "volume": 0.5 }]
    }
  ]
}
```

### プロパティ

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | string | ✓ | シーンID |
| `layout` | string | ✓ | `"chat"` \| `"stage"` |
| `backgrounds` | object | ✓ | 背景バリエーション（キー→パス） |
| `initialBackground` | string | ✓ | 初期背景のキー |
| `characters` | object | ✓ | 登場キャラクター設定 |
| `initialBgm` | object | - | 初期BGM |
| `dialogues` | array | ✓ | ダイアログ配列 |

### layout モード

| モード | 説明 |
|--------|------|
| `chat` | 左右にキャラ固定、中央チャット形式（パターン1） |
| `stage` | 自由配置、下部メッセージウィンドウ（パターン2） |

### characters の各キャラクター

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `position` | string \| number | ✓ | `"left"` / `"right"` / `"center"` / 0-1 |
| `layer` | number | - | 前後関係（大きいほど前、省略時は0） |
| `scale` | number | - | 拡大率（省略時は1.0） |

---

## ダイアログ

### 構造

```json
{
  "speaker": "circus",
  "text": "なに…！？",
  "sprite": "angry",
  "position": "left",
  "layer": 1,
  "scale": 1.1,
  "commands": [
    { "type": "se", "assetId": "爆発2", "volume": 0.7 }
  ]
}
```

### プロパティ

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `speaker` | string | ✓ | キャラクターID |
| `text` | string | ✓ | セリフ本文 |
| `sprite` | string | - | 立ち絵キー（省略時は `"default"`） |
| `position` | string \| number | - | 位置（省略時はデフォルト or 前回値） |
| `layer` | number | - | 前後関係 |
| `scale` | number | - | 拡大率 |
| `commands` | array | - | 演出コマンド |

---

## コマンド

### BGM再生

```json
{ "type": "bgm", "assetId": "かたまる脳みそ", "volume": 0.5, "fadeIn": 1000 }
```

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `type` | `"bgm"` | ✓ | |
| `assetId` | string | ✓ | アセットID（manifest.json のキー） |
| `volume` | number | - | 音量 0-1 |
| `fadeIn` | number | - | フェードイン時間（ms） |

### BGM停止

```json
{ "type": "bgm_stop", "fadeOut": 1000 }
```

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `type` | `"bgm_stop"` | ✓ | |
| `fadeOut` | number | - | フェードアウト時間（ms） |

### SE再生

```json
{ "type": "se", "assetId": "爆発2", "volume": 0.7 }
```

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `type` | `"se"` | ✓ | |
| `assetId` | string | ✓ | アセットID |
| `volume` | number | - | 音量 0-1 |

### 背景変更

```json
{ "type": "background", "value": "night", "transition": "fade", "duration": 500 }
```

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `type` | `"background"` | ✓ | |
| `value` | string | ✓ | 背景キー |
| `transition` | string | - | `"fade"` / `"slide"` / `"none"` |
| `duration` | number | - | 演出時間（ms） |

---

## 型定義

TypeScript の型定義は `src/engine/types/` を参照。

```typescript
import type { Scenario, Scene, Dialogue, SceneCommand } from "@/engine/types"
```

# Wallet ドメイン

複数種類のアプリ内通貨（ポイント、コイン等）を統一的に管理するウォレット機能。

---

## クイックスタート（5分で把握）

### 概要

| 項目 | 内容 |
|------|------|
| **テーブル** | `wallets`（残高）、`wallet_histories`（履歴） |
| **通貨種別** | `regular_point`、`temporary_point`、`regular_coin` |
| **残高管理** | `balance`（総残高）- `locked_balance`（予約済み）= 利用可能残高 |
| **ウォレット作成** | 遅延作成（初回操作時に自動作成） |

### 基本操作

```typescript
import { walletService } from "@/features/core/wallet/services/server/walletService";

// 残高を増やす
await walletService.adjustBalance({
  userId: "user-123",
  walletType: "regular_point",
  changeMethod: "INCREMENT",
  amount: 1000,
  sourceType: "admin_action",
  reason: "キャンペーン付与",
});

// 残高を減らす
await walletService.adjustBalance({
  userId: "user-123",
  walletType: "regular_point",
  changeMethod: "DECREMENT",
  amount: 500,
  sourceType: "user_action",
});

// ウォレット取得（存在しなければ自動作成）
const wallet = await walletService.getWallet(userId, "regular_point");
```

### 予約→確定フロー（ガチャ・購入等）

```typescript
import { db } from "@/lib/drizzle";

await db.transaction(async (tx) => {
  // 1. 残高を予約（ロック）
  await walletService.reserveBalance(
    { userId, walletType: "regular_point", amount: 100 },
    tx,
    { lock: true }
  );

  // 2. 処理実行（ガチャ抽選など）
  const result = await executeGacha();

  // 3. 予約を確定消費
  await walletService.consumeReservedBalance(
    { userId, walletType: "regular_point", amount: 100, sourceType: "user_action" },
    tx
  );
});
```

### 主要な型

```typescript
import type {
  TransactionClient,       // トランザクション型
  WalletOperationOptions,  // 共通オプション { lock?: boolean }
  AdjustBalanceOptions,    // adjustBalance用 { lock?, skipHistory? }
  GetWalletOptions,        // getWallet用 { lock?, createIfNotExists? }
} from "@/features/core/wallet";
```

---

## データモデル

### Wallet

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | `string` | UUID |
| `user_id` | `string` | ユーザーID（FK） |
| `type` | `enum` | `regular_point` / `temporary_point` / `regular_coin` |
| `balance` | `number` | 総残高 |
| `locked_balance` | `number` | 予約済み残高 |
| `updatedAt` | `Date` | 最終更新日時 |

**ユニーク制約**: `(user_id, type)` の組み合わせ

### WalletHistory

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | `string` | UUID |
| `user_id` | `string` | ユーザーID |
| `type` | `enum` | ウォレット種別 |
| `change_method` | `enum` | `INCREMENT` / `DECREMENT` / `SET` |
| `points_delta` | `number` | 変動量 |
| `balance_before` | `number` | 変動前残高 |
| `balance_after` | `number` | 変動後残高 |
| `source_type` | `enum` | `user_action` / `admin_action` / `system` |
| `request_batch_id` | `string?` | バッチ処理ID |
| `reason` | `string?` | 変更理由 |
| `meta` | `jsonb` | 追加メタ情報 |
| `createdAt` | `Date` | 作成日時 |

---

## サービスAPI

### walletService

```typescript
import { walletService } from "@/features/core/wallet/services/server/walletService";
```

#### getWallet

ウォレットを取得。デフォルトで存在しなければ自動作成。

```typescript
const wallet = await walletService.getWallet(
  userId: string,
  walletType: WalletTypeValue,
  tx?: TransactionClient,
  options?: {
    lock?: boolean;           // SELECT FOR UPDATE
    createIfNotExists?: boolean; // デフォルト: true
  }
);

// 存在確認のみ（自動作成しない）
const wallet = await walletService.getWallet(userId, "regular_point", tx, {
  createIfNotExists: false
});
```

#### adjustBalance

残高を調整（増減・設定）。履歴も自動記録。

```typescript
const result = await walletService.adjustBalance(
  params: {
    userId: string;
    walletType: WalletTypeValue;
    changeMethod: "INCREMENT" | "DECREMENT" | "SET";
    amount: number;
    sourceType: "user_action" | "admin_action" | "system";
    requestBatchId?: string;  // バッチ処理ID
    reason?: string;          // 変更理由
    meta?: {                  // 追加メタ情報
      productId?: string;
      orderId?: string;
      adminId?: string;
      notes?: string;
    };
  },
  tx?: TransactionClient,
  options?: {
    lock?: boolean;       // 行ロック
    skipHistory?: boolean; // 履歴記録スキップ
  }
);
// result: { wallet: Wallet, history: WalletHistory | null }
```

#### reserveBalance

残高を予約（ロック）。`locked_balance` を増加。

```typescript
const wallet = await walletService.reserveBalance(
  { userId, walletType, amount },
  tx?,
  { lock?: boolean }
);
```

#### releaseReservation

予約を解除。`locked_balance` を減少。

```typescript
const wallet = await walletService.releaseReservation(
  { userId, walletType, amount },
  tx?,
  { lock?: boolean }
);
```

#### consumeReservedBalance

予約済み残高を確定消費。`balance` と `locked_balance` を同時に減少。

```typescript
const result = await walletService.consumeReservedBalance(
  { userId, walletType, amount, sourceType, reason?, meta? },
  tx?,
  { lock?: boolean }
);
// result: { wallet: Wallet, history: WalletHistory }
```

---

## トランザクション統合

### 外部トランザクションとの統合

全ての操作関数は `tx?: TransactionClient` を受け取り、外部トランザクションに参加可能。

```typescript
import { db } from "@/lib/drizzle";
import type { TransactionClient } from "@/features/core/wallet";

await db.transaction(async (tx: TransactionClient) => {
  // 複数操作を1トランザクション内で実行
  await walletService.adjustBalance(params1, tx);
  await walletService.adjustBalance(params2, tx);
  await someOtherService.doSomething(tx);
});
```

### 単独実行

`tx` を渡さなければ内部で新規トランザクションが作成される。

```typescript
// 単独で実行（内部でトランザクション作成）
await walletService.adjustBalance(params);
```

### 行ロック（lock オプション）

競合を防ぐため `SELECT FOR UPDATE` で行ロックを取得。

```typescript
// 行ロック付きで操作
await walletService.adjustBalance(params, tx, { lock: true });
await walletService.reserveBalance(params, tx, { lock: true });
```

---

## 残高予約フロー

### 概念

```
balance: 1000, locked_balance: 0
    ↓ reserveBalance(300)
balance: 1000, locked_balance: 300  ← 利用可能: 700
    ↓ consumeReservedBalance(300)
balance: 700, locked_balance: 0     ← 確定消費完了
```

### 利用可能残高

```
利用可能残高 = balance - locked_balance
```

### フロー図

```
┌─────────────────────────────────────────────────────────┐
│                    予約→確定フロー                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. reserveBalance      locked_balance += amount        │
│         ↓                                               │
│  2. 処理実行            （ガチャ、購入処理など）           │
│         ↓                                               │
│  3a. consumeReserved    balance -= amount               │
│      Balance            locked_balance -= amount        │
│                                                         │
│  3b. releaseReservation locked_balance -= amount        │
│      （失敗時）          （balance は変更なし）           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 実装例（ガチャ）

```typescript
async function playGacha(userId: string, cost: number) {
  return db.transaction(async (tx) => {
    // 1. 残高を予約
    await walletService.reserveBalance(
      { userId, walletType: "regular_point", amount: cost },
      tx,
      { lock: true }
    );

    try {
      // 2. ガチャ抽選
      const prize = await drawPrize();

      // 3. 予約を確定消費
      await walletService.consumeReservedBalance(
        {
          userId,
          walletType: "regular_point",
          amount: cost,
          sourceType: "user_action",
          reason: "ガチャプレイ",
          meta: { gachaId: prize.gachaId },
        },
        tx
      );

      return prize;
    } catch (error) {
      // 失敗時は予約解除
      await walletService.releaseReservation(
        { userId, walletType: "regular_point", amount: cost },
        tx
      );
      throw error;
    }
  });
}
```

---

## 通貨設定

### CURRENCY_CONFIG

`currencyConfig.ts` で各通貨の表示設定を管理。

```typescript
import { CURRENCY_CONFIG, getCurrencyConfig } from "@/features/core/wallet";

// 設定取得
const config = getCurrencyConfig("regular_point");
// { slug: "point", label: "ポイント", unit: "pt", color: "#3B82F6", ... }
```

| 通貨種別 | slug | label | unit |
|---------|------|-------|------|
| `regular_coin` | `coin` | コイン | コイン |
| `regular_point` | `point` | ポイント | pt |
| `temporary_point` | `temporary-point` | 期間限定ポイント | pt |

### ユーティリティ関数

```typescript
// slug ↔ walletType 変換
getWalletTypeBySlug("point");      // → "regular_point"
getSlugByWalletType("regular_point"); // → "point"

// slug からフル設定取得
getCurrencyConfigBySlug("point");

// slug 検証
isValidSlug("point"); // → true
```

---

## 型のエクスポート

### barrel export（`@/features/core/wallet`）

```typescript
import type {
  // トランザクション
  TransactionClient,

  // オプション型
  WalletOperationOptions,   // { lock?: boolean }
  AdjustBalanceOptions,     // { lock?, skipHistory? }
  GetWalletOptions,         // { lock?, createIfNotExists? }

  // パラメータ型
  AdjustWalletParams,
  ReserveWalletParams,
  ReleaseReservationParams,
  ConsumeReservationParams,

  // 結果型
  WalletAdjustmentResult,   // { wallet, history }

  // 通貨設定
  WalletType,
  CurrencyConfig,
} from "@/features/core/wallet";
```

---

## 履歴とメタ情報

### request_batch_id

複数操作をグループ化するID。10連ガチャや一括処理で使用。

```typescript
const batchId = crypto.randomUUID();

for (let i = 0; i < 10; i++) {
  await walletService.consumeReservedBalance({
    ...params,
    requestBatchId: batchId,  // 全操作で同じIDを使用
  }, tx);
}
```

### meta フィールド

JSONB形式で任意の追加情報を保存。

```typescript
await walletService.adjustBalance({
  ...params,
  meta: {
    productId: "prod-123",     // 商品ID
    orderId: "order-456",      // 注文ID
    gachaId: "gacha-789",      // ガチャID
    adminId: "admin-001",      // 管理者ID
    notes: "特別対応",          // 社内メモ
    sourceScreen: "admin/users", // 操作画面
  },
}, tx);
```

### メタ情報のインデックス

頻繁に検索するキーにはGINインデックスを追加可能。

```sql
-- drizzle.ts または直接SQL
CREATE INDEX wallet_histories_meta_order_id_idx
ON wallet_histories USING gin ((meta ->> 'orderId'));
```

---

## 管理機能

### 管理API

```
POST /api/admin/wallet/{userId}/adjust
```

```json
{
  "walletType": "regular_point",
  "changeMethod": "INCREMENT",
  "amount": 5000,
  "reason": "キャンペーン補填",
  "meta": {
    "orderId": "ORDER-1234",
    "notes": "特別対応"
  }
}
```

### 管理UIコンポーネント

```typescript
import { AdminWalletAdjustModal } from "@/features/core/wallet/components/AdminWalletAdjustModal";
```

---

## ディレクトリ構造

```
src/features/core/wallet/
├── README.md                 # このファイル
├── index.ts                  # barrel export
├── currencyConfig.ts         # 通貨設定
├── domain.json               # ドメイン生成設定
│
├── entities/
│   ├── index.ts
│   ├── model.ts              # Wallet型定義
│   ├── schema.ts             # Zodスキーマ
│   ├── form.ts               # フォーム型
│   └── drizzle.ts            # Drizzleテーブル定義
│
├── services/
│   ├── types.ts              # パラメータ・オプション型
│   ├── client/               # クライアントサービス
│   │   └── walletClient.ts
│   └── server/
│       ├── walletService.ts  # メインサービス
│       ├── drizzleBase.ts    # ベースCRUD
│       └── wrappers/
│           ├── utils.ts      # ユーティリティ（getOrCreateWallet等）
│           ├── adjustBalance.ts
│           ├── reserveBalance.ts
│           ├── releaseReservation.ts
│           └── consumeReservedBalance.ts
│
├── hooks/                    # Reactフック
│   ├── useWallet.ts
│   ├── useWalletList.ts
│   └── useWalletBalances.ts
│
├── components/               # UIコンポーネント
│   ├── common/
│   │   └── CurrencyDisplay/
│   └── AdminWalletAdjustModal/
│
├── types/
│   └── field.ts              # フィールド型（自動生成）
│
└── constants/
    └── field.ts              # 定数定義
```

---

## トラブルシューティング

### Q. API呼び出しで500エラーが返る

サーバーログの `DomainError` を確認。よくある原因：
- 残高不足（409）
- バリデーションエラー（400）
- DB接続エラー（500）

### Q. 残高が更新されない / 表示が古い

- SWRの `revalidateKeys` を確認
- `mutate()` でキャッシュを手動更新

### Q. 「残高が不足しています」エラー

利用可能残高 = `balance - locked_balance` を確認。
予約中の残高がある場合、見かけ上の残高より少なくなる。

### Q. 大量更新時のパフォーマンス

- `meta` の頻出キーにGINインデックスを追加
- `request_batch_id` で絞り込んでから `meta` で検索

---

## 関連ドキュメント

- [コイン購入時の決済フローと外部決済連携](../../../docs/concepts/コイン購入時の決済フローと外部決済連携に関する処理方針.md)
- [WalletHistory ドメイン](../walletHistory/README.md)

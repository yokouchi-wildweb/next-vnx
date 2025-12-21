# routeFactory - APIルートファクトリー

すべてのAPIルートは、このファクトリーを経由して作成する必要があります。
直接 `export const GET = async (req) => { ... }` のようなハンドラを書くことは禁止されています。

---

## なぜファクトリーが必要か

1. **共通処理の一元管理**: 認証、エラーハンドリング、デモモード制御などを一箇所で管理
2. **将来の拡張性**: 新しい共通処理（ログ、レート制限等）を追加する際にファクトリーのみ修正すればよい
3. **一貫性の担保**: すべてのAPIルートが同じ構造・挙動を持つ

---

## 提供するファクトリー

### 1. `createApiRoute` - 基本ファクトリー

すべてのAPIルート作成の基盤となるファクトリーです。

```ts
import { createApiRoute } from "@/lib/routeFactory";

export const GET = createApiRoute(
  {
    operation: "GET /api/example",
    operationType: "read",
  },
  async (req, { params, session }) => {
    // ビジネスロジック
    return { data: "example" };
  },
);
```

#### 設定オプション

| オプション | 型 | 説明 |
|-----------|-----|-----|
| `operation` | `string` | 操作名（ログ・デバッグ用） |
| `operationType` | `"read" \| "write"` | 操作種別 |
| `skipForDemo` | `boolean \| undefined` | デモユーザー時のスキップ制御 |

#### `skipForDemo` の挙動

| 値 | 挙動 |
|----|-----|
| `undefined`（省略） | `operationType: "write"` なら自動スキップ、`"read"` なら実行 |
| `true` | デモユーザーの場合は常にスキップ |
| `false` | デモユーザーでも必ず実行（ログイン処理など） |

スキップ時のレスポンス: `{ success: true, demo: true }`

---

### 2. `createDomainRoute` - 汎用CRUDファクトリー

`/api/[domain]/**` 配下の汎用CRUDルート専用のファクトリーです。
serviceRegistryからドメインサービスを自動取得し、ハンドラに渡します。

```ts
import { createDomainRoute } from "@/lib/routeFactory";

type Params = { domain: string };

export const GET = createDomainRoute<any, Params>(
  { operation: "GET /api/[domain]", operationType: "read" },
  async (_req, { service }) => {
    return service.list();
  },
);
```

---

## 使用例

### 読み取り専用API

```ts
export const GET = createApiRoute(
  {
    operation: "GET /api/wallet/balance",
    operationType: "read",
  },
  async (_req, { session }) => {
    if (!session) {
      return NextResponse.json({ message: "認証が必要です" }, { status: 401 });
    }
    return walletService.getBalance(session.userId);
  },
);
```

### 書き込みAPI（デモ時は自動スキップ）

```ts
export const POST = createApiRoute(
  {
    operation: "POST /api/storage/upload",
    operationType: "write",
    // skipForDemo: undefined → write なので自動スキップ
  },
  async (req, { session }) => {
    // デモユーザーはここに到達しない
    return storageService.upload(req);
  },
);
```

### 書き込みAPI（デモでも実行必須）

```ts
export const POST = createApiRoute(
  {
    operation: "POST /api/auth/login",
    operationType: "write",
    skipForDemo: false, // ログインはデモでも必要
  },
  async (req) => {
    return authService.login(req);
  },
);
```

---

## 禁止事項

- ファクトリーを経由せずに直接ハンドラをエクスポートすること
- `operationType` を省略すること
- デモスキップの判断をハンドラ内で行うこと（ファクトリーに委譲する）

---

## 関連ドキュメント

- `docs/!must-read/アプリ構築における構成層.md` - 全体アーキテクチャ
- `docs/!must-read/汎用CRUDの仕様と拡張方法について.md` - CRUD仕様

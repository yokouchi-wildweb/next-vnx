# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

This is a Next.js 16 template with App Router, designed for rapid development of full-stack applications with comprehensive CRUD operations. The codebase uses a layered architecture with strict separation of concerns and includes automated domain generation tooling.

**Key Technologies:**
- Next.js 16 (React 19)
- TypeScript
- Database: Drizzle ORM (PostgreSQL/Neon) or Firestore
- State Management: Zustand, SWR
- Forms: React Hook Form + Zod
- UI: Tailwind CSS 4, Shadcn components, Radix UI
- Authentication: Firebase Auth with JWT sessions
- Storage: Firebase Storage

---

## 用語の解釈

- **ヒグマ** → **Figma** と解釈する

---

## 作業進行ルール（最重要）

このプロジェクトでは、管理者がすべての変更を把握できるよう、以下のルールを厳守すること。

### 基本原則

1. **指示された箇所のみ作業する**
   - 関連箇所であっても勝手に範囲を広げない
   - 「ついでに」の修正は行わない
   - 追加作業が必要と判断した場合は、必ず確認を取る

2. **プランニングと実装を完全に分離する**
   - プランニング中は絶対にコードを書かない
   - 計画を提示 → 承認を得る → 実装の順序を守る
   - 承認前に実装を開始しない

3. **レビュー可能な単位で進める**
   - 一度に大量の変更をしない
   - 変更後は確認を待つ
   - 複数ファイルにまたがる場合は、変更範囲を事前に提示する

### 禁止事項

- ❌ 指示されていない機能の先回り実装
- ❌ プランニング中のコード生成・ファイル作成
- ❌ 確認なしでの複数機能の一括実装
- ❌ 「効率化」を理由にした作業範囲の拡大

---

## Essential Commands

### Development
```bash
npm run dev              # Start development server
npm run build            # Build for production (uses webpack)
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Database (Drizzle/Neon)
```bash
npm run db:generate      # Generate Drizzle migrations
npm run db:push          # Push schema changes to database
```

### Domain Generation (Code Generation)
```bash
npm run dc:init                    # Create initial domain.json template
npm run dc:generate -- <Domain>    # Generate domain files from domain.json
npm run dc:generate:all            # Generate all domains (allows file type selection)
npm run dc:delete -- <Domain>      # Delete domain files
npm run dc:add                     # Add field to existing domain
```

The domain generation system creates entities, services, hooks, components, and admin routes from a `domain.json` configuration file.

---

## Architecture Overview

### Layered Architecture (Critical to Understand)

The application follows a strict 8-layer architecture. **Never bypass layers** or mix responsibilities:

```
1. Page Layer (app/**/page.tsx)           → SSR/SSG, initial data fetch
2. UI Component Layer (features/*/components) → Display & user interaction
3. Hook Layer (features/*/hooks)          → React state management
4. Client Service Layer (features/*/services/client) → HTTP communication (axios only)
5. API Route Layer (app/api/**)           → HTTP interface
6. Server Service Layer (features/*/services/server) → Business logic & DB access
7. Domain Entity Layer (features/*/entities) → Schemas, types, DB definitions
8. Database Layer                         → PostgreSQL or Firestore
```

**Critical Rules:**
- **HTTP Client Policy**: Client-side MUST use axios (never fetch). Server-side can use fetch.
- **DB Access**: ONLY through Server Service Layer (never direct Drizzle/Firestore in API routes)
- **Page Layer**: Can directly call server services (SSR context)
- **Hook Layer**: CANNOT call server services (client context)

### Data Flow Example
```
User Action → Component → Hook → Client Service (axios) →
API Route → Server Service → Database
```

---

## Directory Structure (Key Patterns)

### Feature-Based Domain Structure
```
src/features/<domain>/
  ├── components/          # UI components
  │   ├── Admin<Domain>List/      # List view (Section Container)
  │   ├── Admin<Domain>Create/    # Create view
  │   ├── Admin<Domain>Edit/      # Edit view
  │   └── common/                 # Shared form components
  ├── entities/            # Domain data definitions
  │   ├── index.ts         # Re-exports
  │   ├── model.ts         # Domain models
  │   ├── schema.ts        # Zod validation schemas (XxxBaseSchema, XxxCreateSchema, XxxUpdateSchema)
  │   ├── form.ts          # z.infer types from schemas
  │   ├── drizzle.ts       # Drizzle table definitions (if using Neon)
  │   └── firestore.ts     # Firestore schema (if using Firestore)
  ├── services/
  │   ├── client/          # API clients (createApiClient wrapper)
  │   └── server/          # Business logic & DB operations
  │       ├── drizzleBase.ts    # Base CRUD service
  │       ├── wrappers/         # Custom logic wrapping base service
  │       └── <domain>Service.ts # Public service interface
  ├── hooks/               # React hooks wrapping client services
  ├── constants/           # Domain-specific constants
  ├── types/               # Auxiliary types
  └── domain.json          # Domain configuration for code generation
```

### Shared Infrastructure
```
src/
  ├── lib/               # Core utilities (DO NOT MODIFY without proposal)
  │   ├── crud/          # Generic CRUD operations
  │   ├── errors/        # Error handling (HttpError, DomainError)
  │   ├── drizzle/       # Drizzle ORM setup
  │   ├── firebase/      # Firebase client/server
  │   └── storage/       # File upload handling
  ├── components/        # Shared UI components (DO NOT MODIFY without proposal)
  │   ├── Form/          # Button, Input components (use instead of raw HTML)
  │   ├── Layout/        # Block, Flex, Grid (use instead of raw divs)
  │   ├── TextBlocks/    # Para, Span, SecTitle (use instead of p, h2)
  │   ├── Skeleton/      # BaseSkeleton, FormSkeleton等（ローディング表示）
  │   └── Shadcn/        # Shadcn generated components
  ├── registry/          # Service and schema registries
  └── proxies/           # Middleware handlers (Next.js 16 proxy.ts pattern)
```

---

## Component Design Principles

### 4-Layer Component Hierarchy
1. **Page**: Imports Main wrapper, minimal structure
2. **Section Container**: `PascalCase/index.tsx` pattern, manages state via hooks
3. **Unit Items**: Reusable sub-components
4. **Interaction Parts**: Buttons, inputs, atomic elements

### Styling Policy (CRITICAL)
**🚫 Avoid class-based styling - it's a last resort**

1. **ALWAYS use wrapper components** from `src/components/` instead of raw HTML:
   - ❌ `<div className="space-y-4">`
   - ✅ `<Block space="md">`
   - ❌ `<button className="...">`
   - ✅ `<Button variant="primary">`
   - ❌ `<p className="text-sm text-gray-600">`
   - ✅ `<Para size="sm" variant="muted">`

2. **Check `src/components/README.md`** before implementing any UI
3. Key component folders to use:
   - `Layout/` - Block, Flex, Grid (for divs/sections)
   - `Form/` - Button, Input, Select, etc.
   - `TextBlocks/` - Para, Span, SecTitle (for text elements)
   - `Skeleton/` - BaseSkeleton（Shadcn Skeletonは使用しない）

### Component Best Practices
- Section Containers call hooks; pass event handlers down as props
- Keep `"use client"` declarations minimal; prefer Server Components
- Avoid direct state management in lower components

---

## Error Handling Strategy

### Unified Error Flow

```
Server Service → DomainError (with status, message)
    ↓
API Route → JSON {status, message}
    ↓
Client Service → HttpError (via normalizeHttpError)
    ↓
Hook Layer → HttpError (no transformation)
    ↓
UI Layer → err(error, fallback) for display
```

**Key Utilities** (`src/lib/errors/httpError.ts`):
- `normalizeHttpError(error, fallback)` - Convert axios errors to HttpError
- `err(error, fallback)` - Extract user-friendly message in UI
- `createHttpError({message, status, ...})` - Create HttpError for non-HTTP failures

**Rules by Layer:**
- Server Service: Throw `DomainError` with status and user-facing message
- API Route: Convert `DomainError` to JSON response
- Client Service: Always use `normalizeHttpError` on axios errors before re-throwing
- Hook Layer: Pass through `HttpError`, never transform
- UI: Use `err()` to safely extract message for toast/form display

---

## Generic CRUD System

The template provides powerful CRUD automation via `createCrudService`:

### Provided Operations
- `create, list, get, update, remove` - Standard CRUD
- `search` - Pagination + filtering + sorting
- `query` - Custom SQL with pagination helpers
- `upsert, bulkDeleteByIds, bulkDeleteByQuery` - Batch operations
- **Drizzle only**: `belongsToMany` auto-sync for many-to-many relations

### When to Use Base CRUD
✅ Single table operations
✅ Standard search/sort (searchQuery, searchFields, orderBy, where)
✅ Many-to-many relations (Drizzle only)

### When to Extend (`services/server/wrappers/`)
❌ Multi-table JOINs → Use `base.query()` with custom SQL
❌ Complex transactions → Wrap with `db.transaction()`
❌ Side effects (notifications, external APIs, file cleanup) → Wrap base methods
❌ Firestore complex queries → Direct SDK + manual indexing

### Database Feature Parity

| Feature | Drizzle (Neon) | Firestore |
|---------|----------------|-----------|
| Pagination | SQL LIMIT/OFFSET | Simulated with slice |
| Multi-column sort | ✅ | ❌ (first column only) |
| Search | ILIKE on all fields, priority ranking | ❌ (prefix match on first field) |
| OR conditions | ✅ | ❌ |
| belongsToMany | ✅ Auto-sync | ❌ Not supported |

**Refer to:** `docs/core-specs/DB種別の違いによる機能の差異.md`

---

## Domain Generation Workflow

### Adding a New Domain

1. **Initialize template:**
   ```bash
   npm run dc:init
   ```
   This creates `domain.json` template in root.

2. **Configure domain.json:**
   - Define fields, relations, validation rules
   - Set `dbEngine` (Neon or Firestore)
   - Configure form inputs, table columns, search fields

3. **Generate files:**
   ```bash
   npm run dc:generate -- YourDomain
   # or for all domains with file type selection:
   npm run dc:generate:all
   ```

4. **Generated outputs:**
   - `features/<domain>/entities/` - Schemas, types, DB definitions
   - `features/<domain>/services/` - Client/server services
   - `features/<domain>/hooks/` - React hooks
   - `features/<domain>/components/` - Admin UI components
   - Registry updates
   - Admin menu entries

5. **Review and customize:**
   - Check diffs before committing
   - Add custom logic in `services/server/wrappers/`
   - Extend forms in component-level `formEntities.ts`

### Important: Presenter Pattern
Recent commits show a "presenter" pattern being applied to core domains. Presenters transform data for specific views. Check existing domains for examples if this pattern is required.

---

## Entity Management Guidelines

### Schema Organization (`entities/`)

**schema.ts** - Server-side validation schemas:
- `XxxBaseSchema` - Full domain model
- `XxxCreateSchema` - For creation (may omit auto-generated fields)
- `XxxUpdateSchema` - For updates (typically partial)
- **Never** include form-specific UI concerns here

**form.ts** - Form types only:
- Export `z.infer` types from schemas
- No additional schemas or compositions
- UI-specific extensions via type intersections

**Form-specific schemas** - Component-level `formEntities.ts`:
- For UI-only validation that doesn't belong in domain schemas
- Keeps entities/ lean and reusable

**drizzle.ts / firestore.ts**:
- Database structure definitions
- Determined by `dbEngine` in domain.json

---

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase or index.tsx | `UserProfile.tsx`, `Header/index.tsx` |
| Component dirs | PascalCase | `AdminSampleList/` |
| Hooks | useCamelCase | `useCreateSample.ts` |
| Services | camelCase | `sampleClient.ts`, `sampleService.ts` |
| Entities | PascalCase (types), lowercase files | `Sample`, `schema.ts` |
| Routes | kebab-case or (group) | `admin/`, `(protected)/` |
| Constants | UPPER_SNAKE_CASE | `USER_ROLES` |

---

## System Core Files (Require Approval Before Modification)

These directories contain foundational code. **Before modifying, propose changes and await approval:**

- `src/lib/` - All utilities
- `src/features/core/` - Core features
- `src/components/` - All shared components
- `scripts/domain-config/` - Code generation scripts
- `src/styles/config.css` - Tailwind configuration

---

## Testing & Development Workflow

### Pre-work Checklist
1. Review architecture docs: `docs/!must-read/アプリ構築における構成層.md`
2. Review component design: `docs/!must-read/コンポーネントの設計と切り分け方.md`
3. Review error handling: `docs/!must-read/エラーハンドリング方針.md`
4. Check if shared components exist before writing HTML

### Before Implementation
- **Default mode**: Propose and plan before executing
- Ask clarifying questions for ambiguous requirements
- Identify if multiple implementation approaches exist
- Get approval before modifying system core files

### Language
- **All comments, documentation, and communication in Japanese**

---

## Common Pitfalls to Avoid

1. ❌ Using `fetch` in client-side code (use axios)
2. ❌ Calling DB directly from API routes (use server services)
3. ❌ Using raw HTML elements when wrappers exist (check components/)
4. ❌ Adding form-specific schemas to `entities/schema.ts`
5. ❌ Mixing layer responsibilities (e.g., hooks calling server services)
6. ❌ Bypassing `normalizeHttpError` in client services
7. ❌ Manual many-to-many sync when `belongsToMany` available (Drizzle)
8. ❌ Re-implementing CRUD when base service suffices
9. ❌ Modifying generated files without noting manual changes

---

## Key Documentation References

- `docs/!must-read/` - Required reading before development
- `docs/concepts/` - Architecture and design decisions
- `docs/how-to/` - Step-by-step guides
- `docs/core-specs/` - Technical specifications (DB differences, service specs)
- `docs/troubleshooting/` - Common issues and solutions
- `README.md` - Project overview and getting started
- `AGENTS.shared.md` - Agent-specific guidelines

For initialization and deployment: `docs/how-to/initial-setup/クイックスタート_環境構築からデプロイまでの方法.md`

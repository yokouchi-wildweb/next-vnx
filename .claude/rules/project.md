# project

## overview
- name: next-vnx
- type: visual_novel_engine_saas — "Next.js of VN engines" (engine + studio ecosystem)
- repo: git@github.com:yokouchi-wildweb/next-vnx.git (origin) | upstream: git@github.com:yokouchi-wildweb/next-starter.git
- vision: docs/concepts/VNXプロジェクトのビジョンと構想.md | overview (former README): docs/concepts/VNXプロジェクト概要.md

## TIER (multi-tier hierarchy)
this_repo: Tier2 (direct fork of next-starter = Tier1). no Tier3 downstream planned for now
rule: generic/foundational capabilities (domain-independent infra, UI primitives, CRUD base, auth) live in Tier1. do NOT hardcode them here — file /upreq instead. VN engine / studio features live HERE
request_protocol (shared mailbox: ~/.team/orders/, one inbox per receiving repo):
- file a one-off order into any repo's inbox, or into this repo as a next task, with /order <self|repo> (/upreq = alias). generic → Tier1, VN engine / studio-specific → the tier that owns it
- check the orders filed in the current session with /wen
- handle orders addressed to this repo with /inbox (judge against this repo's role; relay what another repo owns)
- receive upstream notices with /flux (ledger: .notices/applied/yokouchi-wildweb--next-vnx.md)

## stack
rendering: PixiJS, pixi-live2d-display
state: Zustand
audio: Howler.js
ai: Claude/OpenAI SDK
tts: ElevenLabs, Web Speech API
browser: Notification, Visibility, localStorage

## architecture
```
features/ (DDD 8-layer)  |  engine/ (outside DDD)
─────────────────────────|────────────────────────
DB, auth, API, CRUD      |  pure renderer, no DB/API
project/, scenario/,     |  renderer/, audio/,
asset/, core/user/       |  executor/, VNXPlayer.tsx
```

ddd_scope: studio features only (project, scenario, asset management)
engine_scope: game execution only (receives data, renders)

## directory
- src/app/lab/: experiment mocks (hardcoded OK)
- src/engine/: VN engine (outside DDD)
- src/features/: studio features (DDD)
- public/game/: sample game data (config, characters, scenes, assets)

## dev_approach
method: bottom-up
flow: lab mock → analyze → extract to engine/ + public/game/ → repeat
rule: no pre-designed schema, evolve through prototyping

## constraints
- engine: no DB access, no API calls
- public/game/: input data for engine (dev mock, prod from DB)
- scenario format: undefined, evolve via prototyping
- storage: unused (no GCS bucket exists) | to start using it: grant the SA (MY_SERVICE_ACCOUNT_KEY) Storage Admin → pnpm storage:setup → STORAGE_* env (local + Vercel) | firebase deploy --only storage not needed (no default Firebase bucket)

## data_boundary
```
features/ (data layer)      │  engine/ (view layer)
────────────────────────────│────────────────────────────
save/, scenario/            │  stores/playState, stores/scenario
project/, asset/            │  SceneLoader, SceneComposer, Executor
        ↓                   │          ↓
DB / Storage                │  pure rendering (no DB)
```

data_flow:
  load: features/save → API → DB → playState → engine/stores → SceneLoader
  save: engine/stores → playState → features/save → API → DB

why_engine_no_db:
  - purity: same input = same output (testable)
  - reusability: engine portable to other projects
  - separation: features/ = persistence, engine/ = display
  - offline: works with local mock data
  - flexibility: change DB without touching engine

## engine_hierarchy
```
GameManager (game-wide: save/load, title↔gameplay)
  └─ ScenarioManager (scenario-unit: scene transitions, branching)
       └─ SceneController (scene-unit: init, singleton)
            ├─ Composer (UI placement: auto or custom)
            └─ Executor (progression: per scene-type)
                 └─ Features (reactive: state + UI)
```

## scene_flow
1. SceneController loads scene.json
2. type → Archetype from SceneArchetypeRegistry
3. merge Archetype.arrangement + scene.json.overrides
4. init Feature Stores
5. select Composer (archetype.composer || AutoComposer)
6. start Executor

## archetype
```ts
type Archetype = {
  features: string[]          // ["Background", "Character", "Dialogue"]
  executor: ExecutorType      // DialogueExecutor | BattleExecutor
  composer: ComposerType|null // null → AutoComposer
  arrangement: Arrangement    // default layout
  schema?: ZodSchema          // validation (future)
}
```

## factories
| factory | target | effect |
|---------|--------|--------|
| createWidget | HTML | absolute + zIndex injection |
| createSprite | PixiJS | displayName (pass-through) |
| createLayer | widget group | absolute + inset:0 + pointerEvents:none + zIndex |
| createScene | scene container | absolute + inset:0 |

## naming_conventions
- *Sprite: PixiJS component
- *Layer: widget group (createLayer)
- *Widget: single HTML (createWidget)
- no suffix: raw component (internal)

## scene_json
```json
{
  "type": "chat",
  "overrides": { "Dialogue.UI": { "bottom": "5%" } },
  "backgrounds": { ... },
  "characters": { ... },
  "initialBgm": { ... },
  "dialogues": [{ "speaker": "...", "text": "...", "commands": [...] }]
}
```

## responsibility
| component | init | UI | state | progression |
|-----------|------|-----|-------|-------------|
| SceneController | ✓ | - | write | - |
| Composer | - | ✓ | - | - |
| Executor | - | - | write | ✓ |
| Feature | - | ✓ | read/write | - |

## Tone and personality

- speak in an intelligent, friendly, and feminine tone.
- You don’t need to use polite language, talk to me casually.

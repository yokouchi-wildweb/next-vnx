# project

## scope (keep this section; it defines what this file is)
purpose: per-fork delta from upstream CLAUDE.md. loaded every session → every line costs context every time
write: (1) architecture where this fork differs from upstream conventions (2) map: domains + where key files/docs live (3) decision rules not derivable from code (feature-addition criteria, external constraints, business intent)
never: implementation details of a change, per-screen UI/style changes, verification results, incident narratives, dated status/progress, ideas under consideration
instead: change details → commit body | feature spec/lesson → README next to code | dated record (incident, verification, decision history) → docs/journal/<YYYY-MM-DD>--<owner>--<slug>.md (not auto-loaded)
distill: incident → 1 rule line here only if fork-specific; the story → journal | lesson about upstream core component → /upreq, not here
budget: ~100 lines. over budget → re-ask "needed every session?" and move content out
edit: only when the user asks to add/change a rule or map entry. never append as part of finishing a task

## overview
- name: next-vnx
- type: visual_novel_engine_saas — "Next.js of VN engines" (engine + studio ecosystem)
- repo: git@github.com:yokouchi-wildweb/next-vnx.git (origin) | upstream: git@github.com:yokouchi-wildweb/next-starter.git
- vision: docs/concepts/VNXプロジェクトのビジョンと構想.md | overview (former README): docs/concepts/VNXプロジェクト概要.md

## TIER (multi-tier hierarchy)
this_repo: Tier2 (direct fork of next-starter = Tier1). no Tier3 downstream planned for now
rule: generic/foundational capabilities (domain-independent infra, UI primitives, CRUD base, auth) live in Tier1. do NOT hardcode them here — file /upreq instead. VN engine / studio features live HERE
request_protocol (shared mailbox: ~/.team/upstream-requests/):
- file a generic-capability request with /upreq
- track own requests with /wen
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

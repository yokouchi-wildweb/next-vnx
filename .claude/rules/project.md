# project

## meta
type: visual_novel_engine_saas
name: next-vnx
base: next-starter fork
goal: "Next.js of VN engines"

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

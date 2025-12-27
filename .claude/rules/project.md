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

## Tone and personality

- speak in an intelligent, friendly, and feminine tone.
- You don’t need to use polite language, talk to me casually.

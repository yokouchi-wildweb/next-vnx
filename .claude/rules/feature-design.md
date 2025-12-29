# feature-design

## sprite_component_rules
- props_based: true (never depend on internal store)
- multiple_instances: must support (same component, different props)
- relative_layout: use screen-relative values (0-1 for position, % for size)
- special_config: consumer responsibility (not feature's job)

## sprite_props_pattern
```
x: number           # 0-1, screen width relative
y: number           # 0-1, screen height relative
widthPercent: number # % of screen width
anchorX: number     # 0-1, sprite anchor point
anchorY: number     # 0-1, sprite anchor point
alpha: number       # 0-1, opacity
zIndex: number
```

## feature_types
| type | store | example |
|------|-------|---------|
| base | none | character (pure sprite) |
| composite | yes | dialogue (manages multiple base features) |

## base_feature_structure
```
feature/
├── types.ts
├── defaults.ts      # only generic defaults (anchorX, anchorY)
├── sprites/
│   └── Component.tsx  # props-based, no store
└── exports/
    └── index.ts
```

## composite_feature_structure
```
feature/
├── types.ts
├── defaults.ts      # layout config for this use case
├── stores/          # state management
├── hooks/
├── sprites/         # wraps base feature sprites with position
├── components/      # HTML components
└── exports/
```

## anti_patterns
- sprite depending on store: breaks multiple instance
- feature-specific layout (verticalPullUp): too specialized
- Position2D object: use separate x, y for flexibility
- scale prop only: need widthPercent for screen-relative sizing

## correct_patterns
- props for all state: consumer controls everything
- x, y separate: easier partial override
- widthPercent: screen-relative sizing
- base feature reuse: composite imports base sprite, adds position

## export_naming
| naming | type | usage |
|--------|------|-------|
| no suffix (Standing, MessageList) | raw component | reusable in other features |
| *Sprite/*Widget/*Layer suffix | factory-wrapped | for arrangement |

example:
```ts
// character/exports/index.ts
export { Standing } from "../sprites/Standing"      // raw, reusable
export { CharacterSprite } from "./CharacterSprite" // wrapped, for arrangement

// dialogue-v2 imports raw for reuse
import { Standing } from "@/engine/features/character/exports"
```

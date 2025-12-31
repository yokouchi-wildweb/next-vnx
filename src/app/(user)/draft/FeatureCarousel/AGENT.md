# FeatureCarousel

## overview
3D pentagon-plate carousel with holographic floating image/text
theme: futuristic, next-gen

## files
- index.tsx: carousel container, 3D transform logic
- PentagonCard.tsx: individual card with 3D plate layout
- uses: ../SectionTitle (neon glow title component)

## architecture
```
FeatureCarousel (carousel logic)
  └─ PentagonCard (3D scene)
       ├─ pentagon plate (rotateX 70deg, floor-like)
       ├─ floating image (upright, on plate)
       └─ text panel (desktop: 3D / mobile: outside)
```

## responsive
breakpoint: 768px
| | mobile | desktop |
|---|---|---|
| cardSize | 300px | 540px |
| image bottom | size*0.20 | size*0.30 |
| text location | outside 3D (below) | inside 3D (translateZ) |
| text width | size*1.0 | size*0.6 |

hook: useViewportSizeStore

## PentagonCard

### props
| prop | type | default | desc |
|---|---|---|---|
| image | string | - | path (use imgPath util) |
| title | string | - | |
| description | string | - | |
| size | number | 450 | card size px |
| gradientFrom | string | oklch(0.85 0.15 85) | border gradient start |
| gradientTo | string | oklch(0.75 0.18 60) | border gradient end |
| borderWidth | number | 4 | pentagon border px |
| className | string | - | |

### 3D structure
```
wrapper (flex col, width: size)
├─ 3D container (perspective: 1000px, height: size*0.8)
│   └─ 3D scene (preserve-3d)
│       ├─ pentagon plate
│       │   size: 1.4x
│       │   transform: rotateX(70deg)
│       │   origin: center bottom
│       │   layers: gradient border → bg-card/90 → gloss
│       │   clip-path: polygon(50% 0%, 97.55% 34.55%, 79.39% 90.45%, 20.61% 90.45%, 2.45% 34.55%)
│       │
│       ├─ image (upright)
│       │   size: 0.85x × 0.55x
│       │   translateZ: -0.2x (behind)
│       │   effects: glow blur + hologram overlay + scanlines
│       │
│       └─ text panel (desktop only)
│           width: size*0.6
│           translateZ: 0.05x (front)
│           bg: rgba(0,0,0,0.7) + backdrop-blur
│
└─ mobile text (outside 3D, mt-4)
```

### pentagon math
regular pentagon, top vertex
vertices at 72° intervals from center (50%,50%), radius 50%
```
0: 50%, 0%
1: 97.55%, 34.55%
2: 79.39%, 90.45%
3: 20.61%, 90.45%
4: 2.45%, 34.55%
```

### effects
- hologram glow: blur-xl gradient behind image/text
- hologram overlay: diagonal gradient with white/cyan
- scanlines: repeating-linear-gradient 2px bands
- box-shadow: drop shadow + colored glow

## FeatureCarousel (index.tsx)

### state
- activeIndex: current card (useState)
- cardSize: responsive (useViewportSizeStore)

### data
```ts
type Feature = {
  id: string
  image: string
  title: string
  description: string
  gradientFrom: string  // oklch
  gradientTo: string    // oklch
}
```

### carousel 3D
container: perspective 1000px, preserve-3d

position configs by distance from active:
| pos | scale | translateZ | rotateY | opacity |
|---|---|---|---|---|
| 0 (active) | 1.0 | 0 | 0 | 1 |
| ±1 | 0.55 | -350 | ∓30 | 0.6 |
| ±2 | 0.35 | -550 | ∓40 | 0.3 |
| >2 | 0.3 | -500 | 0 | 0 (hidden) |

translateX: size * 0.84 (pos±1), size * 1.22 (pos±2)

### navigation
- prev/next buttons (left/right)
- dot indicators (bottom)
- click non-active card to select
- loop: (index % total + total) % total

### sizing
| const | value |
|---|---|
| CARD_SIZE_MOBILE | 300 |
| CARD_SIZE_DESKTOP | 540 |
| BREAKPOINT | 768 |
| container height | 420px (mobile) / 520px (desktop) |

## customization

### change colors
modify Feature.gradientFrom/gradientTo (oklch recommended)

### adjust 3D depth
- plateRotateX: plate angle (default 70)
- translateZ values in getCardStyle configs
- image/text translateZ in PentagonCard

### sizing ratios (PentagonCard)
```
plate: 1.4x
image: 0.85x × 0.55x
image bottom: 0.20x (mobile) / 0.30x (desktop)
text width: 1.0x (mobile) / 0.6x (desktop)
text bottom: 0.15x
container height: 0.8x
```

## dependencies
- @/lib/cn
- @/utils/assets (imgPath)
- @/stores/viewportSize (useViewportSizeStore)
- next/image

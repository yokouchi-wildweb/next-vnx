# SectionTitle

## overview
futuristic section title with neon glow, decorative lines, data noise background
reusable across draft page sections

## props
| prop | type | default | desc |
|---|---|---|---|
| title | string | required | main title text |
| subtitle | string | - | optional subtitle |
| color | enum | "cyan" | neon color theme |
| size | enum | "lg" | title size |
| showLines | boolean | true | decorative dot+line |
| showBorder | boolean | true | glowing border frame |
| showNoise | boolean | true | data noise background |
| className | string | - | additional classes |

## color options
- cyan (default): blue-cyan neon
- pink: magenta-pink neon
- purple: violet-purple neon
- green: emerald-green neon
- orange: amber-orange neon

## size options
| size | title | subtitle | dot | line |
|---|---|---|---|---|
| sm | 2xl/4xl | xs/sm | 1.5 | 6/12 |
| md | 3xl/5xl | sm/base | 2 | 8/16 |
| lg | 4xl/6xl | sm/base | 2.5 | 10/20 |

## structure
```
container (text-center)
└─ inner (inline-flex flex-col)
    ├─ noise bg (repeating-linear-gradient grid)
    ├─ noise grain (svg feTurbulence)
    ├─ border frame (1px + box-shadow inset/outer)
    ├─ title row (flex items-center)
    │   ├─ left line (dot + gradient line)
    │   ├─ h2 (gradient text + drop-shadow glow)
    │   └─ right line (gradient line + dot)
    └─ subtitle (text-white/60)
```

## effects

### neon text
- background: oklch gradient (3-stop)
- background-clip: text
- filter: drop-shadow (double layer glow)

### decorative lines
- dot: rounded-full + box-shadow glow
- line: gradient to transparent + box-shadow

### data noise
- grid: repeating-linear-gradient (horizontal + vertical)
- grain: svg feTurbulence fractalNoise
- opacity: 0.2-0.3, mix-blend-overlay

### border frame
- border: 1px solid (color with 0.2 alpha)
- box-shadow: inset glow + outer glow

## usage
```tsx
import { SectionTitle } from "../SectionTitle";

<SectionTitle
  title="Features"
  subtitle="説明テキスト"
  color="cyan"
  size="lg"
  className="mb-12 md:mb-20"
/>
```

## customization

### add new color
1. add to color type union
2. add COLOR_CONFIGS entry with:
   - dot: tailwind bg + shadow classes
   - line: tailwind from-* class
   - lineShadow: shadow class
   - gradient: oklch linear-gradient string
   - glow: drop-shadow filter string
   - noise: rgba color for grid
   - border: rgba color for border
   - boxShadow: inset + outer shadow string

### add new size
1. add to size type union
2. add SIZE_CONFIGS entry with:
   - title: text-* classes (mobile/desktop)
   - subtitle: text-* classes
   - dot: w-* h-* classes
   - line: w-* classes (mobile/desktop)
   - gap: gap-* classes
   - padding: px-* py-* classes

## dependencies
- @/lib/cn

# Design System — Anand Nalanda Portfolio

## Foundations

### Color

The palette is intentionally narrow: one base tone, one accent, and a system of black opacities for hierarchy.

#### Base Tone
| Token              | Value                    | Usage                          |
|--------------------|--------------------------|--------------------------------|
| `surface`          | `#ffffff`                | Page background, card fills    |
| `surface-muted`    | `#fafafa`                | Subtle panel backgrounds       |
| `surface-border`   | `rgba(0, 0, 0, 0.03)`   | Card borders, dividers         |

#### Text
| Token           | Value                     | Usage                          |
|-----------------|---------------------------|--------------------------------|
| `txt-heading`   | `rgb(37, 36, 41)`        | Headings, names, bold labels   |
| `txt-primary`   | `rgba(37, 36, 41, 0.8)`  | Body text, descriptions        |
| `txt-secondary` | `rgba(37, 36, 41, 0.4)`  | Meta text, timestamps, labels  |

#### Accent
| Token          | Value     | Usage                          |
|----------------|-----------|--------------------------------|
| `accent`       | `#6366f1` | Links, selection highlight     |
| `accent-light` | `#818cf8` | Hover states on accent         |

#### Black Opacity Scale
Used inline via Tailwind `black/[opacity]` for micro-level hierarchy without introducing new colors.

| Opacity  | Usage                                      |
|----------|--------------------------------------------|
| `0.03`   | Resting button/icon backgrounds            |
| `0.04`   | Subtle borders, active backgrounds         |
| `0.06`   | Default dividers, table borders            |
| `0.07`   | Hover backgrounds (from 0.04)              |
| `0.08`   | Dashboard card borders                     |
| `0.10`   | Input borders                              |
| `0.15`   | Decorative text, selection background      |
| `0.25`   | Placeholder text                           |
| `0.30`   | Labels, meta text                          |
| `0.40`   | Secondary text (matches `txt-secondary`)   |
| `0.60`   | Subdued icons                              |
| `0.80`   | Strong icons, buttons                      |

#### Semantic Colors (Cards)
| Color     | Hex       | Usage                        |
|-----------|-----------|------------------------------|
| Teal      | `#2aa198` | BioCard keyword "startups"   |
| Amber     | `#e6994a` | BioCard keyword "teams"      |
| Coral     | `#d95b5b` | BioCard keyword "founders"   |

#### Selection
```css
::selection {
  background: rgba(99, 102, 241, 0.15);
  color: rgb(37, 36, 41);
}
```

---

### Typography

#### Font Stack
| Role      | Family                                     | Weight | Source       |
|-----------|--------------------------------------------|--------|--------------|
| Primary   | Geist Sans, system-ui, sans-serif          | 400–700| `geist/font` |
| Accent    | Spectral                                   | 400    | Google Fonts |

Geist Sans is the default for all UI. Spectral is used sparingly for section group headings on case study pages to add editorial weight.

#### Type Scale
| Name         | Size   | Weight     | Line Height | Letter Spacing   | Usage                              |
|--------------|--------|------------|-------------|------------------|------------------------------------|
| Display      | 28px   | semibold   | tight (1.2) | -0.02em          | Case study intro titles            |
| Heading      | 24px   | normal     | —           | -1px             | Section group labels (Spectral)    |
| Title        | 22px   | semibold   | —           | -0.01em          | Bio intro, closing section titles  |
| Subtitle     | 18px   | semibold   | —           | —                | Narrative section titles           |
| Body         | 15px   | normal     | 1.7         | —                | Narrative paragraphs               |
| Card Title   | 14px   | semibold   | tight       | —                | Bento tile headings, nav links     |
| Secondary    | 13px   | normal     | snug        | —                | Card descriptors, table data       |
| Caption      | 12px   | normal     | —           | 0.08em           | Uppercase labels, footer           |
| Mono Label   | 11px   | mono       | —           | 0.12em           | Artifact labels (uppercase)        |

#### Dashboard Mockup Scale (miniature UI)
| Size | Usage                           |
|------|---------------------------------|
| 10px | Nav text, generic labels        |
| 9px  | Navigation items, chat messages |
| 8px  | Form labels, small details      |
| 7px  | Timestamps, micro text          |

---

### Spacing

Built on the default Tailwind 4px grid. Key recurring values:

| Token  | Value | Usage                                    |
|--------|-------|------------------------------------------|
| `gap-6`| 24px  | Bento grid gap                           |
| `px-12`| 48px  | Page-level horizontal padding            |
| `px-10`| 40px  | Case study inner content (md+)           |
| `px-6` | 24px  | Case study content (default)             |
| `px-5` | 20px  | Card inner padding, nav button           |
| `px-4` | 16px  | Mobile page padding, narrative sections  |
| `py-16`| 64px  | Case study vertical padding              |
| `pt-6` | 24px  | Navbar top, grid top                     |
| `pb-12`| 48px  | Footer bottom                            |
| `p-6`  | 24px  | Card content padding                     |
| `mb-6` | 24px  | Narrative section bottom margin          |
| `mt-12`| 48px  | Section group heading top margin         |

---

### Border Radius

| Token           | Value | Usage                                |
|-----------------|-------|--------------------------------------|
| `rounded-card`  | 24px  | All bento cards                      |
| `rounded-[32px]`| 32px  | Large artifact panels, inner frames  |
| `rounded-2xl`   | 16px  | Mobile artifact containers           |
| `rounded-xl`    | 12px  | Tables, dashboard cards              |
| `rounded-lg`    | 8px   | Question cards, dashboard elements   |
| `rounded-[10px]`| 10px  | Dropdown menu items                  |
| `rounded-full`  | 50%   | Circular buttons, avatars, pills     |

---

### Borders

| Style                      | Usage                                 |
|----------------------------|---------------------------------------|
| `border-2 border-surface-border` | Primary card borders (2px)      |
| `border border-black/[0.06]`     | Dividers, table rows            |
| `border-l-[2.4px]`              | Narrative section active indicator|
| `border-dashed`                  | Placeholder zones               |

---

### Shadows

| Name           | Value                              | Usage                  |
|----------------|------------------------------------|------------------------|
| Card hover     | `0 8px 24px rgba(0,0,0,0.06)`     | Bento tile hover lift  |
| Dropdown       | `0 8px 32px rgba(0,0,0,0.08)`     | Navbar dropdown        |
| Artifact panel | `shadow-lg` (Tailwind default)     | Case study dashboards  |

Shadows are applied via Framer Motion `whileHover`, not static CSS — cards have zero shadow at rest.

---

## Motion

### Easing

One primary easing curve used globally:

```
cubic-bezier(0.22, 1, 0.36, 1)
```

Defined as `const ease = [0.22, 1, 0.36, 1]` in components. Smooth deceleration with a slight overshoot.

### Animation Patterns

| Pattern          | Initial                          | Animate                         | Duration | Usage                      |
|------------------|----------------------------------|---------------------------------|----------|----------------------------|
| Fade up          | `opacity: 0, y: 12`             | `opacity: 1, y: 0`             | 0.45–0.5s| Cards, page sections       |
| Fade in          | `opacity: 0`                     | `opacity: 1`                    | 0.5–0.6s | Footer, back links         |
| Slide down       | `opacity: 0, y: -20`            | `opacity: 1, y: 0`             | 0.5s     | Navbar entrance            |
| Dropdown open    | `opacity: 0, y: 4, scale: 0.96` | `opacity: 1, y: 0, scale: 1`   | 0.2s     | Navbar dropdown            |
| Stagger items    | `opacity: 0, x: -8`             | `opacity: 1, x: 0`             | delay × i| Dropdown list items        |
| Card hover       | —                                | `y: -2`, shadow appears         | —        | Bento tiles on hover       |
| Cross-fade       | `opacity: 0`                     | `opacity: 1` (exit: `0`)       | 0.4s     | Dashboard before/after     |

### Scroll-Triggered Animations

Cards use `whileInView` with `viewport={{ once: true, margin: "-40px" }}` — they animate in once when 40px into the viewport. The footer uses `margin: "-50px"`.

### Narrative Section Transitions

Active state transitions use CSS (not Framer Motion):
```
transition-all duration-[250ms] ease-out
```
- Active: `border-l-txt-secondary bg-surface-muted opacity-100`
- Inactive: `border-l-transparent opacity-[0.75]`

Detected via `IntersectionObserver` with `rootMargin: "-49% 0px -49% 0px"`.

---

## Layout

### Container Widths

| Element      | Max Width  |
|--------------|------------|
| Navbar       | 1104px     |
| Bento grid   | 1200px     |
| Footer       | 1200px     |

### Bento Grid

4-column grid with fixed 258px cells and 24px gap.

```
grid-template-columns: repeat(4, 258px)
grid-auto-rows: 258px
gap: 24px
```

#### Tile Variants
| Variant  | Grid Span           | Dimensions   |
|----------|---------------------|--------------|
| `large`  | `col-span-2 row-span-2` | 540×540px |
| `tall`   | `row-span-2`        | 258×540px    |
| `wide`   | `col-span-2`        | 540×258px    |
| `square` | default             | 258×258px    |

#### Responsive Breakpoints
| Breakpoint | Columns         | Row Height |
|------------|-----------------|------------|
| Default    | 4 × 258px       | 258px      |
| `< lg`     | 2 × 1fr         | 258px      |
| `< md`     | 1 × 1fr         | 280px      |

### Case Study Layout

Two-column layout that stacks on mobile:

| Column | Width                            | Behavior                |
|--------|----------------------------------|-------------------------|
| Left   | 440px (md) / 480px (lg)          | Scrolling narrative     |
| Right  | flex-1                           | Sticky artifact panel   |

The right panel is `sticky top-0 h-screen` with a warm beige (`#f5f0eb`) rounded container holding dashboard mockups.

Below `lg`, the layout stacks vertically and the artifact panel hides (`max-lg:hidden`).

---

## Components

### Navbar
- Sticky, `z-50`, blurred background (`bg-white/96 backdrop-blur-xl`)
- Three elements in a row: starburst icon (40×40), Selected Work dropdown (h-10), mail icon (40×40)
- Dropdown: `AnimatePresence` with scale + fade animation, 2px rounded items

### Bento Cards
- All cards share: `bg-white rounded-card border-2 border-surface-border overflow-hidden`
- Hover: lifts 2px with shadow via Framer Motion
- Bottom gradient overlay for title/descriptor text
- Entrance: fade-up on scroll into view

### Narrative Section (Case Studies)
- Left border indicator (2.4px) activates on scroll intersection
- Group headings in Spectral italic above section clusters
- Continue Reading links at bottom with hover background shift

### Footer
- Simple flex row: copyright left, email CTA right
- Email link: `font-bold text-txt-heading hover:text-accent`
- Fades in on scroll

---

## Interaction States

| Element              | Resting               | Hover                            |
|----------------------|-----------------------|----------------------------------|
| Icon buttons         | `bg-black/[0.03]`     | `bg-black/[0.06]`               |
| Selected Work pill   | `bg-black/[0.04]`     | `bg-black/[0.07]`               |
| Bento cards          | flat, no shadow       | `y: -2`, shadow appears          |
| Continue Reading     | transparent           | `bg-black/[0.02]`               |
| Email link           | `text-txt-heading`    | `text-accent`                    |
| Narrative section    | 75% opacity, no border| 100% opacity, left border active |

---

## Files

| File                              | Purpose                              |
|-----------------------------------|--------------------------------------|
| `tailwind.config.ts`             | Design tokens (colors, radii, grid)  |
| `app/globals.css`                | Reset, selection styles, utilities   |
| `app/layout.tsx`                 | Geist Sans font, metadata            |
| `app/components/Navbar.tsx`      | Navigation with dropdown             |
| `app/components/BentoGrid.tsx`   | Homepage grid composition            |
| `app/components/BentoTile.tsx`   | Generic tile with variants           |
| `app/components/Footer.tsx`      | Footer with email CTA                |
| `app/components/cards/*.tsx`     | 7 specialized card components        |
| `app/*/page.tsx`                 | Case study pages (4 routes)          |

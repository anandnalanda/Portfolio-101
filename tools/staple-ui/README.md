# staple-ui — isolated Untitled UI build

This folder is a **self-contained Tailwind CSS v4 toolchain** that exists only to
compile the Untitled UI stylesheet for the Staple Chat screen. It has its own
`package.json` / `node_modules` so **Tailwind v4 never enters the app's
node_modules** — the rest of the site stays on Tailwind v3, untouched.

## What it does

1. `input.css` pulls in Tailwind v4 + Untitled UI's vendored `theme.css` /
   `typography.css` + the React Aria / typography / animate plugins, and scans
   **only** `components/screens/staple-chat/**` (via `source(none)` + `@source`).
2. `build.mjs`:
   - compiles it with the isolated Tailwind v4 CLI,
   - **scopes every selector under `.staple-theme`** (so nothing leaks into the
     Tailwind v3 site; `:root`/`html`/`body` are folded onto the wrapper),
   - **unwraps `@layer`** (the app's Tailwind v3 PostCSS plugin errors on v4's
     `@layer base`), preserving source order,
   - runs a **leak audit** that fails the build if any selector escapes
     `.staple-theme`,
   - writes `components/screens/staple-chat/ui.generated.css` (committed).

## Regenerate

Run this whenever the screen's classes or the vendored Untitled UI source change:

```bash
cd tools/staple-ui
npm install   # first time only
npm run build
```

The only output that flows back into the app is the scoped
`ui.generated.css`. Everything else here stays out of the app bundle.

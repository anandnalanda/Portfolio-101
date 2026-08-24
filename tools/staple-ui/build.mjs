/**
 * Compiles the shared Staple product / Untitled UI stylesheet with the
 * isolated Tailwind v4 engine, then scopes EVERY rule under `.staple-theme` so
 * it cannot affect the rest of the (Tailwind v3) site. Scans every Staple
 * product screen tree (Chat + Tables) plus the shared vendored UI.
 *
 * Output: components/screens/_ui/ui.generated.css
 */
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import postcss from "postcss";
import prefixer from "postcss-prefix-selector";

const dir = path.dirname(fileURLToPath(import.meta.url));
const WRAPPER = ".staple-theme";
const rawPath = path.join(dir, "raw.generated.css");
const outPath = path.join(
  dir,
  "../../components/screens/_ui/ui.generated.css"
);

// 1) Compile with the isolated Tailwind v4 CLI.
const bin = path.join(dir, "node_modules/.bin/tailwindcss");
console.log("• compiling with Tailwind v4…");
execFileSync(bin, ["-i", "input.css", "-o", rawPath, "--minify"], {
  cwd: dir,
  stdio: "inherit",
});

// 2) Scope every selector under `.staple-theme`.
//    Root/base selectors are folded onto the wrapper itself so the design
//    tokens (defined by @theme on :root) and preflight resets live on it.
const raw = fs.readFileSync(rawPath, "utf8");

const FOLD_TO_WRAPPER = new Set([":root", ":host", "html", "body"]);

// The app's Tailwind v3 PostCSS plugin processes every CSS file imported into
// the app and throws on the v4-emitted `@layer base/components/utilities`
// wrappers. Unwrap all `@layer` at-rules (keeping source order, so utilities —
// emitted last — still win on equal specificity) so no `@layer` survives.
const unwrapLayers = {
  postcssPlugin: "unwrap-layers",
  OnceExit(root) {
    root.walkAtRules("layer", (at) => {
      if (at.nodes) at.replaceWith(at.nodes);
      else at.remove();
    });
  },
};

const scoped = postcss([
  prefixer({
    prefix: WRAPPER,
    transform(prefix, selector, prefixedSelector) {
      const s = selector.trim();
      if (FOLD_TO_WRAPPER.has(s)) return prefix;
      // already scoped (defensive)
      if (s.startsWith(prefix)) return s;
      return prefixedSelector;
    },
  }),
  unwrapLayers,
]).process(raw, { from: rawPath }).css;

fs.writeFileSync(outPath, scoped);

// 3) Leak audit: no top-level rule may target outside `.staple-theme`.
//    (Ignore @property / @keyframes internals — they don't style elements.)
const root = postcss.parse(scoped);
const leaks = [];
root.walkRules((rule) => {
  // skip keyframe step selectors (from/to/%)
  if (rule.parent && rule.parent.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
  for (const sel of rule.selectors) {
    const s = sel.trim();
    if (!s.includes(WRAPPER)) leaks.push(s);
  }
});

const bytes = fs.statSync(outPath).size;
console.log(`• wrote ${path.relative(path.join(dir, "../.."), outPath)} (${(bytes / 1024).toFixed(1)} kB)`);
if (leaks.length) {
  console.error(`✗ LEAK: ${leaks.length} unscoped selectors, e.g.:`);
  console.error("  " + [...new Set(leaks)].slice(0, 20).join("\n  "));
  process.exit(1);
}
console.log("✓ all selectors scoped under .staple-theme");

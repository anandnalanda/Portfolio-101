"use client";

import { motion, useReducedMotion } from "framer-motion";
import { doorSvg } from "./doorSvg";

/**
 * Door — the switch/panel illustration (Figma "Container" export). Frame/door
 * sizing baked: overallSize 1.15, frameThickness 12px (0.9545), doorSize 1.
 *
 * The SVG string is split once at module load and re-assembled as React, with
 * the two door panels as REAL `motion.g` components — framer-motion's
 * supported SVG path — so `animate={{ x }}` works properly. Springs give
 * sliding-door physics (push → glide → cushioned stop, no bounce) and are
 * interruptible mid-travel.
 */
const TRAVEL = 72; // px each panel slides
const OPEN_SPRING = {
  type: "spring",
  stiffness: 170,
  damping: 26,
  mass: 1.2,
} as const;
const CLOSE_SPRING = {
  type: "spring",
  stiffness: 210,
  damping: 30,
  mass: 1.1,
} as const;

/* ── split the baked SVG into parts around the door groups ─────────────── */
const M = {
  clip0: `<g clip-path="url(#clip0_40007140_6406)">`,
  clip1: `<g clip-path="url(#clip1_40007140_6406)" transform="translate(129 129) scale(1.15) translate(-129 -129)">`,
  nested: `<svg x="42" y="41" width="176" height="176" viewBox="42 41 176 176" overflow="hidden">`,
  innerClip: `<g clip-path="url(#clipInnerFrame)">`,
  doorScale: `<g transform="translate(130 129) scale(1) translate(-130 -129)">`,
  right: `<g class="door door--right">`,
  left: `<g class="door door--left">`,
} as const;

/** inner markup of a balanced <g> group starting at `open`'s position */
function groupInner(src: string, open: string): string {
  const at = src.indexOf(open);
  if (at < 0) throw new Error(`doorSvg marker missing: ${open.slice(0, 40)}`);
  let i = at + open.length;
  let depth = 1;
  const re = /<g[ >]|<\/g>/g;
  re.lastIndex = i;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m[0] === "</g>") {
      if (--depth === 0) return src.slice(at + open.length, m.index);
    } else depth++;
  }
  throw new Error("doorSvg group unbalanced");
}

/** trim trailing </g> tokens until the chunk's <g>/</g> counts balance */
function balance(chunk: string): string {
  let out = chunk;
  for (;;) {
    const opens = (out.match(/<g[ >]/g) ?? []).length;
    const closes = (out.match(/<\/g>/g) ?? []).length;
    if (closes <= opens) return out;
    const last = out.lastIndexOf("</g>");
    out = out.slice(0, last) + out.slice(last + 4);
  }
}

function parse(src: string) {
  for (const marker of Object.values(M)) {
    if (!src.includes(marker)) {
      throw new Error(`doorSvg marker missing: ${marker.slice(0, 50)}`);
    }
  }
  const backing = src.slice(
    src.indexOf(M.clip0) + M.clip0.length,
    src.indexOf(M.clip1),
  );
  const rightInner = groupInner(src, M.right);
  const leftInner = groupInner(src, M.left);
  // between the first thickness wrapper's open and the nested svg: nothing but
  // whitespace (verified) — the wrapper itself is re-created as JSX below.
  const nestedClose = src.indexOf("</svg>");
  const defsAt = src.indexOf("<defs>");
  // everything after the nested svg up to <defs>: starts with the thickness
  // wrapper's stray close (JSX manages that element now) — drop it, then trim
  // the tail closes that belong to JSX-managed ancestors.
  let rest = src.slice(nestedClose + "</svg>".length, defsAt);
  rest = rest.replace(/^\s*<\/g>/, "");
  rest = balance(rest);
  const defs = src.slice(defsAt + "<defs>".length, src.indexOf("</defs>"));
  return { backing, rightInner, leftInner, rest, defs };
}

const PARTS = parse(doorSvg);
const THICK = "translate(130 129) scale(0.9545) translate(-130 -129)";

export default function DoorIllustration({ open = false }: { open?: boolean }) {
  const reduced = useReducedMotion() ?? false;
  const spring = reduced
    ? ({ duration: 0 } as const)
    : open
      ? OPEN_SPRING
      : CLOSE_SPRING;

  return (
    <div className="absolute inset-0">
      <svg
        viewBox="0 0 258 258"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-full w-full"
        aria-hidden
      >
        <g clipPath="url(#clip0_40007140_6406)">
          <g dangerouslySetInnerHTML={{ __html: PARTS.backing }} />
          <g
            clipPath="url(#clip1_40007140_6406)"
            transform="translate(129 129) scale(1.15) translate(-129 -129)"
          >
            <g transform={THICK}>
              <svg
                x="42"
                y="41"
                width="176"
                height="176"
                viewBox="42 41 176 176"
                overflow="hidden"
              >
                <g clipPath="url(#clipInnerFrame)">
                  <g transform="translate(130 129) scale(1) translate(-130 -129)">
                    <motion.g
                      initial={false}
                      animate={{ x: open ? TRAVEL : 0 }}
                      transition={spring}
                      dangerouslySetInnerHTML={{ __html: PARTS.rightInner }}
                    />
                    <motion.g
                      initial={false}
                      animate={{ x: open ? -TRAVEL : 0 }}
                      transition={spring}
                      dangerouslySetInnerHTML={{ __html: PARTS.leftInner }}
                    />
                  </g>
                </g>
              </svg>
            </g>
            <g dangerouslySetInnerHTML={{ __html: PARTS.rest }} />
          </g>
        </g>
        <defs dangerouslySetInnerHTML={{ __html: PARTS.defs }} />
      </svg>
    </div>
  );
}

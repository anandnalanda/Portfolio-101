"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Interactive globe — ported verbatim from the OFM Jobs homepage
 * (src/components/HiringGlobe.tsx), with that page's marketing chrome removed
 * so it can stand on its own here. The engine below is unchanged apart from
 * two additions marked PORT:.
 *
 * It has no dependencies. No three.js, no WebGL, no d3, no map data — a 2D
 * canvas, ~40 ellipse parameters for the continents, and maths.
 */

/* ═══════════════════════════════════════════════════════════════════
   Math & color utilities
   ═══════════════════════════════════════════════════════════════════ */
const TAU = Math.PI * 2;
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function oklchToRgb(L: number, C: number, hDeg: number): [number, number, number] {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h),
    b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_,
    m = m_ * m_ * m_,
    s = s_ * s_ * s_;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const toSRGB = (v: number) => {
    v = clamp(v, 0, 1);
    return v <= 0.0031308
      ? 12.92 * v
      : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  };
  return [(toSRGB(r) * 255) | 0, (toSRGB(g) * 255) | 0, (toSRGB(bl) * 255) | 0];
}

/* Green/emerald palette, high luminance for dark bg */
const PALETTE: [number, number, number][] = [
  [0.55, 0.15, 165],
  [0.68, 0.18, 155],
  [0.80, 0.17, 148],
  [0.92, 0.12, 142],
];

function palLookup(t: number): [number, number, number] {
  t = clamp(t, 0, 1);
  const seg = t * (PALETTE.length - 1);
  const i = Math.min(PALETTE.length - 2, Math.floor(seg));
  const u = seg - i;
  const a = PALETTE[i],
    b = PALETTE[i + 1];
  let h1 = a[2],
    h2 = b[2],
    dh = h2 - h1;
  if (dh > 180) dh -= 360;
  else if (dh < -180) dh += 360;
  return oklchToRgb(lerp(a[0], b[0], u), lerp(a[1], b[1], u), h1 + dh * u);
}

/* ═══════════════════════════════════════════════════════════════════
   Continent mask, hand-authored ellipses in lat/lon
   ═══════════════════════════════════════════════════════════════════ */
const CONTINENTS = [
  // North America
  { cLat: 45, cLon: -100, rLat: 18, rLon: 22, rot: 0.05, w: 1.0 },
  { cLat: 36, cLon: -80, rLat: 8, rLon: 7, rot: 0.15, w: 0.9 },
  { cLat: 57, cLon: -100, rLat: 12, rLon: 25, rot: 0.0, w: 0.85 },
  { cLat: 72, cLon: -95, rLat: 5, rLon: 10, rot: 0.0, w: 0.7 },
  { cLat: 64, cLon: -153, rLat: 7, rLon: 8, rot: 0.0, w: 0.8 },
  { cLat: 24, cLon: -103, rLat: 8, rLon: 7, rot: 0.0, w: 0.9 },
  { cLat: 14, cLon: -85, rLat: 5, rLon: 6, rot: 0.5, w: 0.75 },
  { cLat: 28, cLon: -82, rLat: 4, rLon: 2.5, rot: -0.2, w: 0.8 },
  // Greenland
  { cLat: 72, cLon: -42, rLat: 9, rLon: 10, rot: 0.15, w: 0.85 },
  // South America
  { cLat: 2, cLon: -62, rLat: 12, rLon: 14, rot: 0.0, w: 1.0 },
  { cLat: -10, cLon: -42, rLat: 12, rLon: 7, rot: 0.3, w: 0.95 },
  { cLat: -22, cLon: -65, rLat: 16, rLon: 5, rot: -0.05, w: 0.9 },
  { cLat: -38, cLon: -67, rLat: 10, rLon: 5, rot: 0.15, w: 0.85 },
  { cLat: 6, cLon: -72, rLat: 5, rLon: 7, rot: 0.0, w: 0.85 },
  // Europe
  { cLat: 48, cLon: 5, rLat: 6, rLon: 7, rot: 0.0, w: 0.95 },
  { cLat: 51, cLon: 20, rLat: 7, rLon: 9, rot: 0.0, w: 0.9 },
  { cLat: 40, cLon: -3, rLat: 4.5, rLon: 5.5, rot: 0.0, w: 0.9 },
  { cLat: 43, cLon: 12, rLat: 5, rLon: 2.5, rot: -0.4, w: 0.8 },
  { cLat: 64, cLon: 14, rLat: 8, rLon: 5, rot: 0.2, w: 0.85 },
  { cLat: 63, cLon: 28, rLat: 5, rLon: 6, rot: 0.0, w: 0.8 },
  { cLat: 54, cLon: -2, rLat: 5, rLon: 3, rot: 0.1, w: 0.8 },
  { cLat: 40, cLon: 23, rLat: 4, rLon: 4, rot: 0.0, w: 0.8 },
  { cLat: 65, cLon: -19, rLat: 2.5, rLon: 3, rot: 0.0, w: 0.6 },
  { cLat: 50, cLon: 38, rLat: 6, rLon: 8, rot: 0.0, w: 0.85 },
  // Africa
  { cLat: 28, cLon: 5, rLat: 7, rLon: 14, rot: 0.0, w: 0.95 },
  { cLat: 20, cLon: 25, rLat: 6, rLon: 8, rot: 0.0, w: 0.9 },
  { cLat: 10, cLon: -2, rLat: 8, rLon: 9, rot: 0.0, w: 0.95 },
  { cLat: 3, cLon: 20, rLat: 8, rLon: 11, rot: 0.0, w: 1.0 },
  { cLat: -4, cLon: 34, rLat: 10, rLon: 6, rot: 0.0, w: 0.95 },
  { cLat: 8, cLon: 43, rLat: 6, rLon: 6, rot: 0.4, w: 0.9 },
  { cLat: -15, cLon: 28, rLat: 9, rLon: 9, rot: 0.0, w: 0.95 },
  { cLat: -28, cLon: 25, rLat: 6, rLon: 7, rot: 0.0, w: 0.9 },
  { cLat: 24, cLon: 32, rLat: 5, rLon: 3, rot: 0.0, w: 0.85 },
  { cLat: -19, cLon: 47, rLat: 5, rLon: 2.5, rot: 0.3, w: 0.7 },
  // Middle East
  { cLat: 23, cLon: 46, rLat: 8, rLon: 7, rot: 0.2, w: 0.9 },
  { cLat: 39, cLon: 35, rLat: 3.5, rLon: 7, rot: 0.05, w: 0.85 },
  { cLat: 32, cLon: 54, rLat: 6, rLon: 8, rot: 0.0, w: 0.9 },
  { cLat: 34, cLon: 43, rLat: 4, rLon: 4, rot: 0.0, w: 0.85 },
  // Asia
  { cLat: 44, cLon: 66, rLat: 7, rLon: 12, rot: 0.0, w: 0.9 },
  { cLat: 58, cLon: 68, rLat: 10, rLon: 14, rot: 0.0, w: 0.9 },
  { cLat: 60, cLon: 110, rLat: 10, rLon: 18, rot: 0.0, w: 0.85 },
  { cLat: 58, cLon: 148, rLat: 10, rLon: 12, rot: 0.0, w: 0.8 },
  { cLat: 35, cLon: 108, rLat: 12, rLon: 13, rot: 0.0, w: 1.0 },
  { cLat: 47, cLon: 105, rLat: 5, rLon: 9, rot: 0.0, w: 0.85 },
  { cLat: 24, cLon: 80, rLat: 11, rLon: 7, rot: 0.0, w: 0.95 },
  { cLat: 11, cLon: 78, rLat: 5, rLon: 4, rot: -0.1, w: 0.9 },
  { cLat: 18, cLon: 102, rLat: 9, rLon: 7, rot: 0.0, w: 0.9 },
  { cLat: 4, cLon: 103, rLat: 4, rLon: 2, rot: -0.15, w: 0.75 },
  { cLat: -2, cLon: 113, rLat: 5, rLon: 12, rot: 0.0, w: 0.8 },
  { cLat: 12, cLon: 122, rLat: 6, rLon: 3, rot: 0.0, w: 0.7 },
  { cLat: 37, cLon: 138, rLat: 6, rLon: 3, rot: 0.4, w: 0.8 },
  { cLat: 37, cLon: 127, rLat: 4, rLon: 2, rot: 0.1, w: 0.75 },
  { cLat: 7.5, cLon: 81, rLat: 2, rLon: 1.5, rot: 0.0, w: 0.65 },
  // Oceania
  { cLat: -25, cLon: 134, rLat: 12, rLon: 18, rot: 0.0, w: 1.0 },
  { cLat: -6, cLon: 147, rLat: 3, rLon: 5, rot: 0.0, w: 0.75 },
  { cLat: -41, cLon: 174, rLat: 5, rLon: 2, rot: 0.3, w: 0.7 },
];

function isLand(latDeg: number, lonDeg: number) {
  const lon = (((lonDeg + 180) % 360) + 360) % 360 - 180;
  let best = 0;
  for (const c of CONTINENTS) {
    let dLon = lon - c.cLon;
    if (dLon > 180) dLon -= 360;
    else if (dLon < -180) dLon += 360;
    const dLat = latDeg - c.cLat;
    const latMidRad = (c.cLat * Math.PI) / 180;
    const dLonEff = dLon * Math.cos(latMidRad);
    const cr = Math.cos(c.rot),
      sr = Math.sin(c.rot);
    const xr = dLonEff * cr - dLat * sr;
    const yr = dLonEff * sr + dLat * cr;
    const nd = Math.sqrt((xr / c.rLon) ** 2 + (yr / c.rLat) ** 2);
    const contribution = Math.max(0, 1 - nd) * c.w;
    if (contribution > best) best = contribution;
  }
  return best;
}

/* ═══════════════════════════════════════════════════════════════════
   Sphere point set, Fibonacci / sunflower distribution
   ═══════════════════════════════════════════════════════════════════ */
interface SpherePoint {
  x: number;
  y: number;
  z: number;
  land: number;
  lat: number;
  lon: number;
}

const LAND_CUTOFF = 0.08;
const OCEAN_STRIDE = 3;

function generateSpherePoints(N: number): SpherePoint[] {
  const pts: SpherePoint[] = [];
  const GR = Math.PI * (1 + Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
    const theta = GR * i;
    const y = Math.cos(phi);
    const r = Math.sin(phi);
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const latDeg = 90 - (phi * 180) / Math.PI;
    let lonDeg = ((theta * 180) / Math.PI) % 360;
    if (lonDeg > 180) lonDeg -= 360;
    const land = isLand(latDeg, lonDeg);
    /* PORT: the original kept land only, so ~79% of the sphere was thrown
       away and the Pacific side came up empty. Ocean points are now kept at a
       stride and drawn much fainter: enough to read as a sphere, sparse
       enough not to compete with the land or triple the per-frame cost. */
    if (land > LAND_CUTOFF || i % OCEAN_STRIDE === 0) {
      pts.push({ x, y, z, land, lat: latDeg, lon: lonDeg });
    }
  }
  return pts;
}

/* ═══════════════════════════════════════════════════════════════════
   Cities, hiring hubs
   ═══════════════════════════════════════════════════════════════════ */
const CITIES = [
  { name: "San Francisco", lat: 37.77, lon: -122.42 },
  { name: "New York", lat: 40.71, lon: -74.0 },
  { name: "São Paulo", lat: -23.55, lon: -46.63 },
  { name: "London", lat: 51.51, lon: -0.13 },
  { name: "Berlin", lat: 52.52, lon: 13.4 },
  { name: "Dublin", lat: 53.35, lon: -6.26 },
  { name: "Lagos", lat: 6.52, lon: 3.37 },
  { name: "Nairobi", lat: -1.29, lon: 36.82 },
  { name: "Bangalore", lat: 12.97, lon: 77.59 },
  { name: "Singapore", lat: 1.35, lon: 103.82 },
  { name: "Tokyo", lat: 35.68, lon: 139.69 },
  { name: "Sydney", lat: -33.87, lon: 151.21 },
  { name: "Dubai", lat: 25.2, lon: 55.27 },
  { name: "Mexico City", lat: 19.43, lon: -99.13 },
  { name: "Toronto", lat: 43.65, lon: -79.38 },
  { name: "Stockholm", lat: 59.33, lon: 18.07 },
];

function latLonTo3D(latDeg: number, lonDeg: number) {
  const phi = ((90 - latDeg) * Math.PI) / 180;
  const theta = (lonDeg * Math.PI) / 180;
  return {
    x: Math.sin(phi) * Math.cos(theta),
    y: Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta),
  };
}

interface CityPoint {
  name: string;
  lat: number;
  lon: number;
  x: number;
  y: number;
  z: number;
}

const CITY_POINTS: CityPoint[] = CITIES.map((c) => ({
  ...c,
  ...latLonTo3D(c.lat, c.lon),
}));

function regionFor(p: { lat?: number; lon?: number }) {
  if (p.lat == null || p.lon == null) return "the field";
  const { lat, lon } = p;
  if (lat > 35 && lon > -130 && lon < -60) return "North America";
  if (lat < 12 && lat > -55 && lon > -85 && lon < -30) return "South America";
  if (lat > 35 && lon > -15 && lon < 45) return "Europe";
  if (lat < 40 && lat > -35 && lon > -20 && lon < 55) return "Africa";
  if (lat > 5 && lon > 45 && lon < 150) return "Asia";
  if (lat < -10 && lon > 110 && lon < 180) return "Oceania";
  return "the field";
}

/* ═══════════════════════════════════════════════════════════════════
   3D helpers
   ═══════════════════════════════════════════════════════════════════ */
function rotY(
  p: { x: number; y: number; z: number },
  c: number,
  s: number
) {
  return { x: p.x * c - p.z * s, y: p.y, z: p.x * s + p.z * c };
}
function rotX(
  p: { x: number; y: number; z: number },
  c: number,
  s: number
) {
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}
function transform(
  p: { x: number; y: number; z: number },
  cosR: number,
  sinR: number,
  cosT: number,
  sinT: number
) {
  return rotX(rotY(p, cosR, sinR), cosT, sinT);
}

function slerp(
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number },
  t: number
) {
  const dot = clamp(a.x * b.x + a.y * b.y + a.z * b.z, -1, 1);
  const om = Math.acos(dot);
  if (om < 1e-5) return { ...a };
  const s = Math.sin(om);
  const k1 = Math.sin((1 - t) * om) / s;
  const k2 = Math.sin(t * om) / s;
  return {
    x: a.x * k1 + b.x * k2,
    y: a.y * k1 + b.y * k2,
    z: a.z * k1 + b.z * k2,
  };
}

/* ═══════════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════════ */
export default function InteractiveGlobe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  /* PORT: the original had no reduced-motion path; the portfolio honours it
     everywhere, so the loop is simply never started when it is set. The globe
     still draws its first frame, so the page is not blank. */
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const canvas = canvasRef.current;
    const logEl = logRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    /* ── Canvas sizing ── */
    let W = 0,
      H = 0;
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    /* PORT: on the OFM homepage the globe sat at 0.72 across, pushed right to
       clear the headline in the left third, and its radius keyed off height
       alone because that section was always wider than it was tall. In a
       dedicated panel it is centred, and sized against the SHORTER edge so it
       fills the space without overflowing a tall, narrow column. */
    const CENTER_X = 0.5;
    const R_SCALE = 0.46;
    const radiusFor = (w: number, h: number) => Math.min(w, h) * R_SCALE;

    function fitCanvas() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas!.width = W * DPR;
      canvas!.height = H * DPR;
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    /* ── Globe state ── */
    const SPEED = 0.32;
    const DOT_SIZE = 1.6;
    let points: SpherePoint[] = [];
    let rot = 2.2;
    let tilt = -0.35;
    let rotVel = 0;
    let tiltVel = 0;
    let time = 0;
    const drag = {
      active: false,
      lastX: 0,
      lastY: 0,
      lastT: 0,
      vx: 0,
      vy: 0,
    };
    const hover = { over: false };
    const mouseScreen = { x: 0, y: 0, active: false };
    const globeInteract = { strength: 0 };

    function rebuildPoints() {
      points = generateSpherePoints(Math.round(26000 * 0.9));
    }

    /* ── Arcs ── */
    interface Arc {
      a: CityPoint;
      b: { x: number; y: number; z: number; name?: string; lat?: number; lon?: number };
      t: number;
      drawDur: number;
      holdDur: number;
      fadeDur: number;
      gapDur: number;
      hue: number;
    }

    let arcs: Arc[] = [];

    function makeArc(): Arc | null {
      const a = CITY_POINTS[(Math.random() * CITY_POINTS.length) | 0];
      let b: Arc["b"];
      if (Math.random() < 0.55 && points.length) {
        b = points[(Math.random() * points.length) | 0];
      } else {
        b = CITY_POINTS[(Math.random() * CITY_POINTS.length) | 0];
        if (b === a)
          b = CITY_POINTS[(Math.random() * CITY_POINTS.length) | 0];
      }
      const dot = a.x * b.x + a.y * b.y + a.z * b.z;
      if (dot > 0.985) return null;
      return {
        a,
        b,
        t: -Math.random() * 1.2,
        drawDur: 1.4 + Math.random() * 0.8,
        holdDur: 0.6 + Math.random() * 0.6,
        fadeDur: 1.0 + Math.random() * 0.6,
        gapDur: 0.4 + Math.random() * 1.0,
        hue: Math.random(),
      };
    }

    function ensureArcs(n: number) {
      while (arcs.length < n) {
        const arc = makeArc();
        if (arc) arcs.push(arc);
      }
    }

    /* ── Event log ── */
    const MAX_LOG = 4;
    function logEvent(from: string, to: string) {
      if (!logEl) return;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      const row = document.createElement("div");
      row.className = "globe-log-row";
      row.innerHTML = `<span class="globe-log-dot"></span><span class="globe-log-t">${hh}:${mm}:${ss}</span><span class="globe-log-c">${from} → ${to}</span>`;
      logEl.prepend(row);
      while (logEl.children.length > MAX_LOG) {
        logEl.removeChild(logEl.lastChild!);
      }
    }

    /* ── Draw ── */
    function draw(dt: number) {
      time += dt;

      /* check if mouse is over the globe circle */
      let mouseOverGlobe = false;
      if (mouseScreen.active && W > 0 && H > 0) {
        const rect = canvas!.getBoundingClientRect();
        const mx = mouseScreen.x - rect.left;
        const my = mouseScreen.y - rect.top;
        const gcx = W * CENTER_X, gcy = H * 0.5, gR = radiusFor(W, H);
        const d2 = ((mx - gcx) ** 2 + (my - gcy) ** 2) / (gR * gR);
        mouseOverGlobe = d2 <= 1;
      }

      /* rotation physics */
      if (!drag.active) {
        rotVel *= Math.pow(0.002, dt);
        tiltVel *= Math.pow(0.002, dt);
        rot += rotVel * dt;
        tilt += tiltVel * dt;
        if (!mouseOverGlobe && Math.abs(rotVel) < 0.02) {
          rot += SPEED * dt;
        }
      }
      tilt = clamp(tilt, -Math.PI / 2 + 0.05, Math.PI / 2 - 0.05);

      ctx!.clearRect(0, 0, W, H);
      const cx = W * CENTER_X,
        cy = H * 0.5;
      const R = radiusFor(W, H);
      const cosR = Math.cos(rot),
        sinR = Math.sin(rot);
      const cosT = Math.cos(tilt),
        sinT = Math.sin(tilt);

      /* atmosphere, very subtle so it blends with the bg */
      const g = ctx!.createRadialGradient(cx, cy, R * 0.95, cx, cy, R * 1.08);
      g.addColorStop(0, "rgba(155,246,190,0)");
      g.addColorStop(0.6, "rgba(155,246,190,0.04)");
      g.addColorStop(1, "rgba(128,217,163,0)");
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(cx, cy, R * 1.08, 0, TAU);
      ctx!.fill();

      /* ── Interaction bump, protrude dots near cursor ── */
      let bumpSx = 0, bumpSy = 0, bumpSz = 0, bumpValid = false;
      if (mouseScreen.active) {
        const rect = canvas!.getBoundingClientRect();
        const mx = mouseScreen.x - rect.left;
        const my = mouseScreen.y - rect.top;
        const ndx = (mx - cx) / R;
        const ndy = -(my - cy) / R;
        const d2 = ndx * ndx + ndy * ndy;
        if (d2 <= 1.3) {
          bumpSz = d2 <= 1 ? Math.sqrt(1 - d2) : 0;
          bumpSx = ndx;
          bumpSy = ndy;
          bumpValid = true;
        }
      }
      const bumpTarget = bumpValid ? 1 : 0;
      globeInteract.strength += (bumpTarget - globeInteract.strength) * Math.min(1, dt * 6);

      /* land dots */
      const dotBase = 1.05 * DOT_SIZE;
      const twinklePhase = time * 2.2;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const q = transform(p, cosR, sinR, cosT, sinT);
        if (q.z < -0.03) continue;

        /* bump: push dots outward near cursor */
        let bump = 0;
        if (globeInteract.strength > 0.01 && bumpValid) {
          const viewDot = q.x * bumpSx + q.y * bumpSy + q.z * bumpSz;
          const proximity = Math.max(0, viewDot - 0.88) / 0.12;
          bump = proximity * proximity * globeInteract.strength * 0.08;
        }
        const dotScale = 1 + bump;
        const px = cx + q.x * R * dotScale;
        const py = cy - q.y * R * dotScale;
        const depth = (q.z + 1) * 0.5;
        const wTheta = Math.atan2(
          p.z * cosR + p.x * sinR,
          p.x * cosR - p.z * sinR
        );
        let tHue = (wTheta + Math.PI) / TAU;
        tHue = (tHue + 0.5) % 1;
        const latMix = (p.y + 1) * 0.5;
        const tColor = clamp(tHue * 0.75 + latMix * 0.25, 0, 1);
        const [r, g2, b] = palLookup(tColor);
        const tw =
          0.85 + 0.15 * Math.sin(twinklePhase + p.land * 9.3 + i * 0.17);
        const edge = Math.max(0, q.z);
        /* PORT: land keeps the original curve; ocean is pulled right down so
           it reads as scaffolding behind the continents rather than as land */
        const isLandDot = p.land > LAND_CUTOFF;
        const base = isLandDot ? 0.2 : 0.05;
        const landMul = isLandDot ? 0.6 + 0.4 * p.land : 0.2;
        const alpha = Math.min(1, (base + 0.75 * edge * landMul) * tw * (1 + bump * 0.8));
        const size =
          dotBase * (0.55 + 0.85 * depth) * (isLandDot ? 1 : 0.7) * (1 + bump * 1.5);
        ctx!.fillStyle = `rgba(${r},${g2},${b},${alpha.toFixed(3)})`;
        ctx!.fillRect(px - size / 2, py - size / 2, size, size);
      }

      /* arcs */
      ensureArcs(9);
      ctx!.lineCap = "round";
      ctx!.lineJoin = "round";

      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        arc.t += dt;
        const total = arc.drawDur + arc.holdDur + arc.fadeDur;
        if (arc.t > total + arc.gapDur) {
          const n = makeArc();
          arcs[i] = n || arc;
          if (n) logEvent(n.a.name, n.b.name || regionFor(n.b));
          continue;
        }
        if (arc.t < 0) continue;

        let head: number, tail: number, alphaMul: number;
        if (arc.t < arc.drawDur) {
          /* smooth ease-in-out for drawing phase */
          const p = arc.t / arc.drawDur;
          head = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          tail = 0;
          alphaMul = 1;
        } else if (arc.t < arc.drawDur + arc.holdDur) {
          head = 1;
          tail = 0;
          alphaMul = 1;
        } else {
          const u = (arc.t - arc.drawDur - arc.holdDur) / arc.fadeDur;
          head = 1;
          /* smooth ease-in-out for tail retraction */
          tail = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
          alphaMul = 1 - u * 0.7;
        }

        const STEPS = 96;
        const iHead = Math.min(STEPS, Math.ceil(head * STEPS));
        const iTail = Math.max(0, Math.floor(tail * STEPS));
        if (iHead <= iTail) continue;

        const dotP = clamp(
          arc.a.x * arc.b.x + arc.a.y * arc.b.y + arc.a.z * arc.b.z,
          -1,
          1
        );
        const angle = Math.acos(dotP);
        const liftMax = 0.10 + 0.35 * (angle / Math.PI);
        const [r, g2, bCol] = palLookup(arc.hue);

        /* Build smooth path with quadratic curves */
        const screenPts: { x: number; y: number; z: number }[] = [];
        for (let k = iTail; k <= iHead; k++) {
          const u = k / STEPS;
          const sph = slerp(arc.a, arc.b, u);
          const lift = liftMax * Math.sin(u * Math.PI);
          const scale = 1 + lift;
          const wp = {
            x: sph.x * scale,
            y: sph.y * scale,
            z: sph.z * scale,
          };
          const q = transform(wp, cosR, sinR, cosT, sinT);
          screenPts.push({
            x: cx + q.x * R,
            y: cy - q.y * R,
            z: q.z,
          });
        }

        /* Draw smooth curve through visible segments */
        ctx!.beginPath();
        let started = false;
        let anyVisible = false;
        let lastScreen: { x: number; y: number; z: number } | null = null;

        for (let k = 0; k < screenPts.length; k++) {
          const pt = screenPts[k];
          if (pt.z < -0.15) {
            started = false;
            lastScreen = pt;
            continue;
          }
          anyVisible = true;
          if (!started) {
            ctx!.moveTo(pt.x, pt.y);
            started = true;
          } else if (k + 1 < screenPts.length && screenPts[k + 1].z >= -0.15) {
            /* quadratic curve using current point as control, next as anchor */
            const next = screenPts[k + 1];
            const midX = (pt.x + next.x) * 0.5;
            const midY = (pt.y + next.y) * 0.5;
            ctx!.quadraticCurveTo(pt.x, pt.y, midX, midY);
          } else {
            ctx!.lineTo(pt.x, pt.y);
          }
          lastScreen = pt;
        }

        if (anyVisible) {
          /* depth-aware alpha: fade arcs on the globe's edge */
          const avgZ = screenPts.reduce((s, p) => s + Math.max(0, p.z), 0) / Math.max(1, screenPts.length);
          const depthFade = clamp(avgZ / 0.3, 0.3, 1);
          const baseA = 0.8 * alphaMul * depthFade;
          ctx!.strokeStyle = `rgba(${r},${g2},${bCol},${baseA.toFixed(3)})`;
          ctx!.lineWidth = 1.5;
          ctx!.stroke();
        }

        /* start marker */
        const pa = transform(arc.a, cosR, sinR, cosT, sinT);
        if (pa.z > -0.05) {
          const ax = cx + pa.x * R,
            ay = cy - pa.y * R;
          const pulse = 0.5 + 0.5 * Math.sin(arc.t * 5);
          const aVis = clamp((pa.z + 0.1) / 1.1, 0, 1);
          ctx!.fillStyle = `rgba(${r},${g2},${bCol},${(0.95 * alphaMul * aVis).toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(ax, ay, 2.4, 0, TAU);
          ctx!.fill();
          ctx!.strokeStyle = `rgba(${r},${g2},${bCol},${(0.35 * pulse * aVis).toFixed(3)})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.arc(ax, ay, 3.5 + 6 * pulse, 0, TAU);
          ctx!.stroke();
        }

        /* end / head marker */
        if (lastScreen && arc.t >= arc.drawDur) {
          const pb = transform(arc.b, cosR, sinR, cosT, sinT);
          if (pb.z > -0.05) {
            const bx = cx + pb.x * R,
              by = cy - pb.y * R;
            const pulse = 0.5 + 0.5 * Math.sin(arc.t * 5 + 2);
            const bVis = clamp((pb.z + 0.1) / 1.1, 0, 1);
            ctx!.fillStyle = `rgba(${r},${g2},${bCol},${(0.95 * alphaMul * bVis).toFixed(3)})`;
            ctx!.beginPath();
            ctx!.arc(bx, by, 2.4, 0, TAU);
            ctx!.fill();
            ctx!.strokeStyle = `rgba(${r},${g2},${bCol},${(0.4 * pulse * bVis).toFixed(3)})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.arc(bx, by, 3.5 + 6 * pulse, 0, TAU);
            ctx!.stroke();
          }
        } else if (lastScreen && arc.t < arc.drawDur) {
          if (lastScreen.z > -0.05) {
            ctx!.fillStyle = `rgba(${r},${g2},${bCol},0.95)`;
            ctx!.beginPath();
            ctx!.arc(lastScreen.x, lastScreen.y, 2.6, 0, TAU);
            ctx!.fill();
            ctx!.strokeStyle = `rgba(${r},${g2},${bCol},0.4)`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.arc(lastScreen.x, lastScreen.y, 6, 0, TAU);
            ctx!.stroke();
          }
        }
      }

      /* city labels */
      for (const c of CITY_POINTS) {
        const q = transform(c, cosR, sinR, cosT, sinT);
        if (q.z < 0.35) continue;
        const px = cx + q.x * R;
        const py = cy - q.y * R;
        const alpha = clamp((q.z - 0.35) / 0.4, 0, 1) * 0.55;
        ctx!.fillStyle = `rgba(200,235,215,${alpha.toFixed(3)})`;
        ctx!.font = "500 10px var(--font-hanken-grotesk), system-ui, sans-serif";
        ctx!.textAlign = "left";
        ctx!.fillText(c.name, px + 6, py + 3);
        ctx!.fillStyle = `rgba(200,235,215,${(alpha * 0.8).toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(px, py, 1.8, 0, TAU);
        ctx!.fill();
      }
    }

    /* ── Animation loop (pauses when off-screen) ── */
    let last = performance.now();
    let rafId: number;
    let isVisible = true;

    function loop(t: number) {
      if (!isVisible || reduced) return;
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      draw(dt);
      rafId = requestAnimationFrame(loop);
    }

    const visObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !reduced) {
          last = performance.now();
          rafId = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0 }
    );
    visObserver.observe(canvas);

    /* ── Pointer / drag handlers ── */
    function onDown(e: PointerEvent | MouseEvent) {
      const pt = e;
      drag.active = true;
      drag.lastX = pt.clientX;
      drag.lastY = pt.clientY;
      drag.lastT = performance.now();
      drag.vx = 0;
      drag.vy = 0;
      canvas!.style.cursor = "grabbing";
      if ("pointerId" in e) {
        try {
          canvas!.setPointerCapture((e as PointerEvent).pointerId);
        } catch (_) {}
      }
      e.preventDefault();
    }

    function onMove(e: PointerEvent | MouseEvent) {
      if (!drag.active) return;
      const pt = e;
      const now = performance.now();
      const dx = pt.clientX - drag.lastX;
      const dy = pt.clientY - drag.lastY;
      const dtMs = Math.max(1, now - drag.lastT) / 1000;
      const Rad = Math.min(W, H) * 0.42;
      const sens = 1.0 / Math.max(100, Rad);
      rot += dx * sens;
      tilt -= dy * sens;
      tilt = clamp(tilt, -Math.PI / 2 + 0.05, Math.PI / 2 - 0.05);
      drag.vx = (dx * sens) / dtMs;
      drag.vy = (-(dy * sens)) / dtMs;
      drag.lastX = pt.clientX;
      drag.lastY = pt.clientY;
      drag.lastT = now;
      e.preventDefault();
    }

    function onUp() {
      if (!drag.active) return;
      drag.active = false;
      canvas!.style.cursor = "grab";
      rotVel = clamp(drag.vx, -8, 8);
      tiltVel = clamp(drag.vy, -8, 8);
    }

    function onEnter() {
      hover.over = true;
    }
    function onLeave() {
      hover.over = false;
      mouseScreen.active = false;
    }

    function onCanvasMove(e: PointerEvent | MouseEvent) {
      mouseScreen.x = e.clientX;
      mouseScreen.y = e.clientY;
      mouseScreen.active = true;
    }


    /* ── Init ── */
    fitCanvas();
    rebuildPoints();
    ensureArcs(9);
    /* PORT: reduced motion gets one static frame — still a globe, still
       draggable, just not spinning or animating arcs on its own */
    if (reduced) draw(0);
    else rafId = requestAnimationFrame(loop);

    /* Event listeners */
    window.addEventListener("resize", fitCanvas);
    if (window.PointerEvent) {
      canvas.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      canvas.addEventListener("pointerenter", onEnter);
      canvas.addEventListener("pointerleave", onLeave);
      canvas.addEventListener("pointermove", onCanvasMove);
    } else {
      canvas.addEventListener("mousedown", onDown as EventListener);
      window.addEventListener("mousemove", onMove as EventListener);
      window.addEventListener("mouseup", onUp);
      canvas.addEventListener("mouseenter", onEnter);
      canvas.addEventListener("mouseleave", onLeave);
      canvas.addEventListener("mousemove", onCanvasMove as EventListener);
    }

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(rafId);
      visObserver.disconnect();
      window.removeEventListener("resize", fitCanvas);
      if (window.PointerEvent) {
        canvas.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        canvas.removeEventListener("pointerenter", onEnter);
        canvas.removeEventListener("pointerleave", onLeave);
        canvas.removeEventListener("pointermove", onCanvasMove);
      } else {
        canvas.removeEventListener("mousedown", onDown as EventListener);
        window.removeEventListener("mousemove", onMove as EventListener);
        window.removeEventListener("mouseup", onUp);
        canvas.removeEventListener("mouseenter", onEnter);
        canvas.removeEventListener("mouseleave", onLeave);
        canvas.removeEventListener("mousemove", onCanvasMove as EventListener);
      }
    };
  }, [reduced]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        aria-label="Interactive globe. Drag to spin it."
        className="block h-full w-full touch-none cursor-grab pointer-events-none active:cursor-grabbing md:pointer-events-auto"
      />
      {/* PORT: the original kept this as an aria-live region for the hovered
          city; it is off-screen, not display:none, so it is actually read */}
      <div ref={logRef} className="sr-only" aria-live="polite" />
    </div>
  );
}

"use client";

/* OFM Jobs "Post a job" wizard. The Job-details screen is modelled on
   Workable's create-a-job flow (Mobbin ref): a tabbed stepper with a
   description under each step, a sectioned form (Job title & department →
   Location → Employment details → Compensation → Description) with required *
   markers, dropdowns, tag fields and a right-hand Tips rail. Rebuilt in the OFM
   (Kibo) system — DashboardShell chrome + shadcn primitives, zinc neutrals,
   emerald brand. The Tests step mirrors the d1 case-study beat. */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from "framer-motion";
import {
  BookOpenText,
  Keyboard,
  Gauge,
  Mic,
  Headphones,
  ChevronRight,
  ChevronLeft,
  Check,
  Lock,
  Briefcase,
  Wallet,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import DashboardShell from "@/components/screens/ofm/DashboardShell";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── the autoplay cursor (case-study beat only) ────────────── */

/* A macOS-style arrow, tip anchored at (2, 2) so the motion x/y is the
   point being clicked. */
function CursorArrow() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 2 L2 18.5 L6.6 14.2 L9.7 21.2 L12.6 19.9 L9.5 13 L15.8 12.9 Z"
        fill="#18181b"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── the progress stepper ──────────────────────────────────── */

const STEPS = [
  { label: "Job details", desc: "Role, pay, languages and location." },
  { label: "Skill tests", desc: "Set the bar candidates must clear." },
  { label: "Review", desc: "A last look before it goes live." },
] as const;
const N = STEPS.length;
/* half a column, in % — the track runs first→last circle centre */
const HALF = 100 / N / 2;
/* the fill reaches the current step's circle centre */
const fillPct = (current: number) => ((current + 0.5) / N) * 100 - HALF;

function StepCircle({
  state,
  n,
}: {
  state: "done" | "active" | "upcoming";
  n: number;
}) {
  if (state === "done") {
    return (
      <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-primary">
        <Check className="size-4 text-primary-foreground" strokeWidth={3} />
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-primary text-ofm-label font-semibold text-primary-foreground ring-4 ring-ofm-100">
        {n}
      </span>
    );
  }
  return (
    <span className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 border-border bg-background text-ofm-label font-semibold text-muted-foreground">
      {n}
    </span>
  );
}

function Stepper({
  current,
  onJump,
  reduced,
}: {
  current: number;
  onJump: (i: number) => void;
  reduced: boolean;
}) {
  return (
    <div className="relative">
      {/* the connecting track, first circle centre → last circle centre */}
      <div
        className="absolute top-4 h-0.5 -translate-y-1/2 rounded-full bg-border"
        style={{ left: `${HALF}%`, right: `${HALF}%` }}
      />
      {/* the green progress, animating to the current step */}
      <motion.div
        className="absolute top-4 h-0.5 -translate-y-1/2 rounded-full bg-primary"
        style={{ left: `${HALF}%` }}
        initial={false}
        animate={{ width: `${fillPct(current)}%` }}
        transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE }}
      />
      {/* the step nodes with labels below */}
      <div className="relative flex">
        {STEPS.map((s, i) => {
          const state =
            i < current ? "done" : i === current ? "active" : "upcoming";
          const clickable = i <= current;
          return (
            <div key={s.label} className="flex flex-1 flex-col items-center">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onJump(i)}
                className={clickable ? "cursor-pointer" : "cursor-default"}
              >
                <StepCircle state={state} n={i + 1} />
              </button>
              <span
                className={`mt-2 text-ofm-label ${
                  state === "active"
                    ? "font-semibold text-primary"
                    : state === "done"
                    ? "font-medium text-foreground"
                    : "font-medium text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── shared bits ───────────────────────────────────────────── */

function StepHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h2 className="text-ofm-hero font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-ofm-body text-muted-foreground">{sub}</p>
    </div>
  );
}

/* ── step 1 · Job details (Workable-style form) ────────────── */

const EMPLOYMENT = ["Full-time", "Part-time", "Contract"] as const;
const RATE_TYPES = ["Hourly", "Monthly", "Commission"] as const;
const PAY_SCHEDULES = ["Weekly", "Biweekly", "Monthly"] as const;
const EXPERIENCE = ["No experience", "Entry-level", "Intermediate", "Experienced"] as const;
const DEPARTMENTS = ["Chat Operations", "Customer Support", "Sales", "Community"] as const;
const CURRENCIES = ["US Dollar (USD)", "Euro (EUR)", "British Pound (GBP)"] as const;
const LANGUAGES = ["English", "Spanish"];
const KEYWORDS = ["chat support", "sales", "fluent"];
const WORKPLACES = [
  { label: "On-site", desc: "Work from a set location" },
  { label: "Hybrid", desc: "Split of office and home" },
  { label: "Remote", desc: "Work from anywhere" },
] as const;

const rateUnit = (rt: string) =>
  rt === "Hourly" ? "/ hr" : rt === "Monthly" ? "/ mo" : "%";

/* section with a header (+ optional right-aligned action) */
function FormSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 py-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-ofm-title font-semibold text-zinc-900">{title}</h3>
        {action}
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

/* Workable field: label (with a red * when required) above the control */
function WField({
  label,
  required,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="flex items-center gap-1 text-zinc-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {hint && <p className="text-ofm-caption text-zinc-400">{hint}</p>}
    </div>
  );
}

/* tag / multi-value field (languages, keywords) */
function TagField({
  tags,
  placeholder,
  icon: Icon,
}: {
  tags: string[];
  placeholder: string;
  icon?: typeof Mic;
}) {
  return (
    <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 shadow-sm">
      {tags.map((t) => (
        <span
          key={t}
          className="flex items-center gap-1 rounded bg-zinc-100 py-0.5 pl-2 pr-1 text-ofm-caption font-medium text-zinc-700"
        >
          {Icon && <Icon className="size-3 text-zinc-400" strokeWidth={2} />}
          {t}
          <button type="button" className="text-zinc-400 transition-colors hover:text-zinc-600">
            <X className="size-3" strokeWidth={2.5} />
          </button>
        </span>
      ))}
      <span className="px-1 text-ofm-caption text-zinc-400">{placeholder}</span>
    </div>
  );
}

function DetailsStep({
  employment,
  setEmployment,
  rateType,
  setRateType,
  paySchedule,
  setPaySchedule,
}: {
  employment: string;
  setEmployment: (v: string) => void;
  rateType: string;
  setRateType: (v: string) => void;
  paySchedule: string;
  setPaySchedule: (v: string) => void;
}) {
  const [workplace, setWorkplace] = useState("Remote");

  return (
    <div className="mx-auto max-w-[720px]">
      <StepHead title="Job details" sub="The basics a candidate sees first on the listing." />
      <Card className="mt-5 divide-y divide-zinc-100 border-zinc-200/70 p-0 shadow-none">
        <FormSection title="Job title and department">
          <WField
            label="Job title"
            required
            htmlFor="jp-title"
            hint="65 characters left. No special characters."
          >
            <Input id="jp-title" defaultValue="Virtual Chatter" />
          </WField>
          <WField label="Department" htmlFor="jp-dept">
            <Select id="jp-dept" defaultValue="Chat Operations">
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </WField>
        </FormSection>

        <FormSection title="Location">
          <WField label="Workplace" required>
            <div className="grid grid-cols-3 gap-4">
              {WORKPLACES.map((w) => {
                const on = w.label === workplace;
                return (
                  <button
                    key={w.label}
                    type="button"
                    onClick={() => setWorkplace(w.label)}
                    className={`flex items-start gap-2.5 rounded-lg border p-3 text-left transition-colors ${
                      on ? "border-ofm-300 bg-ofm-50/40" : "border-zinc-200/70 hover:bg-zinc-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        on ? "border-primary" : "border-zinc-300"
                      }`}
                    >
                      {on && <span className="size-2 rounded-full bg-primary" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-ofm-label font-medium text-zinc-800">{w.label}</span>
                      <span className="block text-ofm-caption leading-tight text-zinc-400">{w.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </WField>
        </FormSection>

        <FormSection title="Employment details">
          <div className="grid grid-cols-2 gap-4">
            <WField label="Employment type" htmlFor="jp-emp">
              <Select id="jp-emp" value={employment} onChange={(e) => setEmployment(e.target.value)}>
                {EMPLOYMENT.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </Select>
            </WField>
            <WField label="Experience" htmlFor="jp-exp">
              <Select id="jp-exp" defaultValue="Entry-level">
                {EXPERIENCE.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </Select>
            </WField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <WField label="Languages" required>
              <TagField tags={LANGUAGES} placeholder="Add a language" />
            </WField>
            <WField label="Keywords">
              <TagField tags={KEYWORDS} placeholder="Add keywords" />
            </WField>
          </div>
        </FormSection>

        <FormSection title="Compensation">
          <div className="grid grid-cols-2 gap-4">
            <WField label="Pay type" htmlFor="jp-rate">
              <Select id="jp-rate" value={rateType} onChange={(e) => setRateType(e.target.value)}>
                {RATE_TYPES.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </Select>
            </WField>
            <WField label="Payment schedule" htmlFor="jp-sched">
              <Select
                id="jp-sched"
                value={paySchedule}
                onChange={(e) => setPaySchedule(e.target.value)}
              >
                {PAY_SCHEDULES.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </Select>
            </WField>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <WField label="From">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ofm-body text-zinc-400">$</span>
                <Input className="pl-7 tabular-nums" defaultValue="4" aria-label="Minimum pay" />
              </div>
            </WField>
            <WField label="To">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ofm-body text-zinc-400">$</span>
                <Input className="pl-7 tabular-nums" defaultValue="6" aria-label="Maximum pay" />
              </div>
            </WField>
            <WField label="Currency" htmlFor="jp-cur">
              <Select id="jp-cur" defaultValue="US Dollar (USD)">
                {CURRENCIES.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </Select>
            </WField>
          </div>
          <p className="text-ofm-caption text-zinc-400">
            Shown on the listing as $4–$6 {rateUnit(rateType)}, paid {paySchedule.toLowerCase()}.
          </p>
        </FormSection>

        <FormSection
          title="Description"
          action={
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-ofm-200/70 bg-white px-2.5 py-1.5 text-ofm-caption font-semibold text-ofm-700 shadow-sm transition-colors hover:bg-ofm-50/60"
            >
              <Sparkles className="size-3.5" strokeWidth={2} />
              Generate with AI
            </button>
          }
        >
          <WField label="About the role" required>
            <Textarea
              rows={6}
              className="resize-none"
              defaultValue={
                "Handle live customer chats for adult creators: fast, friendly and on-brand. You'll run several conversations at once, keep replies quick, and stay on top of what each fan wants."
              }
            />
            <p className="mt-1.5 flex items-center gap-1.5 text-ofm-caption text-zinc-400">
              <Check className="size-3.5 text-primary" strokeWidth={2.5} />
              Minimum 150 characters · 182 used
            </p>
          </WField>
        </FormSection>
      </Card>
    </div>
  );
}

/* ── step 2 · Tests (test = requirement; bar set inline) ───── */

type Test = {
  id: string;
  icon: typeof Mic;
  title: string;
  desc: string;
  mins: number;
  /** the pass mark — the bar an applicant must clear */
  bar: number;
  unit: string;
  /** OFM recommends this test for the role (the tailored default set) */
  recommended: boolean;
};
const TESTS: Test[] = [
  { id: "eng", icon: BookOpenText, title: "Intermediate English B1", desc: "Reading & grammar from real chat snippets.", mins: 8, bar: 80, unit: "/ 100", recommended: true },
  { id: "typ", icon: Keyboard, title: "Typing Test", desc: "Speed and accuracy on a timed passage.", mins: 6, bar: 60, unit: "WPM", recommended: true },
  { id: "spd", icon: Gauge, title: "Internet Speed Test", desc: "Live download, upload and ping.", mins: 2, bar: 25, unit: "Mbps", recommended: true },
  { id: "vrb", icon: Mic, title: "Verbal Test", desc: "A spoken answer to a scenario, AI-scored.", mins: 4, bar: 75, unit: "/ 100", recommended: false },
  { id: "lst", icon: Headphones, title: "Listening Test", desc: "Audio comprehension: catch what's said.", mins: 4, bar: 70, unit: "/ 100", recommended: false },
];

function PassMark({ t }: { t: Test }) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <span className="text-ofm-caption text-muted-foreground">Pass mark</span>
      <div className="flex h-8 w-14 items-center justify-center gap-1 rounded-md border border-input bg-background shadow-sm transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
        <span className="text-ofm-caption font-medium text-muted-foreground">≥</span>
        <Input
          defaultValue={t.bar}
          aria-label={`${t.title} pass mark`}
          className="h-6 w-6 border-0 px-0 text-center text-ofm-caption font-semibold tabular-nums shadow-none focus-visible:ring-0"
        />
      </div>
      <span className="w-11 text-ofm-caption font-medium text-muted-foreground">{t.unit}</span>
    </div>
  );
}

function TestRow({
  t,
  on,
  first,
  onToggle,
  onSwitchRef,
}: {
  t: Test;
  on: boolean;
  first: boolean;
  onToggle: (v: boolean) => void;
  /** Autoplay: register the switch element so the cursor can target it. */
  onSwitchRef?: (el: HTMLElement | null) => void;
}) {
  return (
    <div className={`flex items-center gap-3.5 px-5 py-3.5 transition-colors ${on ? "bg-ofm-50/50" : ""} ${first ? "" : "border-t border-zinc-100"}`}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ofm-50">
        <t.icon className="size-5 text-primary" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-ofm-body font-semibold text-foreground">{t.title}</h4>
          {t.recommended && (
            <span className="flex items-center gap-1 text-ofm-caption font-medium text-primary">
              <Check className="size-3.5" strokeWidth={2.5} />
              Recommended
            </span>
          )}
        </div>
        <p className="mt-0.5 text-ofm-caption text-muted-foreground">
          {t.desc} · ±{t.mins} min
        </p>
      </div>
      {/* fixed-width slot so toggling never reflows the row — the field just
          fades in/out, and the Enabled/Disabled labels stay in a column */}
      <div className="flex w-[176px] shrink-0 justify-end">
        <AnimatePresence initial={false}>
          {on && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <PassMark t={t} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <span className={`w-14 text-right text-ofm-label font-medium ${on ? "text-primary" : "text-muted-foreground"}`}>
          {on ? "Enabled" : "Disabled"}
        </span>
        <span ref={onSwitchRef} className="inline-flex">
          <Switch checked={on} onCheckedChange={onToggle} />
        </span>
      </div>
    </div>
  );
}

function TestsStep({
  enabled,
  onToggle,
  onSwitchRef,
}: {
  enabled: Set<string>;
  onToggle: (id: string, v: boolean) => void;
  /** Autoplay: register each row's switch element by test id. */
  onSwitchRef?: (id: string, el: HTMLElement | null) => void;
}) {
  const count = TESTS.filter((t) => enabled.has(t.id)).length;
  const mins = TESTS.filter((t) => enabled.has(t.id)).reduce((a, t) => a + t.mins, 0);
  return (
    <div className="mx-auto max-w-[720px]">
      <StepHead
        title="Require what a chat role needs"
        sub="OFM recommends three tests for this role: reading, typing and connection. Keep what fits; each becomes a requirement candidates must clear."
      />
      <Card className="mt-5 overflow-hidden border-zinc-200/70 p-0 shadow-none">
        {TESTS.map((t, i) => (
          <TestRow
            key={t.id}
            t={t}
            on={enabled.has(t.id)}
            first={i === 0}
            onToggle={(v) => onToggle(t.id, v)}
            onSwitchRef={onSwitchRef ? (el) => onSwitchRef(t.id, el) : undefined}
          />
        ))}
        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-5 py-3">
          <span className="text-ofm-caption text-muted-foreground">
            {count === 0 ? (
              "No tests required yet"
            ) : (
              <>
                Candidates must clear{" "}
                <span className="font-semibold text-foreground">
                  {count} {count === 1 ? "test" : "tests"}
                </span>{" "}
                to apply
              </>
            )}
          </span>
          <span className="text-ofm-caption font-medium text-primary">
            ~{mins} min total
          </span>
        </div>
      </Card>
    </div>
  );
}

/* ── step 3 · Review ───────────────────────────────────────── */

function ReviewRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mic;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5 px-5 py-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ofm-50">
        <Icon className="size-5 text-primary" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <h4 className="text-ofm-label font-semibold uppercase tracking-[0.04em] text-muted-foreground">
          {label}
        </h4>
        <div className="mt-1.5">{children}</div>
      </div>
    </div>
  );
}

function ReviewStep({
  employment,
  rateType,
  paySchedule,
  enabled,
}: {
  employment: string;
  rateType: string;
  paySchedule: string;
  enabled: Set<string>;
}) {
  const enabledTests = TESTS.filter((t) => enabled.has(t.id));
  const mins = enabledTests.reduce((a, t) => a + t.mins, 0);
  return (
    <div className="mx-auto max-w-[720px]">
      <StepHead title="Review & publish" sub="One last look before Virtual Chatter goes live." />
      <Card className="mt-5 divide-y divide-zinc-100 border-zinc-200/70 p-0 shadow-none">
        <ReviewRow icon={Briefcase} label="Details">
          <p className="text-ofm-body font-semibold text-foreground">Virtual Chatter</p>
          <p className="mt-0.5 text-ofm-caption text-muted-foreground">
            {employment} · Remote · Worldwide
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {LANGUAGES.map((l) => (
              <span
                key={l}
                className="rounded-md border border-zinc-200/70 bg-white px-2 py-0.5 text-ofm-caption font-medium text-zinc-700"
              >
                {l}
              </span>
            ))}
          </div>
        </ReviewRow>

        <ReviewRow icon={Wallet} label="Compensation">
          <p className="text-ofm-body font-semibold text-foreground">
            $4 – $6 <span className="font-normal text-muted-foreground">{rateUnit(rateType)}</span>
          </p>
          <p className="mt-0.5 text-ofm-caption text-muted-foreground">
            {rateType} · paid {paySchedule.toLowerCase()}
          </p>
        </ReviewRow>

        <ReviewRow icon={Lock} label={`Required to apply · ${enabledTests.length} tests`}>
          <div className="flex flex-wrap gap-1.5">
            {enabledTests.length === 0 ? (
              <span className="text-ofm-caption text-muted-foreground">No tests enabled yet.</span>
            ) : (
              enabledTests.map((t) => (
                <span
                  key={t.id}
                  className="flex items-center gap-1.5 rounded-md bg-ofm-50 px-2 py-0.5 text-ofm-caption font-medium text-primary"
                >
                  <t.icon className="size-3.5" strokeWidth={2} />
                  {t.title}
                  <span className="font-semibold tabular-nums">
                    ≥ {t.bar} {t.unit}
                  </span>
                </span>
              ))
            )}
          </div>
          <p className="mt-2 text-ofm-caption text-muted-foreground">
            ≈ {mins} min for a candidate to clear the battery.
          </p>
        </ReviewRow>
      </Card>
      <p className="mt-3 flex items-center gap-1.5 text-ofm-caption text-muted-foreground">
        <Lock className="size-3.5" strokeWidth={2} />
        Publishing makes the listing live and gated. No proof, no application.
      </p>
    </div>
  );
}

/* ── the wizard ────────────────────────────────────────────── */

export default function JobPostWizard({
  initialStep = 0,
  autoplay = false,
}: {
  initialStep?: number;
  /** Case-study beat: a fake cursor clicks Continue through to the Tests step. */
  autoplay?: boolean;
}) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(Math.min(Math.max(initialStep, 0), N - 1));
  const [dir, setDir] = useState(1);
  const [employment, setEmployment] = useState<string>("Full-time");
  const [rateType, setRateType] = useState<string>("Hourly");
  const [paySchedule, setPaySchedule] = useState<string>("Weekly");
  /* Under autoplay the cursor flips the recommended three on, so they must
     start off. Every other use (reduced motion, the dev route) seeds them. */
  const [enabled, setEnabled] = useState<Set<string>>(() =>
    autoplay && !reduced ? new Set() : new Set(["eng", "typ", "spd"])
  );

  /* autoplay plumbing */
  const rootRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const switchRefs = useRef<Record<string, HTMLElement | null>>({});
  const cursor = useAnimationControls();
  const [ripple, setRipple] = useState(0);

  const go = (next: number) => {
    if (next < 0 || next > N - 1 || next === step) return;
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const toggleTest = (id: string, v: boolean) =>
    setEnabled((s) => {
      const n = new Set(s);
      if (v) n.add(id);
      else n.delete(id);
      return n;
    });

  /* Drive the cursor: fade in near the middle, walk to Continue, click,
     landing on the Tests step, then bow out. */
  const TESTS_STEP = STEPS.findIndex((s) => s.label === "Skill tests");
  useEffect(() => {
    if (!autoplay) return;
    if (reduced) {
      setDir(1);
      setStep(TESTS_STEP);
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const sleep = (ms: number) =>
      new Promise<void>((res) => timers.push(setTimeout(res, ms)));

    /* Centre of any element, in the unscaled 1440×900 canvas space. */
    const centerOf = (el: HTMLElement | null) => {
      const root = rootRef.current;
      if (!root || !el) return { x: 1150, y: 864 };
      const r = root.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const scale = r.width / 1440 || 1;
      return {
        x: (b.left + b.width / 2 - r.left) / scale,
        y: (b.top + b.height / 2 - r.top) / scale,
      };
    };
    const target = () => centerOf(continueRef.current);

    const clickAt = async (x: number, y: number, moveMs = 0.7) => {
      await cursor.start({ x: x - 4, y: y - 3, transition: { duration: moveMs, ease: EASE } });
      if (cancelled) return;
      await cursor.start({ scale: 0.82, transition: { duration: 0.1 } });
      if (cancelled) return;
      setRipple((n) => n + 1);
      await cursor.start({ scale: 1, transition: { duration: 0.16, ease: EASE } });
    };

    const RECOMMENDED = ["eng", "typ", "spd"];

    /* The cursor walks the recommended toggles on, one at a time. */
    const walkToggles = async () => {
      for (const id of RECOMMENDED) {
        const el = switchRefs.current[id];
        if (!el) continue;
        const c = centerOf(el);
        await clickAt(c.x, c.y, 0.55);
        if (cancelled) return;
        toggleTest(id, true);
        await sleep(480);
        if (cancelled) return;
      }
    };

    const run = async () => {
      const t = target();
      /* start a little up-left of the button, invisible, then fade in */
      await cursor.start({ x: t.x - 190, y: t.y - 150, opacity: 0, scale: 1, transition: { duration: 0 } });
      await sleep(620);
      if (cancelled) return;
      await cursor.start({ opacity: 1, transition: { duration: 0.3 } });

      /* Details → Tests (once) */
      await clickAt(t.x, t.y);
      if (cancelled) return;
      setDir(1);
      setStep(TESTS_STEP);
      /* let the step transition settle so the switch positions are stable */
      await sleep(850);
      if (cancelled) return;

      /* Subtle replay: assemble the recommended set, rest on it, then quietly
         clear it (cursor hidden) and do it again, so a mid-dwell arrival still
         catches the sequence. */
      while (!cancelled) {
        await walkToggles();
        if (cancelled) return;
        await sleep(3400); // rest on the completed battery
        if (cancelled) return;
        await cursor.start({ opacity: 0, transition: { duration: 0.4, ease: EASE } });
        if (cancelled) return;
        setEnabled(new Set()); // clear while the cursor is out of view
        const first = centerOf(switchRefs.current["eng"]);
        await cursor.start({ x: first.x - 44, y: first.y - 30, transition: { duration: 0 } });
        await sleep(650);
        if (cancelled) return;
        await cursor.start({ opacity: 1, transition: { duration: 0.3 } });
      }
    };

    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, reduced]);

  const body = useMemo(() => {
    switch (step) {
      case 0:
        return (
          <DetailsStep
            employment={employment}
            setEmployment={setEmployment}
            rateType={rateType}
            setRateType={setRateType}
            paySchedule={paySchedule}
            setPaySchedule={setPaySchedule}
          />
        );
      case 1:
        return (
          <TestsStep
            enabled={enabled}
            onToggle={toggleTest}
            onSwitchRef={(id, el) => {
              switchRefs.current[id] = el;
            }}
          />
        );
      default:
        return (
          <ReviewStep
            employment={employment}
            rateType={rateType}
            paySchedule={paySchedule}
            enabled={enabled}
          />
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, employment, rateType, paySchedule, enabled]);

  const isLast = step === N - 1;
  const slide = reduced ? 0 : 24;

  return (
    <div ref={rootRef} className="absolute inset-0">
      <DashboardShell
        activeNav="Jobs"
        headerLeft={
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 text-ofm-body text-muted-foreground">Jobs</span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" strokeWidth={2} />
            <span className="truncate text-ofm-display font-semibold text-foreground">Post a job</span>
            <Badge variant="secondary" className="ml-1.5 translate-y-px rounded-md px-2 py-0.5 text-ofm-micro font-medium leading-none">
              Draft
            </Badge>
          </div>
        }
      >
        <div className="flex h-full flex-col bg-background">
          {/* progress stepper */}
          <div className="shrink-0 border-b px-8 py-4">
            <div className="mx-auto max-w-[560px]">
              <Stepper current={step} onJump={go} reduced={!!reduced} />
            </div>
          </div>

          {/* step body */}
          <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
            <div className="mx-auto w-full max-w-[720px]">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={step}
                  custom={dir}
                  initial={reduced ? false : { opacity: 0, x: dir * slide }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, x: dir * -slide }}
                  transition={{ duration: 0.32, ease: EASE }}
                >
                  {body}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* wizard nav */}
          <div className="shrink-0 border-t px-8 py-4">
            <div className="mx-auto flex w-full max-w-[720px] items-center justify-between">
              <Button
                variant="outline"
                className="gap-1.5 border-zinc-200/70 text-zinc-600 shadow-none transition-colors hover:bg-zinc-50 hover:text-zinc-700"
                disabled={step === 0}
                onClick={() => go(step - 1)}
              >
                <ChevronLeft className="size-4" strokeWidth={2} />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                >
                  Save as draft
                </Button>
                <Button
                  ref={continueRef}
                  className="gap-1.5 shadow-none transition-colors hover:bg-ofm-700"
                  onClick={() => !isLast && go(step + 1)}
                >
                  {isLast ? "Publish job" : "Save & continue"}
                  {isLast ? (
                    <Check className="size-4" strokeWidth={2.5} />
                  ) : (
                    <ChevronRight className="size-4" strokeWidth={2} />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>

      {/* autoplay cursor overlay */}
      {autoplay && !reduced && (
        <motion.div
          animate={cursor}
          initial={{ opacity: 0, x: 0, y: 0 }}
          className="pointer-events-none absolute left-0 top-0 z-50"
          style={{ willChange: "transform" }}
        >
          {/* click ripple, anchored at the arrow tip */}
          <AnimatePresence>
            {ripple > 0 && (
              <motion.span
                key={ripple}
                className="absolute -left-2 -top-2 size-4 rounded-full bg-primary/30"
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2.6, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            )}
          </AnimatePresence>
          <CursorArrow />
        </motion.div>
      )}
    </div>
  );
}

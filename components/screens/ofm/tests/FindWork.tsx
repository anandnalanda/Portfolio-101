"use client";

/* d2 — "Proof to apply, not proof to shortlist." Maria's Find work board.
   Structured in the OFM Kanban & AI screen language (JobsListScreen /
   JobPostWizard): full-bleed strips, no centered column — a compact filter
   strip (segmented categories · search · sort · filters), a proof strip
   carrying the beat's argument, then the job grid on the full-width canvas.
   px-5 gutter / py-2.5 strips / py-4 canvas. The gate is each card's badge:
   verified proof reads "1-click apply", the rest "N tests to unlock". Kibo
   primitives (Card, Button, Input, ScrollArea). */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Check,
  Lock,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Bookmark,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import CandidateShell from "./CandidateShell";

const EASE = [0.22, 1, 0.36, 1] as const;

/* What Maria has already proven — the two badges that travel. */
const HELD = new Set(["English", "Typing"]);

type Job = {
  company: string;
  title: string;
  posted: string;
  pay: string;
  applied: number;
  reqs: string[];
};

// (applicant avatar stacks removed — the count alone reads cleaner, per design)

const JOBS: Job[] = [
  { company: "Nimbus Support", title: "Virtual Assistant", posted: "2 days ago", pay: "$5 / hour", applied: 24, reqs: ["English", "Typing"] },
  { company: "Zendly", title: "Email Support Specialist", posted: "5 days ago", pay: "$5 – $7 / hour", applied: 18, reqs: ["English"] },
  { company: "BloomCommerce", title: "Data Entry Specialist", posted: "1 day ago", pay: "$4.5 / hour", applied: 31, reqs: ["English", "Typing"] },
  { company: "Mercado", title: "Bilingual Chat Agent", posted: "6 days ago", pay: "$5 / hour", applied: 12, reqs: ["English", "Typing"] },
  { company: "Acme Studio", title: "Virtual Chatter", posted: "3 days ago", pay: "$4 – $6 / hour", applied: 41, reqs: ["English", "Typing", "Verbal", "Internet speed"] },
  { company: "CallHub", title: "Inbound Call Agent", posted: "1 week ago", pay: "$6 / hour", applied: 27, reqs: ["English", "Verbal", "Listening"] },
  { company: "TicketFlow", title: "Helpdesk Agent", posted: "4 days ago", pay: "$5.5 / hour", applied: 16, reqs: ["English", "Typing"] },
  { company: "Fandom House", title: "Community Manager", posted: "2 weeks ago", pay: "$4 / hour", applied: 22, reqs: ["English", "Listening"] },
  { company: "UpsellIQ", title: "Sales Development Rep", posted: "3 days ago", pay: "$6 – $8 / hour", applied: 35, reqs: ["English", "Typing", "Verbal"] },
  { company: "Shopline", title: "Live Chat Agent", posted: "5 days ago", pay: "$5 / hour", applied: 19, reqs: ["English", "Typing"] },
  { company: "PetPal", title: "Customer Support Rep", posted: "1 day ago", pay: "$4.5 – $6 / hour", applied: 28, reqs: ["English", "Typing"] },
  { company: "Lingua Labs", title: "Transcription Reviewer", posted: "1 week ago", pay: "$5 / hour", applied: 14, reqs: ["English", "Typing", "Listening"] },
  { company: "Wanderly", title: "Content Moderator", posted: "4 days ago", pay: "$5 / hour", applied: 21, reqs: ["English"] },
  { company: "FitCrew", title: "Social Media Assistant", posted: "2 days ago", pay: "$4.5 / hour", applied: 17, reqs: ["English", "Typing"] },
  { company: "Streamly", title: "Appointment Setter", posted: "6 days ago", pay: "$5.5 – $7 / hour", applied: 25, reqs: ["English", "Typing", "Verbal"] },
];

const missingOf = (j: Job) => j.reqs.filter((r) => !HELD.has(r));

/* Two groups — the beat's argument, made legible: the jobs Maria's proof
   clears, and the ones still gated behind a test. */
const READY = JOBS.filter((j) => missingOf(j).length === 0);
const GATED = JOBS.filter((j) => missingOf(j).length > 0);

/* Card anatomy (Mercor "Explore opportunities"): title with a subtle gate pill
   top-right, pay as a plain gray line, a muted posted line, then a footer with
   the applicant count and a save affordance. OFM's inflection: the pill is the
   gate (1-click apply vs N tests); gated cards take a faint wash so the gate is
   felt, not just labelled. */
function JobCard({ job }: { job: Job }) {
  const missing = missingOf(job);
  const ready = missing.length === 0;
  return (
    <Card
      className={`flex h-full flex-col p-5 shadow-none transition-all hover:border-zinc-300 hover:shadow-sm ${
        ready
          ? "border-zinc-200/70"
          : "border-zinc-200/70 bg-zinc-100/60" /* gated: a soft gray wash so it reads as not-yet-available */
      }`}
    >
      {/* title + gate pill */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 flex-1 text-ofm-body font-semibold leading-snug text-zinc-900">
          {job.title}
        </h3>
        {ready ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-ofm-50/60 px-2 py-0.5 text-ofm-micro font-medium text-ofm-700">
            <Check className="size-3" strokeWidth={3} />
            1-click apply
          </span>
        ) : (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50/60 px-2 py-0.5 text-ofm-micro font-medium text-amber-700">
            <Lock className="size-3" strokeWidth={2.5} />
            {missing.length} test{missing.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* pay — plain, Mercor-style */}
      <p className="mt-2 text-ofm-label text-zinc-600">{job.pay}</p>

      {/* posted */}
      <p className="mt-1 text-ofm-caption text-zinc-500">
        {job.company} · Posted {job.posted}
      </p>

      {/* footer: applicant count + save */}
      <div className="mt-5 flex items-center justify-between">
        <span className="text-ofm-caption text-zinc-500">{job.applied} applied</span>
        <Button
          variant="ghost"
          size="icon"
          className="-my-1 -mr-1 h-6 w-6 text-zinc-300 hover:bg-transparent hover:text-zinc-500"
          aria-label="Save job"
        >
          <Bookmark className="size-4" strokeWidth={2} />
        </Button>
      </div>
    </Card>
  );
}

/* A group heading + count — makes the two states of the gate legible. */
function SectionHeader({
  title,
  count,
  tone,
}: {
  title: string;
  count: number;
  tone: "ready" | "gated";
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <h2 className="text-ofm-title font-semibold text-zinc-900">{title}</h2>
      <span
        className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-ofm-caption font-semibold tabular-nums ${
          tone === "ready" ? "bg-ofm-50 text-ofm-700" : "bg-zinc-100 text-zinc-500"
        }`}
      >
        {count}
      </span>
    </div>
  );
}

export default function FindWork() {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? JOBS.length : 0);

  useEffect(() => {
    if (reduced) return;
    setShown(0);
    const t = JOBS.map((_, i) =>
      setTimeout(() => setShown((n) => Math.max(n, i + 1)), 250 + i * 80)
    );
    return () => t.forEach(clearTimeout);
  }, [reduced]);

  /* One group's grid; `offset` keeps the entrance stagger flowing across both. */
  const grid = (jobs: Job[], offset: number) => (
    <div className="grid grid-cols-3 gap-4">
      {jobs.map((job, i) => {
        const idx = offset + i;
        return (
          <motion.div
            key={job.company}
            initial={false}
            animate={{ opacity: shown > idx ? 1 : 0, y: shown > idx ? 0 : 12 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <JobCard job={job} />
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <CandidateShell activeTab="Find work">
      <div className="flex h-full flex-col">
        {/* filter strip — search · sort · filters */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200/70 px-5 py-2.5">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
              strokeWidth={2}
            />
            <Input
              placeholder="Search by roles or skills"
              className="h-8 w-[300px] pl-8 text-ofm-label"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-ofm-label font-medium text-zinc-600"
            >
              Best match
              <ChevronDown className="size-3.5 text-zinc-400" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-ofm-label font-medium text-zinc-600"
            >
              <SlidersHorizontal className="size-3.5" />
              Filters
            </Button>
          </div>
        </div>

        {/* canvas — two labelled groups; scrollbar only shows mid-scroll */}
        <ScrollArea type="scroll" className="min-h-0 flex-1">
          <div className="px-5 py-4">
            {/* jobs the candidate's proof already clears */}
            <SectionHeader title="Ready to apply" count={READY.length} tone="ready" />
            {grid(READY, 0)}

            {/* jobs still gated behind a test — separated by the larger header */}
            <div className="mt-8">
              <SectionHeader
                title="A few tests away"
                count={GATED.length}
                tone="gated"
              />
              {grid(GATED, READY.length)}
            </div>
          </div>
        </ScrollArea>
      </div>
    </CandidateShell>
  );
}

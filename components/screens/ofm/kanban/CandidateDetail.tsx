"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

/* ------------------------------------------------------------------ */
/*  Screen 3 - "Open a candidate, see the why."                        */
/*  The card expands into the match reasons: the AI score, made        */
/*  auditable. Bespoke mock in the OFM (Kibo) design system.           */
/* ------------------------------------------------------------------ */

const candidate = {
  name: "Sarah Chen",
  initials: "SC",
  role: "Senior Frontend Engineer",
  years: "6 yrs experience",
  location: "San Francisco · via LinkedIn",
  stage: "Applied",
  score: 92,
};

const signals: { label: string; note: string; value: number }[] = [
  { label: "Skills match", note: "React · TypeScript · Next.js", value: 96 },
  { label: "Experience", note: "6 yrs, senior level", value: 90 },
  { label: "Seniority fit", note: "Matches the role band", value: 88 },
  { label: "Location & availability", note: "Same timezone, remote-ok", value: 80 },
];

const skills = ["React", "TypeScript", "Next.js", "GraphQL", "Node.js", "Design systems"];

/* Circular gauge for the headline match score. */
function ScoreRing({ value }: { value: number }) {
  const r = 15.5;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative flex size-[76px] items-center justify-center">
      <svg viewBox="0 0 36 36" className="size-full -rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke="hsl(var(--success))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-ofm-display font-bold text-foreground">{value}</span>
      </div>
    </div>
  );
}

export default function CandidateDetail() {
  return (
    <div className="kibo absolute inset-0 flex items-center justify-center bg-ofm-50/70 p-8">
      <div className="w-full max-w-[760px] overflow-hidden rounded-2xl border bg-card shadow-xl">
        {/* Header - identity + headline score */}
        <div className="flex items-start justify-between gap-6 p-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="bg-primary/10 text-ofm-title font-semibold text-primary">
                {candidate.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-ofm-display font-semibold text-foreground">
                  {candidate.name}
                </h3>
                <Badge variant="secondary" className="font-medium">
                  {candidate.stage}
                </Badge>
              </div>
              <p className="mt-0.5 text-ofm-body text-muted-foreground">
                {candidate.role} · {candidate.years}
              </p>
              <p className="text-ofm-body text-muted-foreground">{candidate.location}</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ScoreRing value={candidate.score} />
            <span className="text-ofm-micro font-medium uppercase tracking-wide text-muted-foreground">
              AI match
            </span>
          </div>
        </div>

        <Separator />

        {/* Why this score - the auditable breakdown */}
        <div className="space-y-3.5 p-6">
          <div className="flex items-center justify-between">
            <h4 className="text-ofm-body font-semibold text-foreground">Why this score</h4>
            <span className="text-ofm-caption text-muted-foreground">
              {signals.length} signals
            </span>
          </div>
          {signals.map((s) => (
            <div key={s.label}>
              <div className="mb-1 flex items-center justify-between text-ofm-body">
                <span className="font-medium text-foreground">{s.label}</span>
                <span className="text-muted-foreground">{s.note}</span>
              </div>
              <Progress value={s.value} className="h-1.5" />
            </div>
          ))}
        </div>

        <Separator />

        {/* Skills + actions */}
        <div className="p-6">
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <Badge
                key={s}
                variant="secondary"
                className="rounded-full font-normal text-muted-foreground"
              >
                {s}
              </Badge>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2.5">
            <Button className="flex-1">Message</Button>
            <Button variant="outline" className="flex-1">
              Advance to Screening
            </Button>
            <Button variant="ghost" className="text-muted-foreground">
              Pass
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

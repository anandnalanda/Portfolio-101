"use client";

import { useState } from "react";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/kanban";

/* ------------------------------------------------------------------ */
/*  Data - a hiring pipeline for one open role                         */
/* ------------------------------------------------------------------ */

type Stage = { id: string; name: string };

type Candidate = {
  id: string;
  name: string;
  column: string;
  role: string;
  source: string;
  score: number; // AI match score, 0–100
};

const stages: Stage[] = [
  { id: "applied", name: "Applied" },
  { id: "screening", name: "Screening" },
  { id: "interview", name: "Interview" },
  { id: "offer", name: "Offer" },
];

const initialCandidates: Candidate[] = [
  { id: "c1", name: "Sarah Chen", column: "applied", role: "Frontend Engineer", source: "LinkedIn", score: 92 },
  { id: "c2", name: "Marcus Johnson", column: "applied", role: "Frontend Engineer", source: "Referral", score: 85 },
  { id: "c3", name: "Priya Patel", column: "applied", role: "Frontend Engineer", source: "Indeed", score: 78 },
  { id: "c4", name: "James Wilson", column: "applied", role: "Frontend Engineer", source: "Direct", score: 71 },
  { id: "c5", name: "Aisha Rahman", column: "screening", role: "Backend Engineer", source: "Referral", score: 88 },
  { id: "c6", name: "David Kim", column: "screening", role: "Backend Engineer", source: "LinkedIn", score: 83 },
  { id: "c7", name: "Elena Volkov", column: "screening", role: "Backend Engineer", source: "Indeed", score: 76 },
  { id: "c8", name: "Tomoko Sato", column: "interview", role: "Full Stack", source: "Referral", score: 95 },
  { id: "c9", name: "Ryan O'Brien", column: "interview", role: "Full Stack", source: "LinkedIn", score: 91 },
  { id: "c10", name: "Liam Carter", column: "offer", role: "Frontend Engineer", source: "Direct", score: 97 },
];

/* ------------------------------------------------------------------ */
/*  Score chip - the AI match, the loudest element on the card         */
/* ------------------------------------------------------------------ */

function scoreTone(score: number) {
  if (score >= 90) return "bg-ofm-100 text-ofm-700";
  if (score >= 80) return "bg-amber-100 text-amber-700";
  return "bg-zinc-100 text-zinc-500";
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

/* ------------------------------------------------------------------ */
/*  Board                                                              */
/* ------------------------------------------------------------------ */

export default function HiringBoard() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);

  return (
    <KanbanProvider
      columns={stages}
      data={candidates}
      onDataChange={setCandidates}
      className="gap-3 p-3"
    >
      {(stage) => (
        <KanbanBoard id={stage.id} key={stage.id}>
          <KanbanHeader className="flex items-center justify-between px-3 py-2.5">
            <span className="font-semibold text-zinc-700">{stage.name}</span>
            <span className="rounded-full bg-white px-1.5 py-0.5 text-ofm-micro font-medium text-zinc-400">
              {candidates.filter((c) => c.column === stage.id).length}
            </span>
          </KanbanHeader>
          <KanbanCards id={stage.id}>
            {(candidate: Candidate) => (
              <KanbanCard
                key={candidate.id}
                id={candidate.id}
                name={candidate.name}
                column={candidate.column}
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-ofm-micro font-semibold text-zinc-500">
                    {initials(candidate.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ofm-body text-zinc-800">
                      {candidate.name}
                    </p>
                    <p className="truncate text-ofm-caption text-zinc-400">
                      {candidate.role}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-ofm-micro text-zinc-400">
                        {candidate.source}
                      </span>
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-ofm-micro font-bold ${scoreTone(
                          candidate.score
                        )}`}
                      >
                        {candidate.score}
                      </span>
                    </div>
                  </div>
                </div>
              </KanbanCard>
            )}
          </KanbanCards>
        </KanbanBoard>
      )}
    </KanbanProvider>
  );
}

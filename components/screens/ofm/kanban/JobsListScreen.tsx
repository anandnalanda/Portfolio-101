"use client";

/* Full Flow · beat 1 — "Your jobs, in one place."

   The employer's entry point: every role they're hiring for on one screen,
   with live applicant counts and status. A calm, finished screen in the OFM
   Kibo system, dropped into the DashboardShell. The Virtual Chatter row is
   the one the rest of the Full Flow drills into, so it reads as active. */

import { Search, ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";
import { dp } from "@/components/screens/ofm/kanban/PipelineBoard";

type Job = {
  title: string;
  team: string;
  place: string;
  status: "Open" | "Draft" | "Closed";
  applicants: number;
  fresh: number;
  interviews: number | null;
  /** Relative post date; null while still a draft. */
  posted: string | null;
  faces: string[];
  /** Hiring manager — name shown so teammates can tell owners apart. */
  owner: { name: string; dp: string };
  featured?: boolean;
};

const JOBS: Job[] = [
  {
    title: "Virtual Chatter",
    team: "Chatting",
    place: "Remote",
    status: "Open",
    applicants: 142,
    fresh: 12,
    interviews: 8,
    posted: "2w ago",
    faces: [
      "photo-1494790108377-be9c29b29330",
      "photo-1500648767791-00dcc994a43e",
      "photo-1438761681033-6461ffad8d80",
    ],
    owner: { name: "Jasmine", dp: "photo-1573496359142-b8d87734a5a2" },
    featured: true,
  },
  {
    title: "Senior Frontend Engineer",
    team: "Engineering",
    place: "Remote",
    status: "Open",
    applicants: 210,
    fresh: 20,
    interviews: 5,
    posted: "1w ago",
    faces: [
      "photo-1544005313-94ddf0286df2",
      "photo-1554151228-14d9def656e4",
      "photo-1517841905240-472988babdf9",
    ],
    owner: { name: "Daniel", dp: "photo-1560250097-0b93528c311a" },
  },
  {
    title: "Graphic Designer",
    team: "Creative",
    place: "Remote",
    status: "Open",
    applicants: 156,
    fresh: 8,
    interviews: 6,
    posted: "2w ago",
    faces: [
      "photo-1487412720507-e7ab37603c6f",
      "photo-1531427186611-ecfd6d936c79",
      "photo-1568602471122-7832951cc4c5",
    ],
    owner: { name: "Daniel", dp: "photo-1560250097-0b93528c311a" },
  },
  {
    title: "Virtual Assistant",
    team: "Operations",
    place: "Remote",
    status: "Open",
    applicants: 98,
    fresh: 5,
    interviews: 4,
    posted: "3w ago",
    faces: [
      "photo-1506794778202-cad84cf45f1d",
      "photo-1502685104226-ee32379fefbe",
      "photo-1472099645785-5658abf4ff4e",
    ],
    owner: { name: "Daniel", dp: "photo-1560250097-0b93528c311a" },
  },
  {
    title: "Chat Team Lead",
    team: "Chatting",
    place: "Remote",
    status: "Draft",
    applicants: 0,
    fresh: 0,
    interviews: null,
    posted: null,
    faces: [],
    owner: { name: "Jasmine", dp: "photo-1573496359142-b8d87734a5a2" },
  },
  {
    title: "Video Editor",
    team: "Creative",
    place: "Remote",
    status: "Closed",
    applicants: 74,
    fresh: 0,
    interviews: 12,
    posted: "5w ago",
    faces: [
      "photo-1507003211169-0a1dd7228f2d",
      "photo-1545996124-0501ebae84d0",
      "photo-1524504388940-b1c1722653e1",
    ],
    owner: { name: "Daniel", dp: "photo-1560250097-0b93528c311a" },
  },
  {
    title: "Social Media Manager",
    team: "Marketing",
    place: "Remote",
    status: "Open",
    applicants: 121,
    fresh: 9,
    interviews: 5,
    posted: "4d ago",
    faces: [
      "photo-1507003211169-0a1dd7228f2d",
      "photo-1554151228-14d9def656e4",
      "photo-1502685104226-ee32379fefbe",
    ],
    owner: { name: "Daniel", dp: "photo-1560250097-0b93528c311a" },
  },
  {
    title: "Account Manager",
    team: "Accounts",
    place: "Remote",
    status: "Open",
    applicants: 163,
    fresh: 11,
    interviews: 3,
    posted: "5d ago",
    faces: [
      "photo-1494790108377-be9c29b29330",
      "photo-1517841905240-472988babdf9",
      "photo-1545996124-0501ebae84d0",
    ],
    owner: { name: "Jasmine", dp: "photo-1573496359142-b8d87734a5a2" },
  },
  {
    title: "Content Scheduler",
    team: "Operations",
    place: "Hybrid",
    status: "Open",
    applicants: 88,
    fresh: 6,
    interviews: 2,
    posted: "1w ago",
    faces: [
      "photo-1500648767791-00dcc994a43e",
      "photo-1524504388940-b1c1722653e1",
      "photo-1531427186611-ecfd6d936c79",
    ],
    owner: { name: "Daniel", dp: "photo-1560250097-0b93528c311a" },
  },
];

/* Contra-style status: small uppercase tinted badge, no ring, no dot. */
function StatusBadge({ status }: { status: Job["status"] }) {
  const tone =
    status === "Open"
      ? "bg-ofm-50 text-ofm-700"
      : status === "Draft"
      ? "bg-zinc-100 text-zinc-500"
      : "bg-zinc-100 text-zinc-400";
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-[3px] text-ofm-micro font-semibold uppercase tracking-[0.08em] ${tone}`}
    >
      {status}
    </span>
  );
}

/* Contra-style applicants cell: avatar stack with a +N overflow chip,
   fresh count as a NEW pill beside it. */
function ApplicantStack({ job }: { job: Job }) {
  if (job.applicants === 0)
    return <span className="text-ofm-caption text-zinc-400">No applicants yet</span>;
  const extra = job.applicants - job.faces.length;
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-1.5">
        {job.faces.map((id) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={id}
            src={dp(id)}
            alt=""
            className="size-6 rounded-full object-cover ring-2 ring-white"
          />
        ))}
        {extra > 0 && (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-zinc-100 px-1 text-ofm-micro font-semibold tabular-nums text-zinc-500 ring-2 ring-white">
            +{extra}
          </span>
        )}
      </div>
      {job.fresh > 0 && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ofm-50 py-[3px] pl-2 pr-2.5 text-ofm-micro font-semibold tabular-nums text-ofm-700 ring-1 ring-inset ring-ofm-600/15">
          <span className="relative flex size-1.5 shrink-0">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ofm-500 opacity-50 motion-reduce:hidden"
              style={{
                animationDuration: "2.6s",
                animationDelay: `${(job.applicants % 4) * 0.5}s`,
              }}
            />
            <span className="relative inline-flex size-1.5 rounded-full bg-ofm-500" />
          </span>
          {job.fresh} new
        </span>
      )}
    </div>
  );
}

const Header = (
  <div className="flex min-w-0 items-baseline gap-2.5">
    <span className="text-ofm-display font-semibold text-zinc-900">Jobs</span>
  </div>
);

export default function JobsListScreen() {
  return (
    <DashboardShell activeNav="Jobs" headerLeft={Header}>
      <div className="flex h-full flex-col">
        {/* filter row */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200/70 px-5 py-2.5">
          <div className="flex h-8 items-center gap-0.5 rounded-lg bg-zinc-100 p-0.5 text-ofm-label font-medium">
            {[
              ["All", 9],
              ["Open", 7],
              ["Draft", 1],
              ["Closed", 1],
            ].map(([label, n], i) => (
              <button
                key={label}
                className={`flex h-7 items-center gap-1.5 rounded-md px-2.5 transition-colors ${
                  i === 0 ? "bg-white text-zinc-800 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {label}
                <span className="text-ofm-caption tabular-nums text-zinc-400">{n}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200/70 px-2.5 text-zinc-400 transition-colors focus-within:border-ofm-400 focus-within:ring-2 focus-within:ring-ofm-100">
              <Search className="size-3.5 shrink-0" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search jobs"
                className="w-[150px] bg-transparent text-ofm-label font-medium text-zinc-700 placeholder:font-medium placeholder:text-zinc-400 focus:outline-none"
              />
            </label>
            <button className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200/70 px-2.5 text-ofm-label font-medium text-zinc-600 hover:bg-zinc-50">
              <ArrowUpDown className="size-3.5 text-zinc-400" strokeWidth={2} />
              Sort: Relevance
            </button>
          </div>
        </div>

        {/* table — Contra-style: white card on a soft-gray canvas, sentence-case
            headers, status badge + meta above the title, status dot, no leading
            initials tile. */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white shadow-sm">
            {/* column heads */}
            <div className="grid grid-cols-[1fr_200px_96px_90px_120px_36px] items-center gap-3 border-b border-zinc-200/70 px-4 py-2.5 text-ofm-micro font-medium uppercase tracking-[0.06em] text-zinc-400">
              <span>Job</span>
              <span>Applicants</span>
              <span>Interviews</span>
              <span>Posted</span>
              <span>Owner</span>
              <span />
            </div>
            {JOBS.map((job) => (
              <div
                key={job.title}
                className={`grid cursor-pointer grid-cols-[1fr_200px_96px_90px_120px_36px] items-center gap-3 border-b border-zinc-200/70 px-4 py-2.5 last:border-0 transition-colors ${
                  job.featured ? "bg-ofm-50/40 hover:bg-ofm-50/70" : "hover:bg-zinc-50"
                }`}
              >
                {/* job */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={job.status} />
                    <span className="truncate text-ofm-caption text-zinc-400">
                      {job.team} · {job.place}
                    </span>
                  </div>
                  <div className="mt-1 flex min-w-0 items-center">
                    <span className="truncate text-ofm-body font-semibold text-zinc-900">
                      {job.title}
                    </span>
                  </div>
                </div>
                {/* applicants */}
                <ApplicantStack job={job} />
                {/* interviews */}
                <span>
                  {job.interviews === null ? (
                    <span className="text-ofm-caption text-zinc-300">–</span>
                  ) : (
                    <span className="text-ofm-label font-medium tabular-nums text-zinc-700">
                      {job.interviews}
                    </span>
                  )}
                </span>
                {/* posted */}
                {job.posted === null ? (
                  <span className="text-ofm-caption text-zinc-300">–</span>
                ) : (
                  <span className="text-ofm-caption text-zinc-500">{job.posted}</span>
                )}
                {/* owner */}
                <span className="flex min-w-0 items-center gap-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dp(job.owner.dp)}
                    alt=""
                    className="size-6 shrink-0 rounded-full object-cover ring-1 ring-zinc-200/70"
                  />
                  <span className="truncate text-ofm-caption font-medium text-zinc-600">
                    {job.owner.name}
                  </span>
                </span>
                {/* action */}
                <button className="flex size-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100">
                  <MoreHorizontal className="size-4" strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>

          {/* new job affordance */}
          <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-zinc-300 py-2.5 text-ofm-label font-medium text-zinc-400 transition-colors hover:border-ofm-300 hover:bg-ofm-50/50 hover:text-ofm-700">
            <Plus className="size-4" strokeWidth={2} />
            Post a new job
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}

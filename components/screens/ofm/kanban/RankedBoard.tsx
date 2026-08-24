/* Screen 2 - "Ranked before you lift a finger."

   The hiring board with the incoming (Applied) column auto-sorted by AI match,
   best-fit on top. A static, presentational view (no dnd) in the OFM Kibo
   system, caged in `.kibo`. Rank badges + a "Ranked by AI match" chip make the
   sorting the point; the top candidate is highlighted. */

type Candidate = {
  name: string;
  role: string;
  source: string;
  score: number;
};

const COLUMNS: {
  name: string;
  ranked?: boolean;
  cards: Candidate[];
}[] = [
  {
    name: "Applied",
    ranked: true,
    cards: [
      { name: "Sarah Chen", role: "Frontend Engineer", source: "LinkedIn", score: 92 },
      { name: "Marcus Johnson", role: "Frontend Engineer", source: "Referral", score: 85 },
      { name: "Priya Patel", role: "Frontend Engineer", source: "Indeed", score: 78 },
      { name: "James Wilson", role: "Frontend Engineer", source: "Direct", score: 71 },
    ],
  },
  {
    name: "Screening",
    cards: [
      { name: "Aisha Rahman", role: "Backend Engineer", source: "Referral", score: 88 },
      { name: "David Kim", role: "Backend Engineer", source: "LinkedIn", score: 83 },
      { name: "Elena Volkov", role: "Backend Engineer", source: "Indeed", score: 76 },
    ],
  },
  {
    name: "Interview",
    cards: [
      { name: "Tomoko Sato", role: "Full Stack", source: "Referral", score: 95 },
      { name: "Ryan O'Brien", role: "Full Stack", source: "LinkedIn", score: 91 },
    ],
  },
  {
    name: "Offer",
    cards: [{ name: "Liam Carter", role: "Frontend Engineer", source: "Direct", score: 97 }],
  },
];

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

function Card({
  c,
  rank,
  top,
}: {
  c: Candidate;
  rank?: number;
  top?: boolean;
}) {
  return (
    <div
      className={`rounded-lg bg-white p-3 shadow-sm ${
        top
          ? "border-2 border-ofm-400 ring-2 ring-ofm-100"
          : "border border-zinc-200/80"
      }`}
    >
      <div className="flex items-start gap-2.5">
        {rank ? (
          <div
            className={`flex size-6 shrink-0 items-center justify-center rounded-full text-ofm-caption font-bold ${
              top ? "bg-ofm-500 text-white" : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {rank}
          </div>
        ) : null}
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-ofm-caption font-semibold text-zinc-500">
          {initials(c.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-ofm-body font-semibold text-zinc-800">
              {c.name}
            </p>
            {top ? (
              <span className="shrink-0 rounded-full bg-ofm-50 px-1.5 py-0.5 text-ofm-micro font-semibold text-ofm-700">
                Top match
              </span>
            ) : null}
          </div>
          <p className="truncate text-ofm-label text-zinc-400">{c.role}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-ofm-caption text-zinc-400">{c.source}</span>
            <span
              className={`rounded-md px-1.5 py-0.5 text-ofm-label font-bold ${scoreTone(
                c.score
              )}`}
            >
              {c.score}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RankedBoard() {
  return (
    <div className="kibo absolute inset-0 bg-white p-10">
      <div className="grid h-full grid-flow-col auto-cols-fr gap-4">
        {COLUMNS.map((col) => (
          <div
            key={col.name}
            className={`flex min-h-0 flex-col overflow-hidden rounded-xl border ${
              col.ranked ? "border-ofm-200 bg-ofm-50/40" : "border-zinc-200 bg-zinc-50"
            }`}
          >
            <div className="flex items-center justify-between px-3.5 py-3">
              <div className="flex items-center gap-2">
                <span className="text-ofm-body font-semibold text-zinc-700">
                  {col.name}
                </span>
                <span className="rounded-full bg-white px-1.5 py-0.5 text-ofm-micro font-medium text-zinc-400">
                  {col.cards.length}
                </span>
              </div>
              {col.ranked ? (
                <span className="flex items-center gap-1 rounded-full bg-ofm-100 px-2 py-1 text-ofm-micro font-semibold text-ofm-700">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M6 13l6 6 6-6" />
                  </svg>
                  AI match
                </span>
              ) : null}
            </div>
            <div className="flex flex-1 flex-col gap-2.5 overflow-hidden px-2.5 pb-2.5">
              {col.cards.map((c, i) => (
                <Card
                  key={c.name}
                  c={c}
                  rank={col.ranked ? i + 1 : undefined}
                  top={col.ranked && i === 0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

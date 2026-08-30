/* Candidate-facing chrome for the OFM Jobs job board and profile — the
   counterpart to the employer's DashboardShell, and now structurally matched
   to it: a left sidebar (logo, nav sections, profile card, identity switcher)
   plus a top toolbar (breadcrumb + search / notifications). The candidate's
   world, same bones as the employer's.

   Fixed 1440×900, always mounted inside ScaledStage and caged in `.kibo`. */

import type { ReactNode } from "react";
import {
  Briefcase,
  Sparkles,
  MessageSquare,
  ClipboardList,
  Bookmark,
  ClipboardCheck,
  GraduationCap,
  Settings,
  LifeBuoy,
  Bell,
  PanelLeft,
} from "lucide-react";
import OfmLogo from "@/components/screens/ofm/OfmLogo";

type Item = { icon: typeof Briefcase; label: string; badge?: string };

const MAIN: Item[] = [
  { icon: Briefcase, label: "Find work" },
  { icon: Sparkles, label: "Recommended" },
  { icon: MessageSquare, label: "Messages" },
];

const JOBS: Item[] = [
  { icon: ClipboardList, label: "Applications", badge: "1" },
  { icon: Bookmark, label: "Saved jobs" },
];

const PROOF: Item[] = [
  { icon: ClipboardCheck, label: "Skill tests" },
  { icon: GraduationCap, label: "Training" },
];

const BOTTOM: Item[] = [
  { icon: Settings, label: "Settings" },
  { icon: LifeBuoy, label: "Support" },
];

function NavItem({ item, active = false }: { item: Item; active?: boolean }) {
  const Icon = item.icon;
  return (
    <button
      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-ofm-body transition-colors ${
        active
          ? "bg-ofm-50 font-medium text-zinc-900"
          : "font-normal text-zinc-600 hover:bg-zinc-50"
      }`}
    >
      <Icon
        className={`size-5 shrink-0 ${active ? "text-zinc-600" : "text-zinc-400"}`}
        strokeWidth={active ? 2 : 1.75}
      />
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge ? (
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-ofm-600 text-ofm-micro font-semibold text-white">
          {item.badge}
        </span>
      ) : null}
    </button>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 px-3 pb-2 pt-6">
      <span className="shrink-0 text-ofm-micro font-medium uppercase tracking-[0.06em] text-zinc-400">
        {children}
      </span>
      <span className="h-px flex-1 bg-zinc-200/70" />
    </div>
  );
}

export default function CandidateShell({
  children,
  activeTab = "Find work",
  headerLeft,
}: {
  children?: ReactNode;
  /** Which sidebar item is highlighted (label match). */
  activeTab?: string;
  /** Override the top toolbar's left region (breadcrumb / title). */
  headerLeft?: ReactNode;
}) {
  return (
    <div className="kibo absolute inset-0 flex bg-white text-zinc-700">
      {/* ── sidebar ── */}
      <aside className="flex w-[264px] shrink-0 flex-col border-r border-zinc-200/70 bg-white">
        {/* logo */}
        <div className="flex h-[60px] items-center justify-between border-b border-zinc-200/70 px-5">
          <div className="flex items-center gap-2">
            <OfmLogo variant="brand" className="h-[30px] w-auto" />
            <span className="text-ofm-display font-semibold tracking-[-1px] text-zinc-700">
              OFM Jobs
            </span>
          </div>
          <PanelLeft className="size-5 text-zinc-400" strokeWidth={1.75} />
        </div>

        {/* nav */}
        <nav className="flex-1 overflow-y-auto px-3 pt-3">
          <div className="flex flex-col gap-1">
            {MAIN.map((it) => (
              <NavItem key={it.label} item={it} active={it.label === activeTab} />
            ))}
          </div>
          <SectionLabel>Jobs</SectionLabel>
          <div className="flex flex-col gap-1">
            {JOBS.map((it) => (
              <NavItem key={it.label} item={it} active={it.label === activeTab} />
            ))}
          </div>
          <SectionLabel>Proofs</SectionLabel>
          <div className="flex flex-col gap-1">
            {PROOF.map((it) => (
              <NavItem key={it.label} item={it} active={it.label === activeTab} />
            ))}
          </div>
        </nav>

        {/* profile completion */}
        <div className="px-3 pt-3">
          <div className="rounded-lg border border-zinc-200/70 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-ofm-label font-medium text-zinc-700">
                Complete your profile
              </span>
              <span className="text-ofm-caption font-semibold tabular-nums text-ofm-600">
                70%
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full rounded-full bg-ofm-500" style={{ width: "70%" }} />
            </div>
          </div>
        </div>

        {/* bottom: settings / support + identity */}
        <div className="flex flex-col gap-1 px-3 pt-2">
          {BOTTOM.map((it) => (
            <NavItem key={it.label} item={it} active={it.label === activeTab} />
          ))}
        </div>
        <div className="p-3">
          <button
            className={`flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 transition-colors ${
              activeTab === "Profile"
                ? "border-ofm-200 bg-ofm-50"
                : "border-zinc-200/70 hover:bg-zinc-50"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/maria.jpg"
              alt="Maria Reyes"
              className="size-9 shrink-0 rounded-full object-cover ring-1 ring-black/5"
            />
            <span className="min-w-0 flex-1 truncate text-left text-ofm-body font-medium text-zinc-800">
              Maria Reyes
            </span>
          </button>
        </div>
      </aside>

      {/* ── main ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* top toolbar */}
        <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-zinc-200/70 bg-white px-5">
          {headerLeft ?? (
            <span className="truncate text-ofm-display font-semibold text-zinc-900">
              {activeTab}
            </span>
          )}
          <div className="flex items-center gap-3">
            <button className="relative flex size-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-50">
              <Bell className="size-5" strokeWidth={1.75} />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-ofm-500" />
            </button>
          </div>
        </header>

        {/* content slot */}
        <main className="relative min-h-0 flex-1 overflow-hidden bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}

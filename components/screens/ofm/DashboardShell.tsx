/* OFM Jobs dashboard shell - sidebar navigation + top toolbar only.

   Structure adapted from Contra's hiring-workspace dashboard (Mobbin ref),
   rebuilt in the OFM Jobs design system: Kibo tokens, emerald brand. The
   content area is a slot (`children`) - the pipeline board drops in here. */

import type { ReactNode } from "react";
import {
  Home,
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  Users,
  Compass,
  BarChart3,
  FileText,
  Settings,
  LifeBuoy,
  Bell,
  Plus,
  ChevronRight,
  ChevronDown,
  PanelLeft,
} from "lucide-react";
import OfmLogo from "@/components/screens/ofm/OfmLogo";

type Item = { icon: typeof Home; label: string; badge?: string; trailing?: "add" };

const MAIN: Item[] = [
  { icon: Home, label: "Home" },
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: MessageSquare, label: "Messages", badge: "3" },
];

const HIRING: Item[] = [
  { icon: Briefcase, label: "Jobs", trailing: "add" },
  { icon: Users, label: "Candidates" },
  { icon: Compass, label: "Discover" },
];

const INSIGHTS: Item[] = [
  { icon: BarChart3, label: "Analytics" },
  { icon: FileText, label: "Reports" },
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
      {item.trailing === "add" ? (
        <Plus className="size-4 text-zinc-400 opacity-0 group-hover:opacity-100" strokeWidth={2.2} />
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

export default function DashboardShell({
  children,
  activeNav = "Jobs",
  headerLeft,
}: {
  children?: ReactNode;
  /** Which sidebar item is highlighted. */
  activeNav?: string;
  /** Override the top toolbar's left region (breadcrumb). */
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
              <NavItem key={it.label} item={it} active={it.label === activeNav} />
            ))}
          </div>
          <SectionLabel>Hiring</SectionLabel>
          <div className="flex flex-col gap-1">
            {HIRING.map((it) => (
              <NavItem key={it.label} item={it} active={it.label === activeNav} />
            ))}
          </div>
          <SectionLabel>Insights</SectionLabel>
          <div className="flex flex-col gap-1">
            {INSIGHTS.map((it) => (
              <NavItem key={it.label} item={it} active={it.label === activeNav} />
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
                50%
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full rounded-full bg-ofm-500" style={{ width: "50%" }} />
            </div>
          </div>
        </div>

        {/* bottom: settings / support + studio switcher */}
        <div className="flex flex-col gap-1 px-3 pt-2">
          {BOTTOM.map((it) => (
            <NavItem key={it.label} item={it} active={it.label === activeNav} />
          ))}
        </div>
        <div className="p-3">
          <button className="flex w-full items-center gap-2.5 rounded-lg border border-zinc-200/70 px-2.5 py-2 hover:bg-zinc-50">
            {/* fake Acme Studio logo — colorful gradient DP */}
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-lg shadow-sm ring-1 ring-black/5"
              style={{
                backgroundImage:
                  "radial-gradient(at 18% 18%, #818cf8 0px, transparent 55%), radial-gradient(at 82% 12%, #f0abfc 0px, transparent 50%), radial-gradient(at 85% 88%, #22d3ee 0px, transparent 55%), radial-gradient(at 15% 90%, #fb7185 0px, transparent 55%)",
                backgroundColor: "#7c3aed",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="2.4" />
                <circle cx="12" cy="12" r="2.6" fill="#fff" />
              </svg>
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-ofm-body font-medium leading-tight text-zinc-800">
                Acme Studio
              </span>
              <span className="block truncate text-ofm-caption leading-tight text-zinc-400">
                Jasmine&apos;s workspace
              </span>
            </span>
          </button>
        </div>
      </aside>

      {/* ── main ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* top toolbar */}
        <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-zinc-200/70 px-5">
          {headerLeft ?? (
            <div className="flex min-w-0 items-center gap-1.5">
              <button className="shrink-0 text-ofm-body font-normal text-zinc-400 transition-colors hover:text-zinc-600">
                Jobs
              </button>
              <ChevronRight className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
              <button className="group/switch flex min-w-0 items-center gap-1.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-zinc-100">
                <span className="truncate text-ofm-display font-semibold text-zinc-900">
                  Virtual Chatter
                </span>
                <ChevronDown className="size-4 shrink-0 text-zinc-400" strokeWidth={2} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 rounded-lg bg-ofm-600 px-3 py-2 text-ofm-label font-medium text-white hover:bg-ofm-700">
              <Plus className="size-4" strokeWidth={2} />
              Post a job
            </button>
            <span className="h-5 w-px bg-zinc-200/70" />
            <button className="relative flex size-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-50">
              <Bell className="size-5" strokeWidth={1.75} />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-ofm-500" />
            </button>
          </div>
        </header>

        {/* content slot - the board drops in here */}
        <main className="relative min-h-0 flex-1 overflow-hidden bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}

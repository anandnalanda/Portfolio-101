"use client";

/* The OFM Jobs Test Library, matching the real product and built on the OFM
   (Kibo) design-system primitives — Card, Button, Badge — over semantic
   tokens so it inherits the emerald brand. A "Back to Job Post" bar, a
   Categories / Job Roles filter rail, search + Grid/List toggle, and cards of
   standardized tests. Mid-demo a second test is selected, ticking the count. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Bell,
  Search,
  LayoutGrid,
  List as ListIcon,
  BarChart3,
  Sparkles,
  Clock,
  HelpCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const EASE = [0.22, 1, 0.36, 1] as const;

const CATEGORIES = ["English", "Sales", "Marketing", "Operations", "Administration", "Management"];

type Test = {
  id: string;
  title: string;
  ai?: boolean;
  desc: string;
  mins: number;
  qs: number;
  tags: string[];
};

const ENGLISH: Test[] = [
  { id: "b1", title: "Intermediate English B1", ai: true, desc: "Effective communication tailored for customer-service professionals on live chat.", mins: 8, qs: 20, tags: ["Sales", "Negotiation"] },
  { id: "c1", title: "Advanced English C1", desc: "Advanced linguistic skills and cultural awareness for global business environments.", mins: 10, qs: 30, tags: ["Marketing", "Persuasion"] },
  { id: "a2", title: "Business English A2", desc: "Basic vocabulary and expressions for everyday business interactions.", mins: 6, qs: 15, tags: ["Customer Support", "Basic Communication"] },
];

const GENERAL: Test[] = [
  { id: "typing", title: "Typing Test", desc: "Typing speed and accuracy on a timed passage, designed for customer service.", mins: 6, qs: 15, tags: ["Speed", "Chat"] },
  { id: "speed", title: "Internet Speed Test", desc: "A quick check of a candidate's connection: download, upload and ping.", mins: 6, qs: 15, tags: ["Speed"] },
  { id: "verbal", title: "Verbal Test", desc: "Assesses grasp of key business vocabulary and phrases, spoken and scored.", mins: 6, qs: 15, tags: ["Basic Communication"] },
];

function Checkbox({ on }: { on: boolean }) {
  return (
    <span
      className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-200 ${
        on ? "border-primary bg-primary" : "border-input bg-background"
      }`}
    >
      {on && <Check className="size-3.5 text-primary-foreground" strokeWidth={3} />}
    </span>
  );
}

function TestCard({ t, selected }: { t: Test; selected: boolean }) {
  return (
    <Card
      className={`flex h-full flex-col p-4 shadow-none transition-colors duration-300 ${
        selected ? "border-primary ring-1 ring-primary/25" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="flex size-9 items-center justify-center rounded-full bg-ofm-50">
          <BarChart3 className="size-[18px] text-primary" strokeWidth={2} />
        </span>
        <Checkbox on={selected} />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <h3 className="text-ofm-body font-semibold text-foreground">{t.title}</h3>
        {t.ai && (
          <Badge className="gap-1 rounded-full px-2 py-0.5 text-ofm-micro">
            <Sparkles className="size-3" strokeWidth={2.5} />
            AI Suggested
          </Badge>
        )}
      </div>
      <p className="mt-1.5 line-clamp-2 flex-1 text-ofm-caption leading-snug text-muted-foreground">
        {t.desc}
      </p>
      <div className="mt-3 flex items-center gap-4 text-ofm-caption font-medium text-primary">
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" strokeWidth={2} />
          {t.mins} min
        </span>
        <span className="flex items-center gap-1.5">
          <HelpCircle className="size-3.5" strokeWidth={2} />
          {t.qs} Questions
        </span>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {t.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="rounded-md px-2 py-0.5 text-ofm-micro font-medium">
            {tag}
          </Badge>
        ))}
      </div>
    </Card>
  );
}

export default function TestLibraryGrid() {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<Set<string>>(new Set(["b1"]));

  useEffect(() => {
    if (reduced) {
      setSelected(new Set(["b1", "typing"]));
      return;
    }
    const t = setTimeout(() => setSelected((s) => new Set(s).add("typing")), 1600);
    return () => clearTimeout(t);
  }, [reduced]);

  const count = selected.size;

  return (
    <div className="kibo absolute inset-0 flex flex-col bg-zinc-50 text-foreground">
      {/* top bar */}
      <header className="flex h-[58px] shrink-0 items-center justify-between border-b bg-background px-6">
        <Button variant="outline" className="gap-1.5">
          <ChevronLeft strokeWidth={2} />
          Back to Job Post
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="text-primary">
            <MessageSquare strokeWidth={1.75} />
          </Button>
          <Button variant="outline" size="icon" className="text-primary">
            <Bell strokeWidth={1.75} />
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* filter rail */}
        <aside className="w-[228px] shrink-0 border-r p-4">
          <Card className="p-4 shadow-none">
            <div className="flex items-center justify-between">
              <span className="text-ofm-body font-semibold text-foreground">Categories</span>
              <ChevronUp className="size-4 text-muted-foreground" strokeWidth={2} />
            </div>
            <div className="mt-3 flex flex-col gap-2.5">
              {CATEGORIES.map((c) => (
                <label key={c} className="flex items-center gap-2.5">
                  <span className="flex size-[18px] items-center justify-center rounded-[5px] border border-input bg-background" />
                  <span className="text-ofm-label text-muted-foreground">{c}</span>
                </label>
              ))}
            </div>
          </Card>
          <Card className="mt-3 flex items-center justify-between p-4 shadow-none">
            <span className="text-ofm-body font-semibold text-foreground">Job Roles</span>
            <ChevronDown className="size-4 text-muted-foreground" strokeWidth={2} />
          </Card>
        </aside>

        {/* main */}
        <main className="min-w-0 flex-1 overflow-hidden px-7 py-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-ofm-hero font-semibold text-foreground">Test Library</h1>
              <p className="mt-1 text-ofm-body text-muted-foreground">
                Here&apos;s a rundown of all the tests you can add to your job post.
              </p>
            </div>
            <motion.div
              key={count}
              initial={reduced ? false : { scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <Badge className="border-transparent bg-ofm-50 px-3 py-1.5 text-ofm-label text-ofm-700 hover:bg-ofm-100">
                {count}/5 tests selected
              </Badge>
            </motion.div>
          </div>

          {/* search + toggle */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2.5 rounded-lg border border-input bg-background px-3.5 py-2.5">
              <Search className="size-4 text-muted-foreground" strokeWidth={2} />
              <span className="text-ofm-body text-muted-foreground">
                Search by test name, skill, or role…
              </span>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-ofm-50 p-1">
              <Button size="sm" className="h-8 gap-1.5">
                <LayoutGrid strokeWidth={2} />
                Grid
              </Button>
              <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-primary hover:bg-transparent">
                <ListIcon strokeWidth={2} />
                List
              </Button>
            </div>
          </div>

          {/* English tests */}
          <h2 className="mt-5 text-ofm-title font-semibold text-foreground">English Tests</h2>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {ENGLISH.map((t, i) => (
              <motion.div
                key={t.id}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE, delay: i * 0.05 }}
              >
                <TestCard t={t} selected={selected.has(t.id)} />
              </motion.div>
            ))}
          </div>

          {/* General tests */}
          <h2 className="mt-5 text-ofm-title font-semibold text-foreground">General Tests</h2>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {GENERAL.map((t, i) => (
              <motion.div
                key={t.id}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE, delay: (3 + i) * 0.05 }}
              >
                <TestCard t={t} selected={selected.has(t.id)} />
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

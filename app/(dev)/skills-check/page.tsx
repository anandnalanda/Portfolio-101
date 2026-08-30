"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import InviteScreen from "@/components/screens/ofm/tests/InviteScreen";
import EnglishTest from "@/components/screens/ofm/tests/EnglishTest";
import VerbalTest from "@/components/screens/ofm/tests/VerbalTest";
import ListeningTest from "@/components/screens/ofm/tests/ListeningTest";
import SpeedTest from "@/components/screens/ofm/tests/SpeedTest";
import TypingTest from "@/components/screens/ofm/tests/TypingTest";
import ScorecardScreen from "@/components/screens/ofm/tests/ScorecardScreen";

/* Dev preview for the candidate test-taking flow. `?screen=english|verbal|
   listening|speed|typing|scorecard|invite`. Fixed 1440×900, scaled to fit. */
const SCREENS: Record<string, React.ComponentType> = {
  invite: InviteScreen,
  english: EnglishTest,
  verbal: VerbalTest,
  listening: ListeningTest,
  speed: SpeedTest,
  typing: TypingTest,
  scorecard: ScorecardScreen,
};

function Frame() {
  const key = useSearchParams().get("screen") ?? "english";
  const Screen = SCREENS[key] ?? EnglishTest;
  return (
    <main
      className="fixed inset-0 flex items-center justify-center bg-[#f5f0eb] p-6"
      style={{ containerType: "size" }}
    >
      <div
        className="relative overflow-hidden rounded-2xl bg-white shadow-lg"
        style={{
          width: 1440,
          height: 900,
          transform: "scale(min(calc((100cqw - 48px) / 1440), calc((100cqh - 48px) / 900)))",
          transformOrigin: "center",
        }}
      >
        <Screen />
      </div>
    </main>
  );
}

export default function SkillsCheckDevPage() {
  return (
    <Suspense fallback={null}>
      <Frame />
    </Suspense>
  );
}

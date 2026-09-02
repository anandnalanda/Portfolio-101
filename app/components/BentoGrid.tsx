"use client";

import BioCard from "./cards/BioCard";
import SwooshCard from "./cards/SwooshCard";
import SettingsCard from "./cards/SettingsCard";
import StickerCard from "./cards/StickerCard";
import StapleTablesCard from "./cards/StapleTablesCard";
import SocialCard from "./cards/SocialCard";
import LaptopCard from "./cards/LaptopCard";
import VisualDirectionCard from "./cards/VisualDirectionCard";
import ExperimentsCard from "./cards/ExperimentsCard";
import KanbanCaseCard from "@/components/bento/kanban-case-card";
import LogoCard from "@/components/LogoCard/LogoCard";

export default function BentoGrid() {
  return (
    <main className="px-12 pt-6 max-w-[1200px] mx-auto max-md:px-4">
      <div className="grid grid-cols-bento auto-rows-bento gap-6 justify-center max-lg:grid-cols-[repeat(2,1fr)] max-lg:auto-rows-[258px] max-md:grid-cols-[1fr] max-md:auto-rows-[280px]">
        <BioCard />

        <SwooshCard />

        <SettingsCard />

        <ExperimentsCard />

        <StickerCard />

        <KanbanCaseCard
          fill
          href="/kanban-and-ai"
          title="Kanban and AI"
          caption="Kanban in OFM Jobs: from a flat list to a board people actually work in."
          pillCaption="A board people actually work in."
          className="col-span-2"
        />

        <LogoCard
          href="/ofm-jobs-tests"
          label="OFM Jobs Tests"
          descriptor="AI-powered hiring assessments."
        />

        <SocialCard />

        <VisualDirectionCard />

        <LaptopCard />

        <StapleTablesCard />
      </div>
    </main>
  );
}

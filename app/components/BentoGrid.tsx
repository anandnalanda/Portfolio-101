"use client";

import { motion } from "framer-motion";
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
    <main className="px-12 pt-6 max-w-[1200px] mx-auto max-xl:px-6 max-md:px-4 [container-type:inline-size]">
      {/* lg+: four fluid columns, rows kept square via the container width (258px at
          the 1200px max) but allowed to grow if a card needs it. Tablet: two columns on fixed 258px rows. Phone: one column,
          rows sized by each card (4:3 by default, see max-md:h-[75cqw] on the cards). */}
      {/* One entrance for every card, on the grid, so they all arrive on the
          same frame. It is transform-only on purpose: an opacity fade here
          would hide the bio paragraph (the page's largest paint) until
          hydration, which is the 2.5s mobile penalty removed last week. The
          cards used to each own a fade tied to their own viewport observer,
          which is why they used to pop in one after another. */}
      <motion.div
        initial={{ y: 12 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-[repeat(4,minmax(0,1fr))] auto-rows-[minmax(calc((100cqw_-_72px)/4),auto)] gap-6 justify-center max-lg:grid-cols-[repeat(2,1fr)] max-lg:auto-rows-[258px] max-md:grid-cols-[1fr] max-md:auto-rows-auto"
      >
        <BioCard />

        <SwooshCard />

        <SettingsCard />

        <ExperimentsCard />

        <StickerCard />

        <KanbanCaseCard
          fill
          href="/kanban-and-ai"
          title="Kanban and AI"
          caption="Kanban in OFM Jobs: from a flat list to a board people work in every day."
          pillCaption="A board people work in every day."
          className="col-span-2 max-md:col-span-1 max-md:h-[75cqw]"
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
      </motion.div>
    </main>
  );
}

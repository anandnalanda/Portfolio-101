"use client";

import BioCard from "./cards/BioCard";
import SwooshCard from "./cards/SwooshCard";
import SettingsCard from "./cards/SettingsCard";
import StickerCard from "./cards/StickerCard";
import StapleTablesCard from "./cards/StapleTablesCard";
import SocialCard from "./cards/SocialCard";
import LaptopCard from "./cards/LaptopCard";
import BentoTile from "./BentoTile";

export default function BentoGrid() {
  return (
    <main className="px-12 pt-6 max-w-[1200px] mx-auto max-md:px-4">
      <div className="grid grid-cols-bento auto-rows-bento gap-6 justify-center max-lg:grid-cols-[repeat(2,1fr)] max-lg:auto-rows-[258px] max-md:grid-cols-[1fr] max-md:auto-rows-[280px]">
        <BioCard />

        <SwooshCard />

        <SettingsCard />

        <BentoTile
          variant="tall"
          title="Experiments with AI"
          descriptor="Products built with AI — from concept to shipped."
          artifactLabel=""
        />

        <StickerCard />

        <BentoTile
          variant="wide"
          title="Kanban and AI"
          descriptor="Hiring pipeline with AI-ranked candidates."
          artifactLabel=""
        />

        <BentoTile
          title="OFM Jobs Tests"
          descriptor="Assessment system with AI-powered hiring."
          artifactLabel=""
        />

        <SocialCard />

        <BentoTile
          title="Visual Direction"
          descriptor="OFM Jobs & Jobsly — UI design and visual systems."
          artifactLabel=""
        />

        <LaptopCard />

        <StapleTablesCard />
      </div>
    </main>
  );
}

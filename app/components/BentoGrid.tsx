"use client";

import BioCard from "./cards/BioCard";
import BentoTile from "./BentoTile";

export default function BentoGrid() {
  return (
    <main className="px-12 pt-6 max-w-[1200px] mx-auto max-md:px-5">
      <div className="grid grid-cols-bento auto-rows-bento gap-6 justify-center max-lg:grid-cols-2 max-lg:auto-rows-[240px] max-md:grid-cols-1 max-md:auto-rows-[260px]">
        {/* Row 1-2: Bio + Staple Chat */}
        <BioCard />

        <BentoTile
          variant="large"
          title="Staple Chat"
          descriptor="Conversational AI for document analysis."
          artifactLabel="STAPLE_CHAT_ARTIFACT"
          // TODO: live interactive component goes here in polish week
        />

        {/* Row 3-4: Staple Tables (tall) + project squares + design direction */}
        <BentoTile
          variant="tall"
          title="Staple Tables"
          descriptor="AI table extraction at enterprise scale."
          artifactLabel="STAPLE_TABLES_ARTIFACT"
        />

        <BentoTile
          title="OFM Jobs — Test Library"
          descriptor="Assessment system that scaled with content."
          artifactLabel="OFM_TESTLIB_ARTIFACT"
        />

        <BentoTile
          title="OFM Jobs — Kanban + AI"
          descriptor="Hiring pipeline with AI-ranked candidates."
          artifactLabel="OFM_KANBAN_ARTIFACT"
        />

        {/* Design direction tiles */}
        <BentoTile
          title="Content Machine"
          descriptor="Visual & web design"
          artifactLabel="CM_VISUAL"
        />

        <BentoTile
          title="DMCA.me"
          descriptor="Visual & web design"
          artifactLabel="DMCA_VISUAL"
        />

        <BentoTile
          title="Jobsly"
          descriptor="Visual & web design"
          artifactLabel="JOBSLY_VISUAL"
        />

        <BentoTile
          title="OFM Site"
          descriptor="Visual & web design"
          artifactLabel="OFM_SITE_VISUAL"
        />
      </div>
    </main>
  );
}

"use client";

import BioCard from "./cards/BioCard";
import SwooshCard from "./cards/SwooshCard";
import SettingsCard from "./cards/SettingsCard";
import PhoneCard from "./cards/PhoneCard";
import IconCard from "./cards/IconCard";
import DocuFaiCard from "./cards/DocuFaiCard";
import ReadCvCard from "./cards/ReadCvCard";
import SocialCard from "./cards/SocialCard";
import ChatCard from "./cards/ChatCard";
import LaptopCard from "./cards/LaptopCard";
import TableCard from "./cards/TableCard";

export default function BentoGrid() {
  return (
    <main className="px-12 pt-6 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-bento auto-rows-bento gap-6 justify-center">
        <BioCard />
        <SwooshCard />
        <SettingsCard />
        <PhoneCard />
        <IconCard />
        <DocuFaiCard />
        <ReadCvCard />
        <SocialCard />
        <ChatCard />
        <LaptopCard />
        <TableCard />
      </div>
    </main>
  );
}

import JobPostWizard from "@/components/screens/ofm/tests/JobPostWizard";
import GatedJob from "@/components/screens/ofm/tests/GatedJob";
import EnglishTest from "@/components/screens/ofm/tests/EnglishTest";
import VerbalTest from "@/components/screens/ofm/tests/VerbalTest";
import ListeningTest from "@/components/screens/ofm/tests/ListeningTest";
import SpeedTest from "@/components/screens/ofm/tests/SpeedTest";
import TypingTest from "@/components/screens/ofm/tests/TypingTest";
import ApplicationUnlocked from "@/components/screens/ofm/tests/ApplicationUnlocked";
import ImpactVisual from "@/components/screens/ofm/tests/ImpactVisual";

/* Preview: the Full Flow screens at 1440×900. `?screen=f1|f3|f6..f10|f12|impact` */
const F1 = () => <JobPostWizard autoplay initialStep={1} />;

const SCREENS: Record<string, React.ComponentType> = {
  f1: F1,
  f3: GatedJob,
  f6: EnglishTest,
  f7: VerbalTest,
  f8: ListeningTest,
  f9: SpeedTest,
  f10: TypingTest,
  f12: ApplicationUnlocked,
  impact: ImpactVisual,
};

export default async function FlowPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ screen?: string }>;
}) {
  const { screen } = await searchParams;
  const Screen = SCREENS[screen ?? "f1"] ?? F1;
  return (
    <div className="min-h-screen bg-[#f5f0eb] p-10">
      <div
        className="mx-auto flex items-center justify-center"
        style={{ containerType: "size", height: "80vh" }}
      >
        <div
          className="relative overflow-hidden rounded-2xl shadow-lg"
          style={{
            aspectRatio: "1440 / 900",
            width: "min(100%, calc(100cqh * (1440 / 900)))",
          }}
        >
          <Screen />
        </div>
      </div>
    </div>
  );
}

import DiscoverMarket from "@/components/screens/ofm/tests/DiscoverMarket";
import type { Phase } from "@/components/screens/ofm/tests/candidateShared";

/* Preview: the Discover marketplace at 1440×900. `?phase=trust|portable`
   previews the d4/d5 overlay states; default is the d3 feed. */
export default async function DiscoverPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ phase?: string }>;
}) {
  const { phase } = await searchParams;
  const p: Phase =
    phase === "trust" || phase === "experience" || phase === "portable"
      ? phase
      : "feed";
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
          <DiscoverMarket phase={p} />
        </div>
      </div>
    </div>
  );
}

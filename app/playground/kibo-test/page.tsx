import DashboardShell from "@/components/screens/ofm/DashboardShell";
import PipelineBoard from "@/components/screens/ofm/kanban/PipelineBoard";

/* Demo: the OFM Jobs dashboard shell (sidebar + top toolbar) with the
   pipeline board dropped into its content slot. */
export default function KiboTestPage() {
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
          <DashboardShell>
            <PipelineBoard />
          </DashboardShell>
        </div>
      </div>
    </div>
  );
}

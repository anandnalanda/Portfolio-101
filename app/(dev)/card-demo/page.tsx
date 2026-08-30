import KanbanCaseCard from "@/components/bento/kanban-case-card";

export default function CardDemoPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAFA] p-8">
      <div className="w-full max-w-[640px]">
        <KanbanCaseCard
          href="/kanban-and-ai"
          title="Introducing Kanban in OFM Jobs"
          caption="Kanban in OFM Jobs: from a flat list to a board people actually work in."
        />
      </div>
    </main>
  );
}

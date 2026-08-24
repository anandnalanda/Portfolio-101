"use client";

/**
 * Staple Tables — playground. Full-viewport render of the extraction
 * workspace for design iteration. Variants via query params:
 *   ?fields=before|after   (default after)
 *   ?table=before|after    (default hidden)
 */
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StapleTablesScreen, { type Variant } from "@/components/screens/staple-tables/StapleTablesScreen";

function Playground() {
  const sp = useSearchParams();
  const fields = (sp.get("fields") === "before" ? "before" : "after") as Variant;
  const tableParam = sp.get("table");
  const table = tableParam === "before" || tableParam === "after" ? (tableParam as Variant) : null;
  return (
    <div style={{ height: "100dvh" }}>
      <StapleTablesScreen fieldsVariant={fields} tableVariant={table} />
    </div>
  );
}

export default function StapleTablesPlaygroundPage() {
  return (
    <Suspense>
      <Playground />
    </Suspense>
  );
}

"use client";

/**
 * StapleTablesScreen — the Staple Tables extraction workspace: the surface
 * where a reviewer checks what the AI pulled out of a document. Three regions:
 *
 *   · document toolbar (Back · title · Match/Complete/Reject/Label/Export)
 *   · the invoice document, centered on a gray canvas
 *   · the Fields panel on the right (the extracted key-values)
 *   · an "Extracted table" sheet that docks over the document bottom
 *
 * The case study's whole story is before vs after, so both the fields panel
 * and the table sheet render in two variants:
 *   fieldsVariant "before": one flat, cramped list — no groups, no cues.
 *   fieldsVariant "after":  logical groups, coloured indicators, breathing room.
 *   tableVariant  "before": gridlocked cells and ambiguous "Header N" labels.
 *   tableVariant  "after":  aligned columns, zebra striping, plain language.
 *
 * Built from the shared vendored Untitled UI components + tokens under
 * `.staple-theme`, exactly like StapleChatScreen. NOTE: after adding NEW
 * Tailwind classes here, regenerate the scoped CSS:
 *   cd tools/staple-ui && npm run build
 */
import "../_ui/ui.generated.css";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Inter } from "next/font/google";
import {
  ArrowLeft,
  Bell01,
  Check,
  ChevronLeft,
  ChevronRight,
  Download01,
  Minus,
  Plus,
  SearchLg,
  Tag01,
  XClose,
} from "@untitledui/icons";
import { Avatar } from "../_ui/uui/avatar";
import { Button } from "../_ui/uui/button";
import { Input } from "../_ui/uui/input";
import { cx } from "../_ui/uui/utils/cx";
import { HIGHLIGHT_COLOR, ProductSidebar, TopBar } from "../staple-chat/StapleChatScreen";
import {
  DOC_TITLE,
  FIELD_GROUPS,
  TABLE_HEADERS_AFTER,
  TABLE_HEADERS_BEFORE,
  beforeFieldGroups,
  extractedFields,
  invoice,
  lineItems,
} from "./data";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export type Variant = "before" | "after";
export type Highlight = "fields" | "table" | "toolbar" | "review" | "rail" | null;

/* The case-study highlight frame — the SAME element as Staple Chat's: a 2px
   brand stroke, a whisper of fill, a soft glow. A shared `layoutId` means only
   ONE frame exists at a time, so when a beat moves the highlight to a new
   region (fields → toolbar → table), framer spring-FLIES the frame across the
   screen instead of cross-fading. Reduced motion: a still frame that fades in.

   The frame wraps the region it marks, hugging its edges. `radius` accepts a
   single value or a CSS border-radius shorthand ("TL TR BR BL"): where a region
   corner meets the surrounding card's rounded `overflow-hidden` corner, that
   corner is rounded larger so the frame FOLLOWS the card's curve instead of
   being sliced by it. A negative inset hugs just outside a floating control. */
function AccentFrame({ inset = "10px", radius = 12 }: { inset?: string; radius?: number | string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      layoutId="tables-beat-highlight"
      aria-hidden
      style={{ position: "absolute", inset, zIndex: 40, pointerEvents: "none" }}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              /* A calm glide between regions — near-critically damped so it
                 settles without bouncing. */
              type: "spring",
              stiffness: 230,
              damping: 30,
              mass: 0.8,
              opacity: { duration: 0.3, ease: "easeOut" },
            }
      }
    >
      <motion.div
        initial={reduceMotion ? false : { scale: 1.025 }}
        animate={{ scale: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : /* a subtle settle as it lands — barely there, no overshoot */
              { type: "spring", stiffness: 300, damping: 32, mass: 0.8 }
        }
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          border: `2px solid ${HIGHLIGHT_COLOR}`,
          background: `color-mix(in srgb, ${HIGHLIGHT_COLOR} 3%, transparent)`,
          boxShadow: `0 0 0 3px color-mix(in srgb, ${HIGHLIGHT_COLOR} 11%, transparent), 0 0 12px color-mix(in srgb, ${HIGHLIGHT_COLOR} 13%, transparent)`,
        }}
      />
    </motion.div>
  );
}

/* ------------------------------- toolbar -------------------------------- */

/* Page navigation for a multi-page document: a bordered pager with prev/next
   chevrons flanking the current-page indicator, so the reviewer moves through
   the doc without going back out. (First page here, so "previous" is disabled.) */
function PagePager() {
  return (
    <div className="flex shrink-0 items-center gap-1 rounded-lg border border-secondary bg-primary p-1">
      <button
        type="button"
        disabled
        aria-label="Previous page"
        className="flex size-7 items-center justify-center rounded-md text-secondary transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="size-4" />
      </button>
      <span
        className="px-1 text-sm font-medium text-secondary"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        Page 1 of 2
      </span>
      <button
        type="button"
        aria-label="Next page"
        className="flex size-7 items-center justify-center rounded-md text-secondary transition-colors hover:bg-secondary"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

/* Top bar — the SAME app chrome as Staple Chat (notification bell + profile
   avatar on the right), so the two products read as one family. The document's
   own actions moved out of here into the floating review bar over the canvas. */
/* The redesigned top bar IS the product's global chrome — the exact same top
   bar as the rest of the product (Staple Chat's TopBar): a universal search and
   account controls, nothing document-specific. The document's own actions live
   in the floating bar below (ReviewActionBar). */
function DocToolbar({ highlighted = false }: { highlighted?: boolean }) {
  return (
    <div className="relative z-20 shrink-0">
      {/* Top bar: only the top-right corner meets the card's rounded corner, so
          round it larger to follow the curve; the rest hug tight. */}
      {highlighted && <AccentFrame inset="2px" radius="8px 22px 8px 8px" />}
      <TopBar />
    </div>
  );
}

/* The pre-redesign top bar: global chrome AND every document action crammed
   into a single row of equal-weight buttons — the "before" the toolbar beat
   argues against. */
function ZoomControl() {
  return (
    <div className="flex shrink-0 items-center rounded-lg border border-secondary">
      <Button color="tertiary" size="sm" iconLeading={Minus} aria-label="Zoom out" />
      <span className="px-0.5 text-sm font-medium text-secondary" style={{ fontVariantNumeric: "tabular-nums" }}>
        100%
      </span>
      <Button color="tertiary" size="sm" iconLeading={Plus} aria-label="Zoom in" />
    </div>
  );
}

function DocToolbarCluttered({ highlighted = false }: { highlighted?: boolean }) {
  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center gap-1.5 border-b border-secondary bg-primary px-3">
      {highlighted && <AccentFrame inset="2px" radius="8px 22px 8px 8px" />}
      <Button color="tertiary" size="sm" iconLeading={ArrowLeft} aria-label="Back" />
      <div className="mr-1 min-w-0 max-w-[140px]">
        <div className="truncate text-sm font-semibold text-primary">{DOC_TITLE}</div>
        <div className="text-[11px] text-tertiary">Invoice · PDF</div>
      </div>
      <PagePager />
      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        {/* Search squeezed in among the actions — global chrome fighting for
            the same row as document controls. */}
        <Input
          icon={SearchLg}
          placeholder="Search…"
          aria-label="Search"
          readOnly
          wrapperClassName="w-[150px]"
        />
        <Button color="secondary" size="sm" iconLeading={Check}>
          Complete
        </Button>
        <Button color="secondary" size="sm" iconLeading={XClose}>
          Reject
        </Button>
        <Button color="secondary" size="sm" iconLeading={Tag01}>
          Label
        </Button>
        <ZoomControl />
        <Button color="secondary" size="sm" iconLeading={Download01}>
          Export
        </Button>
        <span className="mx-1 h-6 w-px bg-border-secondary" />
        <span className="relative">
          <Button color="tertiary" size="sm" iconLeading={Bell01} aria-label="Notifications" />
          <span className="pointer-events-none absolute right-1.5 top-1.5 size-2 rounded-full bg-error-solid ring-2 ring-primary" />
        </span>
        <span className="shrink-0">
          <Avatar size="sm" src="/avatar.jpeg" alt="Anand Nalanda" className="size-8" />
        </span>
      </div>
    </header>
  );
}

/* Floating review toolbar — the document's contextual controls in one bar,
   docked at the bottom of the canvas instead of crowding the top bar: zoom, then
   the document's own actions (Reject / Complete / Export / Label). Page
   navigation is deliberately left out; it belongs to a separate redesign. */
function ReviewActionBar({ highlighted = false }: { highlighted?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center">
    <div className="pointer-events-auto relative flex items-center gap-1 rounded-2xl border border-secondary bg-primary p-1.5 shadow-lg">
      {highlighted && <AccentFrame inset="-5px" radius={18} />}
      {/* Zoom — a standard stepper: zoom out, the current level (tap to reset to
          100%), zoom in. Built from the Untitled UI Button primitive. */}
      <Button color="tertiary" size="sm" iconLeading={Minus} aria-label="Zoom out" />
      <Button color="tertiary" size="sm" aria-label="Reset zoom to 100%">
        <span className="min-w-[34px] text-center" style={{ fontVariantNumeric: "tabular-nums" }}>
          100%
        </span>
      </Button>
      <Button color="tertiary" size="sm" iconLeading={Plus} aria-label="Zoom in" />
      <span className="mx-1 h-5 w-px bg-border-secondary" />
      {/* The document's own actions: decision pair first (Complete is primary),
          then output + organise utilities. */}
      <Button color="secondary" size="sm" iconLeading={XClose}>
        Reject
      </Button>
      <Button color="primary" size="sm" iconLeading={Check}>
        Complete
      </Button>
      <Button color="secondary" size="sm" iconLeading={Download01}>
        Export
      </Button>
      <Button color="tertiary" size="sm" iconLeading={Tag01} aria-label="Label" />
    </div>
    </div>
  );
}

/* ------------------------------ document rail --------------------------- */

/* The batch queue — a mix of clean, printed documents (invoices, a purchase
   order, receipt, statement), each rendered as crisp SVG so the previews stay
   sharp at any size. A filename keeps similar pages tellable apart. */
const RAIL_DOCS: { name: string; src: string }[] = [
  /* The first (selected) document is the one open in the PDF area — its
     thumbnail renders a live, scaled copy of that same page (see DocRail). */
  { name: "Sample Invoice.pdf", src: "/rail/doc1.svg" },
  { name: "Acme Purchase Order.pdf", src: "/rail/doc2.svg" },
  { name: "Croma Receipt.pdf", src: "/rail/doc3.svg" },
  { name: "Figma Invoice.pdf", src: "/rail/doc4.svg" },
  { name: "Utility Statement.pdf", src: "/rail/doc5.svg" },
  { name: "Office Depot PO.pdf", src: "/rail/doc6.svg" },
  { name: "Vercel Invoice.pdf", src: "/rail/doc7.svg" },
];

/* Document rail — the whole batch beside the document. Built to scale past a
   handful of files: you don't scroll a queue of thousands, you filter it down
   to your working set (search + status), with a running progress count. The
   thumbnails then just show that short, relevant set. */
function DocRail({ highlighted = false }: { highlighted?: boolean }) {
  return (
    <aside className="relative z-20 flex w-[176px] shrink-0 flex-col overflow-hidden rounded-2xl border border-secondary bg-primary shadow-xs">
      {highlighted && <AccentFrame inset="2px" radius={14} />}
      <div className="flex items-center border-b border-secondary px-3 py-2.5">
        <span className="text-sm font-semibold text-primary">Documents</span>
      </div>

      {/* Search shrinks a queue of thousands to what you're looking for. */}
      <div className="border-b border-secondary p-3">
        <Input icon={SearchLg} placeholder="Search" aria-label="Search documents" readOnly />
      </div>

      <div className="scrollbar-subtle flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
        {RAIL_DOCS.map((d, i) => {
          const active = i === 0;
          return (
            <button
              key={d.name}
              type="button"
              aria-label={`Open ${d.name}`}
              aria-current={active}
              className="group block w-full text-left outline-none"
            >
              <div
                className={cx(
                  "relative overflow-hidden rounded-md shadow-xs transition",
                  active ? "ring-2 ring-brand" : "ring-1 ring-secondary group-hover:ring-[var(--color-brand-solid)]/40"
                )}
              >
                <div className="aspect-[3/2] w-full overflow-hidden bg-secondary">
                  {active ? (
                    /* The selected document mirrors the PDF area — a live, scaled
                       render of the very page being reviewed. */
                    <div className="pointer-events-none origin-top-left" style={{ width: 660, transform: "scale(0.23)" }} aria-hidden>
                      <InvoicePage selected={null} onSelect={() => {}} />
                    </div>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={d.src} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                  )}
                </div>
                {/* Filename lives inside the card, over a soft light scrim —
                    reclaims the caption row so more documents fit, and stays in
                    keeping with the light workspace. */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 px-2 pb-1.5 pt-6"
                  style={{ background: "linear-gradient(to top, rgba(255,255,255,0.96) 30%, rgba(255,255,255,0) 100%)" }}
                >
                  <span className="block truncate text-[10px] font-semibold text-primary">{d.name}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

/* ------------------------------ the document ---------------------------- */

/** The purple brand mark on the invoice (a simple four-tile glyph). */
function InvoiceLogo() {
  return (
    <div className="grid size-12 grid-cols-2 gap-1 rounded-lg bg-utility-purple-100 p-2">
      <span className="rounded-sm bg-utility-purple-500" />
      <span className="rounded-sm bg-utility-purple-300" />
      <span className="rounded-sm bg-utility-purple-300" />
      <span className="rounded-sm bg-utility-purple-500" />
    </div>
  );
}

function TrashIcon() {
  return (
    <svg className="size-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2.5 4.2h11M6 4.2V2.6h4v1.6M12.3 4.2l-.5 9.2H4.2l-.5-9.2M6.4 7v3.8M9.6 7v3.8" />
    </svg>
  );
}

/* The extraction bounding box: draws out from the top-left like a drag-
   selection, corner handles popping in from the anchor toward the endpoint.
   Shared by field highlights and the source line-item table. */
function DrawnBox({ inset = "-inset-[3px]" }: { inset?: string }) {
  const reduce = useReducedMotion();
  return (
    <>
      <motion.span
        aria-hidden
        initial={reduce ? false : { scaleX: 0, scaleY: 0, opacity: 0 }}
        animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.34, ease: [0.16, 1, 0.3, 1], opacity: { duration: 0.12 } }}
        className={cx("pointer-events-none absolute z-30 rounded-[3px] border-2", inset)}
        style={{ borderColor: "var(--color-utility-orange-500)", background: "color-mix(in srgb, var(--color-utility-orange-500) 9%, transparent)", transformOrigin: "top left" }}
      />
      {[
        { pos: "-top-1.5 -left-1.5", delay: 0.04 },
        { pos: "-top-1.5 -right-1.5", delay: 0.18 },
        { pos: "-bottom-1.5 -left-1.5", delay: 0.24 },
        { pos: "-bottom-1.5 -right-1.5", delay: 0.32 },
      ].map(({ pos, delay }) => (
        <motion.span
          key={pos}
          aria-hidden
          initial={reduce ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 600, damping: 20, delay }}
          className={cx("pointer-events-none absolute z-30 size-1.5 rounded-full ring-2 ring-white", pos)}
          style={{ background: "var(--color-utility-orange-500)" }}
        />
      ))}
    </>
  );
}

/* The Key control — a searchable combobox rather than a flat dropdown, so it
   scales to a large or open field schema: type to filter, grouped by category,
   and create a new field inline when the right key doesn't exist yet. */
function KeyCombobox({ value }: { value: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState(value);

  const q = query.trim().toLowerCase();
  const groups = FIELD_GROUPS.map((g) => ({
    title: g.title,
    color: g.bar,
    items: extractedFields
      .filter((f) => f.group === g.id)
      .map((f) => ({ key: f.label, label: FIELD_LABEL[f.label] ?? f.label }))
      .filter((it) => it.label.toLowerCase().includes(q)),
  })).filter((g) => g.items.length > 0);
  const knownLabels = extractedFields.map((f) => (FIELD_LABEL[f.label] ?? f.label).toLowerCase());
  const showCreate = q.length > 0 && !knownLabels.includes(q);
  const selectedLabel = FIELD_LABEL[selectedKey] ?? selectedKey;

  return (
    <div className="relative mt-1.5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-left text-[13px] text-primary shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25"
      >
        <span className="truncate">{selectedLabel}</span>
        <span className={cx("shrink-0 transition-transform", open && "rotate-180")}>
          <ChevDown />
        </span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-[60] mt-1.5 w-full overflow-hidden rounded-lg border border-secondary bg-primary shadow-lg">
          <div className="flex items-center gap-2 border-b border-secondary px-2.5 py-2">
            <SearchLg className="size-3.5 shrink-0 text-quaternary" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search or add a field"
              spellCheck={false}
              className="w-full bg-transparent text-[12.5px] text-primary outline-none placeholder:text-quaternary"
            />
          </div>
          <div className="scrollbar-subtle max-h-[172px] overflow-y-auto py-1">
            {groups.map((g) => (
              <div key={g.title} className="pb-0.5">
                <div className="flex items-center gap-1.5 px-3 pb-0.5 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-quaternary">
                  <span aria-hidden className="size-1.5 rounded-full" style={{ background: g.color }} />
                  {g.title}
                </div>
                {g.items.map((it) => (
                  <button
                    key={it.key}
                    type="button"
                    onClick={() => {
                      setSelectedKey(it.key);
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-[13px] text-primary transition-colors hover:bg-secondary"
                  >
                    <span className="truncate">{it.label}</span>
                    {selectedKey === it.key && <Check className="size-4 shrink-0" strokeWidth={2.5} style={{ color: "var(--color-brand-solid)" }} />}
                  </button>
                ))}
              </div>
            ))}
            {groups.length === 0 && !showCreate && <div className="px-3 py-4 text-center text-[12px] text-tertiary">No fields found</div>}
            {showCreate && (
              <button
                type="button"
                onClick={() => {
                  setSelectedKey(query);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 border-t border-secondary px-3 py-2 text-left text-[13px] font-medium transition-colors hover:bg-secondary"
                style={{ color: "var(--color-brand-solid)" }}
              >
                <Plus className="size-4 shrink-0" />
                <span className="truncate">Create &ldquo;{query}&rdquo;</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* The inline editor that opens on a highlighted document field — correct the
   value or re-key it when the AI got it wrong. */
function FieldPopover({
  fieldId,
  value,
  align,
  up,
  onClose,
}: {
  fieldId: string;
  value: string;
  align: "left" | "right";
  up: boolean;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const field = extractedFields.find((f) => f.label === fieldId);
  const groupColor = FIELD_GROUPS.find((g) => g.id === field?.group)?.bar;
  const inputCls =
    "w-full rounded-lg border border-secondary bg-primary px-3 py-2 text-[13px] leading-snug text-primary shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25";
  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      initial={reduce ? false : { opacity: 0, scale: 0.96, y: up ? 6 : -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={cx(
        "absolute z-50 w-[266px] cursor-default rounded-xl border border-secondary bg-primary text-left",
        align === "right" ? "right-0" : "left-0",
        up ? "bottom-full mb-2.5" : "top-full mt-2.5"
      )}
      style={{ transformOrigin: up ? "bottom center" : "top center", boxShadow: "0 20px 24px -4px rgba(16,24,40,0.08), 0 8px 8px -4px rgba(16,24,40,0.03)" }}
    >
      <div className="p-4">
        {/* Header: the field, colour-coded, with a close affordance. */}
        <div className="flex items-center gap-2">
          {groupColor && <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: groupColor }} />}
          <span className="truncate text-[13.5px] font-semibold leading-none text-primary">{FIELD_LABEL[fieldId] ?? fieldId}</span>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mr-1 ml-auto grid size-7 shrink-0 place-items-center rounded-lg text-quaternary transition-colors hover:bg-secondary hover:text-secondary"
          >
            <XClose className="size-4" />
          </button>
        </div>

        {/* Value — a textarea that sizes to its content and grows as you type
            (field-sizing), so short values stay compact and long ones (addresses)
            read in full, capped with a scroll for very long text. */}
        <label className="mt-4 block text-[12px] font-medium text-secondary">Value</label>
        <textarea
          rows={1}
          defaultValue={value}
          spellCheck={false}
          className={cx("mt-1.5 max-h-40 resize-none overflow-y-auto field-sizing-content", inputCls)}
        />

        {/* Key — searchable, groupable, extensible. */}
        <label className="mt-3.5 block text-[12px] font-medium text-secondary">Key</label>
        <KeyCombobox value={fieldId} />
      </div>

      {/* Actions — separated from the form by a full-bleed divider. */}
      <div className="flex items-center gap-2 rounded-b-[11px] border-t border-secondary bg-secondary/40 px-4 py-3">
        <button
          type="button"
          aria-label="Delete field"
          onClick={onClose}
          className="grid size-9 shrink-0 place-items-center rounded-lg border border-secondary bg-primary shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-colors hover:bg-secondary"
          style={{ color: "var(--color-utility-error-500, #f04438)" }}
        >
          <TrashIcon />
        </button>
        <div className="ml-auto flex items-center gap-2">
          <Button color="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" size="sm" onClick={onClose}>
            Save
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/* Wraps a value printed on the document. Selecting its field (in the panel or
   by clicking here) draws an orange bounding box with corner handles and opens
   the inline editor — the click-to-locate / correct interaction. */
function Hl({
  fieldId,
  value,
  selected,
  onSelect,
  block = false,
  align = "left",
  up = false,
  className,
  children,
}: {
  fieldId: string;
  value: string;
  selected: string | null;
  onSelect: (id: string | null) => void;
  block?: boolean;
  align?: "left" | "right";
  up?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const isSel = selected === fieldId;
  const Tag = (block ? "div" : "span") as "div";
  return (
    <Tag
      onClick={(e) => {
        e.stopPropagation();
        onSelect(isSel ? null : fieldId);
      }}
      className={cx(
        "relative cursor-pointer rounded-[3px] transition-colors",
        block ? "block" : "inline",
        !isSel && "hover:bg-secondary",
        className
      )}
    >
      {children}
      {isSel && (
        <>
          <DrawnBox />
          <FieldPopover fieldId={fieldId} value={value} align={align} up={up} onClose={() => onSelect(null)} />
        </>
      )}
    </Tag>
  );
}

function InvoicePage({
  selected,
  onSelect,
  tableBoxed = false,
}: {
  selected: string | null;
  onSelect: (id: string | null) => void;
  /** Draw the extraction box around the source line-item table (the table
      counterpart of a field's click-to-locate highlight). */
  tableBoxed?: boolean;
}) {
  const hp = { selected, onSelect } as const;
  return (
    <div className="mx-auto my-8 w-[660px] shrink-0 rounded-md bg-primary p-10 shadow-sm">
      {/* Masthead */}
      <div className="flex items-start justify-between">
        <InvoiceLogo />
        <div className="text-right">
          <div className="text-[26px] font-semibold tracking-[0.14em] text-primary">INVOICE</div>
          <div className="mt-1 text-xs text-tertiary">
            Invoice No#{" "}
            <Hl fieldId="Invoice No" value={invoice.number} align="right" {...hp}>
              {invoice.number}
            </Hl>
          </div>
        </div>
      </div>

      {/* Parties + meta */}
      <div className="mt-8 flex gap-6">
        <div className="flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-tertiary">
            Billed by
          </div>
          <Hl fieldId="Merchant_Name" value={invoice.merchant.name} block className="mt-1.5 text-sm font-semibold text-primary" {...hp}>
            {invoice.merchant.name}
          </Hl>
          <Hl fieldId="Merchant_Address" value={invoice.merchant.address} block className="mt-1 text-xs leading-relaxed text-secondary" {...hp}>
            {invoice.merchant.address}
          </Hl>
          <Hl fieldId="Merchant_Email" value={invoice.merchant.email} block className="mt-1 text-xs text-secondary" {...hp}>
            {invoice.merchant.email}
          </Hl>
          <Hl fieldId="Merchant_Phone" value={invoice.merchant.phone} block className="text-xs text-secondary" {...hp}>
            {invoice.merchant.phone}
          </Hl>
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-tertiary">
            Billed to
          </div>
          <Hl fieldId="Receiver_Name" value={invoice.receiver.name} block className="mt-1.5 text-sm font-semibold text-primary" {...hp}>
            {invoice.receiver.name}
          </Hl>
          <Hl fieldId="Receiver_Address" value={invoice.receiver.address} block className="mt-1 text-xs leading-relaxed text-secondary" {...hp}>
            {invoice.receiver.address}
          </Hl>
          <Hl fieldId="Receiver_Email" value={invoice.receiver.email} block className="mt-1 text-xs text-secondary" {...hp}>
            {invoice.receiver.email}
          </Hl>
          <Hl fieldId="Receiver_Phone" value={invoice.receiver.phone} block className="text-xs text-secondary" {...hp}>
            {invoice.receiver.phone}
          </Hl>
        </div>
        <div className="w-36 shrink-0 text-right">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-tertiary">
            Invoice date
          </div>
          <div className="mt-1 text-sm font-medium text-primary">
            <Hl fieldId="Invoice Date" value={invoice.issued} align="right" {...hp}>{invoice.issued}</Hl>
          </div>
          <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-tertiary">
            Due date
          </div>
          <div className="mt-1 text-sm font-medium text-primary">
            <Hl fieldId="Due Date" value={invoice.due} align="right" {...hp}>{invoice.due}</Hl>
          </div>
        </div>
      </div>

      {/* Source line-item table (as printed on the document). When the extracted
          table is open, the detected rows are marked with orange horizontal
          rules right on the source — the table counterpart of a field box. */}
      <div
        data-src-table
        className="mt-8 scroll-mt-6"
        style={tableBoxed ? { borderTop: "1.5px solid var(--color-utility-orange-500)", borderBottom: "1.5px solid var(--color-utility-orange-500)" } : undefined}
      >
      <table className="w-full border-collapse text-left">
        <thead>
          <tr
            className="border-b-2 border-secondary transition-colors duration-300"
            style={tableBoxed ? { borderColor: "var(--color-utility-orange-500)" } : undefined}
          >
            {["Item", "Description", "Qty", "Rate", "Amount"].map((h, i) => (
              <th
                key={h}
                className={cx(
                  "pb-2 text-xs font-semibold text-tertiary",
                  i >= 2 && "text-right"
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lineItems.map((li) => (
            <tr
              key={li.code}
              className="border-b border-secondary transition-colors duration-300 last:border-0"
              style={tableBoxed ? { borderColor: "var(--color-utility-orange-500)" } : undefined}
            >
              <td className="py-2 pr-3 text-xs font-medium text-primary">{li.name}</td>
              <td className="py-2 pr-3 text-xs text-secondary">{li.description}</td>
              <td className="py-2 text-right text-xs text-secondary" style={{ fontVariantNumeric: "tabular-nums" }}>
                {li.qty}
              </td>
              <td className="py-2 text-right text-xs text-secondary" style={{ fontVariantNumeric: "tabular-nums" }}>
                {li.unitPrice}
              </td>
              <td className="py-2 text-right text-xs font-medium text-primary" style={{ fontVariantNumeric: "tabular-nums" }}>
                {li.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Totals */}
      <div className="mt-5 flex justify-end">
        <div className="w-56">
          <div className="flex justify-between py-1 text-xs text-secondary">
            <span>Subtotal</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              <Hl fieldId="Sub_Total" value={invoice.subtotal} align="right" up {...hp}>{invoice.subtotal}</Hl>
            </span>
          </div>
          <div className="flex justify-between py-1 text-xs text-secondary">
            <span>Tax</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              <Hl fieldId="Tax_Amount" value={invoice.tax} align="right" up {...hp}>{invoice.tax}</Hl>
            </span>
          </div>
          <div className="mt-1.5 flex justify-between rounded-md bg-brand-solid px-3 py-2 text-sm font-semibold text-white">
            <span>Total</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              <Hl fieldId="Grand_Total" value={invoice.total} align="right" up {...hp}>{invoice.total}</Hl>
            </span>
          </div>
        </div>
      </div>

      {/* Terms + notes */}
      <div className="mt-8 space-y-3">
        <div className="rounded-lg bg-secondary p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-tertiary">
            Terms and conditions
          </div>
          <p className="mt-1 text-xs leading-relaxed text-tertiary">
            Payment is due within 15 days of the invoice date. Late payments accrue 1.5% monthly
            interest. All services subject to the master services agreement.
          </p>
        </div>
        <div className="rounded-lg bg-secondary p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-tertiary">
            Additional notes
          </div>
          <p className="mt-1 text-xs leading-relaxed text-tertiary">
            For any enquiry, reach out via email at {invoice.merchant.email} or call us at{" "}
            {invoice.merchant.phone}.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- the fields panel --------------------------- */

/* A verified extracted value — an outlined success check, Untitled UI green. */
function StatusOK() {
  return (
    <svg className="size-[18px] shrink-0" viewBox="0 0 20 20" fill="none" aria-label="Verified" style={{ color: "var(--color-utility-green-500)" }}>
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.4" />
      <path d="M6.4 10.3l2.3 2.2 4.9-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* A value that needs review — an outlined error cross, Untitled UI red. */
function StatusErr() {
  return (
    <svg className="size-[18px] shrink-0" viewBox="0 0 20 20" fill="none" aria-label="Needs review" style={{ color: "var(--color-utility-error-500, #f04438)" }}>
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.4" />
      <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/* A section-collapse chevron. */
function ChevDown() {
  return (
    <svg className="size-4 text-quaternary" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KebabIcon() {
  return (
    <svg className="size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <circle cx="8" cy="3.4" r="1.3" />
      <circle cx="8" cy="8" r="1.3" />
      <circle cx="8" cy="12.6" r="1.3" />
    </svg>
  );
}

/* A small grid glyph that gives the Line Items row a table identity. */
function TableGlyph() {
  return (
    <svg className="size-[18px]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3.5" width="14" height="13" rx="2" />
      <path d="M3 8h14M8 8v8.5" />
    </svg>
  );
}

/* "View the extracted table" affordance on a Line Items row. */
function EyeIcon() {
  return (
    <svg className="size-[18px]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 10c1.6-3.3 4.4-5.3 8-5.3s6.4 2 8 5.3c-1.6 3.3-4.4 5.3-8 5.3s-6.4-2-8-5.3Z" />
      <circle cx="10" cy="10" r="2.4" />
    </svg>
  );
}

/* A low-confidence value that wants a human glance — an amber alert. Draws the
   eye to the one field worth checking so "Approve" means something. */
function StatusWarn() {
  return (
    <svg className="size-[18px] shrink-0" viewBox="0 0 20 20" fill="none" aria-label="Low confidence" style={{ color: "var(--color-utility-warning-500, #f79009)" }}>
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.4" />
      <path d="M10 6v4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="10" cy="13.7" r="0.95" fill="currentColor" />
    </svg>
  );
}

/* The document has a single line-item table, so the Line Items section lists
   exactly one — matching what's on the page. */
const LINE_TABLES: { name: string; error?: boolean }[] = [{ name: "Table 1" }];

/* Human-readable field names. The raw extraction emits keys like "Merchant_Name";
   the redesigned panel shows what a person would actually write — the point of
   the whole "fields anyone can read" feature. */
const FIELD_LABEL: Record<string, string> = {
  "Invoice No": "Invoice number",
  "Invoice Date": "Invoice date",
  "Due Date": "Due date",
  Merchant_Name: "Merchant name",
  Merchant_Address: "Merchant address",
  Merchant_Email: "Merchant email",
  Merchant_Phone: "Merchant phone",
  Receiver_Name: "Receiver name",
  Receiver_Address: "Receiver address",
  Receiver_Email: "Receiver email",
  Receiver_Phone: "Receiver phone",
  Sub_Total: "Subtotal",
  Tax_Amount: "Tax",
  Grand_Total: "Grand total",
};

/* On a clean, digital invoice the extractor is confident on every field, so
   nothing is flagged. (Populate this for scanned or ambiguous documents.) */
const LOW_CONFIDENCE = new Set<string>();

function FieldsPanel({
  variant,
  /* "left" for the problem beats (the panel is the subject), "right" for the
     product's real layout. */
  side = "left",
  highlighted = false,
  selected = null,
  onSelect,
  tableOpen = false,
  onToggleTable,
}: {
  variant: Variant;
  side?: "left" | "right";
  highlighted?: boolean;
  /** The field selected for the click-to-locate interaction. */
  selected?: string | null;
  onSelect?: (id: string | null) => void;
  /** Whether the extracted-table sheet is open (Line Items rows toggle it). */
  tableOpen?: boolean;
  onToggleTable?: () => void;
}) {
  /* When the extracted table opens (Feature 3), glide the fields list down to
     the Line Items section so the selected Table 1 is in view, mirroring the
     document lifting to its source table. */
  const listRef = useRef<HTMLDivElement>(null);
  const tableRowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (variant !== "after") return;
    const list = listRef.current;
    if (!list) return;
    if (tableOpen && tableRowRef.current) {
      list.scrollTo({ top: Math.max(0, tableRowRef.current.offsetTop - 56), behavior: "smooth" });
    } else if (!tableOpen) {
      list.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [tableOpen, variant]);
  return (
    <aside
      className={cx(
        "relative z-20 flex h-full shrink-0 flex-col overflow-hidden rounded-2xl border border-secondary bg-primary shadow-xs",
        variant === "after" ? "w-[400px]" : "w-[360px]"
      )}
    >
      {highlighted && <AccentFrame inset="2px" radius={14} />}
      {variant === "before" ? (
        /* BEFORE — the raw old "data area": plain grouped rows, cramped, full
           of unmapped N/A, no colour, no cues. Deliberately unpolished. */
        <>
          <div className="border-b border-secondary px-4 py-2.5">
            <h2 className="text-[13px] font-semibold text-secondary">Extracted data</h2>
          </div>
          <div className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto">
            {beforeFieldGroups.map((g) => (
              <div key={g.title}>
                <div className="border-y border-secondary bg-secondary px-4 py-1.5 text-[11px] font-semibold text-tertiary">
                  {g.title}
                </div>
                <div className="px-3 py-1">
                  {g.rows.map(([label, value]) => (
                    <label key={label} className="block px-1 py-1">
                      <span className="mb-1 block text-[10px] font-medium leading-tight text-tertiary">
                        {label}
                      </span>
                      <input
                        type="text"
                        defaultValue={value === "N/A" ? "" : value}
                        placeholder={value === "N/A" ? "N/A" : undefined}
                        spellCheck={false}
                        className="w-full rounded-[5px] border border-secondary bg-primary px-2 py-1 text-[11px] leading-tight text-secondary outline-none placeholder:text-quaternary focus:border-brand focus:ring-2 focus:ring-brand/25"
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
        {/* AFTER — the redesigned Fields panel, Untitled UI: a collapsible Fields
            section of colour-coded label/value rows with verified cues, a Line
            Items section (one table still needs review), and an Approve action. */}
        <div className="flex items-center justify-between border-b border-secondary px-5 py-3.5">
          <h2 className="text-sm font-semibold text-primary">Fields</h2>
          <span className="text-xs text-tertiary">{extractedFields.length} extracted</span>
        </div>
        <div ref={listRef} className="scrollbar-subtle relative min-h-0 flex-1 overflow-y-auto">
          {/* Fields sit in labelled, colour-coded groups so the colour means
              something (category) and related values read together. */}
          {FIELD_GROUPS.map((g) => {
            const rows = extractedFields.filter((f) => f.group === g.id);
            return (
              <section key={g.id} className="border-t border-secondary first:border-t-0">
                <div className="px-2.5 pb-2">
                  <div className="px-2.5 pb-0.5 pt-3.5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-tertiary">{g.title}</span>
                  </div>
                  {rows.map((f) => {
                    const isTotal = f.label === "Grand_Total";
                    const warn = LOW_CONFIDENCE.has(f.label);
                    return (
                      <div
                        key={f.label}
                        onClick={() => onSelect?.(selected === f.label ? null : f.label)}
                        className={cx(
                          "flex cursor-pointer items-start gap-3 rounded-lg px-2.5 py-2.5 transition-colors",
                          isTotal && "items-center",
                          selected === f.label ? "bg-secondary" : "hover:bg-secondary"
                        )}
                      >
                        <span
                          aria-hidden
                          className={cx("h-4 w-1 shrink-0 rounded-full", isTotal ? "self-center" : "mt-0.5")}
                          style={{ background: g.bar }}
                        />
                        <span
                          className={cx(
                            "w-[108px] shrink-0 leading-snug text-tertiary",
                            isTotal ? "text-[13px] font-medium text-secondary" : "pt-px text-[13px]"
                          )}
                        >
                          {FIELD_LABEL[f.label] ?? f.label}
                        </span>
                        <span
                          className={cx("min-w-0 flex-1 leading-snug text-primary", isTotal ? "text-[16px] font-bold" : "text-[13px] font-medium")}
                          style={isTotal ? { fontVariantNumeric: "tabular-nums" } : undefined}
                        >
                          {f.value}
                        </span>
                        <span className="mt-px shrink-0">{warn ? <StatusWarn /> : <StatusOK />}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* Line Items — extracted tables, one still awaiting review. */}
          <div className="flex items-center border-y border-secondary bg-secondary px-5 py-2.5">
            <span className="text-sm font-semibold text-primary">Line Items</span>
          </div>
          {/* Clicking a table row opens the extracted table and boxes its
              source on the document — the same locate logic as fields. */}
          {LINE_TABLES.map((t) => (
            <div
              key={t.name}
              ref={tableRowRef}
              onClick={onToggleTable}
              className={cx(
                "relative flex cursor-pointer items-center gap-3 border-b border-secondary py-3 pl-5 pr-3 transition-colors",
                tableOpen ? "" : "hover:bg-secondary"
              )}
              style={tableOpen ? { background: "color-mix(in srgb, var(--color-brand-solid) 10%, transparent)" } : undefined}
            >
              {/* Selected accent bar — the same colour-bar language as the fields. */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-[3px] transition-opacity"
                style={{ background: "var(--color-brand-solid)", opacity: tableOpen ? 1 : 0 }}
              />
              <span
                className={cx(
                  "grid size-8 shrink-0 place-items-center rounded-lg border transition-colors",
                  tableOpen ? "border-transparent bg-brand-solid text-white" : "border-secondary bg-primary text-tertiary"
                )}
              >
                <TableGlyph />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-primary">{t.name}</span>
                  {t.error ? <StatusErr /> : <StatusOK />}
                </div>
                <span className="text-[12px] text-tertiary">{lineItems.length} rows extracted</span>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  aria-label={tableOpen ? "Hide table" : "View table"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTable?.();
                  }}
                  className={cx(
                    "grid size-8 place-items-center rounded-lg transition-colors",
                    tableOpen ? "text-brand" : "text-tertiary hover:bg-tertiary hover:text-secondary"
                  )}
                  style={tableOpen ? { background: "color-mix(in srgb, var(--color-brand-solid) 10%, transparent)" } : undefined}
                >
                  <EyeIcon />
                </button>
                <button
                  type="button"
                  aria-label="More"
                  onClick={(e) => e.stopPropagation()}
                  className="grid size-8 place-items-center rounded-lg text-quaternary transition-colors hover:bg-tertiary"
                >
                  <KebabIcon />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* A confidence footer, not a second commit action — the document-level
            actions (Complete / Reject) live in the toolbar and own finalize. */}
        <div className="flex shrink-0 items-center gap-2 border-t border-secondary px-5 py-3">
          <StatusOK />
          <span className="text-[13px] font-medium text-secondary">All {extractedFields.length} fields verified</span>
        </div>
        </>
      )}
    </aside>
  );
}

/* --------------------------- the extracted table ------------------------- */

/* Each value in the redesigned table lives in its own editable grid cell. The
   input fills the whole cell (the surrounding gridlines draw the cell), so it
   reads as a spreadsheet you can correct in place: hover tints the cell, and
   focus lifts it to white with a brand ring. Any value the AI got wrong is
   fixed right here, without leaving the table. */
function EditableCell({
  value,
  align = "left",
  tone = "secondary",
}: {
  value: string;
  align?: "left" | "right";
  tone?: "strong" | "primary" | "secondary";
}) {
  return (
    <input
      type="text"
      defaultValue={value}
      spellCheck={false}
      style={align === "right" ? { fontVariantNumeric: "tabular-nums" } : undefined}
      className={cx(
        "block w-full min-w-0 bg-transparent px-4 py-2.5 text-[13px] outline-none transition-colors focus:bg-primary focus:ring-2 focus:ring-inset focus:ring-brand",
        align === "right" ? "text-right" : "text-left",
        tone === "strong" ? "font-medium text-primary" : tone === "primary" ? "text-primary" : "text-secondary"
      )}
    />
  );
}

/* The line-item column types a header can be mapped to. */
const COLUMN_OPTIONS = ["Item", "Item code", "Description", "Category", "Qty", "Unit price", "Tax", "Amount"];

/* An extracted-table column header — a dropdown to re-map the column to the
   correct field when the extractor guessed the header wrong. */
function HeaderSelect({ value, align, demoOpen = false }: { value: string; align: boolean; demoOpen?: boolean }) {
  const [open, setOpen] = useState(demoOpen);
  const [label, setLabel] = useState(value);
  /* Follow the beat: open when this column is the one being demonstrated,
     close again when the beat moves on. The reviewer can still click. */
  useEffect(() => {
    setOpen(demoOpen);
  }, [demoOpen]);
  return (
    <div className={cx("relative flex", align ? "justify-end" : "justify-start")}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cx(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] transition-colors",
          open ? "bg-primary text-secondary shadow-[0_1px_2px_rgba(16,24,40,0.06)]" : "text-tertiary hover:bg-primary hover:text-secondary"
        )}
      >
        {label}
        <svg className={cx("size-3 shrink-0 transition-transform", open ? "rotate-180 text-secondary" : "text-quaternary")} viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          className={cx(
            "absolute top-full z-[60] mt-1.5 w-[184px] overflow-hidden rounded-xl border border-secondary bg-primary p-1 shadow-lg",
            align ? "right-0" : "left-0"
          )}
        >
          <div className="mb-0.5 px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-quaternary">
            Map to field
          </div>
          <div className="scrollbar-subtle max-h-[188px] overflow-y-auto">
            {COLUMN_OPTIONS.map((opt) => {
              const active = label === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setLabel(opt);
                    setOpen(false);
                  }}
                  className={cx(
                    "flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors",
                    active ? "bg-secondary font-medium text-primary" : "font-normal text-secondary hover:bg-secondary hover:text-primary"
                  )}
                >
                  <span>{opt}</span>
                  {active && <Check className="size-4 shrink-0" strokeWidth={2.5} style={{ color: "var(--color-brand-solid)" }} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ExtractedTableSheet({
  variant,
  highlighted = false,
  onClose,
  demoHeader,
}: {
  variant: Variant;
  highlighted?: boolean;
  onClose?: () => void;
  /** Auto-open this column's remap dropdown so the affordance demonstrates
      itself on the remap beat. */
  demoHeader?: string;
}) {
  const reduce = useReducedMotion();
  const headers = variant === "before" ? TABLE_HEADERS_BEFORE : TABLE_HEADERS_AFTER;
  const numericFrom = 2; // Qty, Unit price, Amount align right
  return (
    <motion.div
      initial={reduce ? false : { y: 32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 32, mass: 0.9 }}
      className="absolute inset-x-0 bottom-0 rounded-t-2xl border border-b-0 border-secondary bg-primary shadow-[0_-12px_16px_-4px_rgba(0,0,0,0.08),0_-4px_6px_-2px_rgba(0,0,0,0.03)]"
    >
      {/* Docked sheet: rounded top (it sits on the section's straight bottom
          edge, away from the card's corners), so the frame follows suit. */}
      {highlighted && <AccentFrame inset="2px" radius="16px 16px 4px 4px" />}
      <div className="flex items-center gap-3 border-b border-secondary px-4 py-3">
        {variant === "after" && (
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-solid text-white">
            <TableGlyph />
          </span>
        )}
        <span className="text-sm font-semibold text-primary">{variant === "after" ? "Table 1" : "Extracted table"}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <Button color="secondary" size="xs" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" size="xs" onClick={onClose}>
            Save
          </Button>
        </div>
      </div>

      {variant === "before" ? (
        <div className="px-5 pb-4 pt-3">
          {/* BEFORE — gridlocked cells, generic headers, no rhythm. */}
          <table className="w-full border-collapse border border-secondary text-left">
            <thead>
              <tr>
                {headers.map((h) => (
                  <th
                    key={h}
                    className="border border-secondary px-2 py-1.5 text-xs font-medium text-secondary"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lineItems.map((li) => (
                <tr key={li.code}>
                  {[li.name, li.description, String(li.qty), li.unitPrice, li.amount].map((cell, ci) => (
                    <td
                      key={ci}
                      className="border border-secondary px-2 py-1.5 text-xs text-secondary"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* AFTER — a modern, airy Untitled UI table: a muted gray header row,
           horizontal row dividers only (no gridlock, no zebra), row hover, and
           cells that lift to white with a brand ring when you edit them. */
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col style={{ width: "24%" }} />
            <col style={{ width: "34%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-secondary bg-tertiary">
              {headers.map((h, i) => (
                <th key={h} className="px-3 py-2.5 align-middle">
                  <HeaderSelect value={h} align={i >= numericFrom} demoOpen={h === demoHeader} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lineItems.map((li) => (
              <tr
                key={li.code}
                className="transition-colors even:bg-secondary hover:bg-tertiary"
              >
                <td className="p-0"><EditableCell value={li.name} tone="primary" /></td>
                <td className="p-0"><EditableCell value={li.description} /></td>
                <td className="p-0"><EditableCell value={String(li.qty)} align="right" /></td>
                <td className="p-0"><EditableCell value={li.unitPrice} align="right" /></td>
                <td className="p-0"><EditableCell value={li.amount} align="right" tone="primary" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}

/* -------------------------------- screen -------------------------------- */

export default function StapleTablesScreen({
  /* Which era of the fields panel to show. */
  fieldsVariant = "after",
  /* Which side the fields panel docks to. The problem beats put it on the
     left, where it is the subject; the product's real layout is on the right. */
  fieldsSide = "left",
  /* The top bar: "before" crams every action + chrome into one row; "after"
     keeps only global chrome up top and floats the review actions. */
  toolbarVariant = "after",
  /* The extracted-table sheet: hidden by default; "before"/"after" docks it
     over the document bottom. */
  tableVariant = null,
  /* Which region a beat spotlights with the accent frame. */
  highlight = null,
  /* A field to auto-select, so the click-to-locate beat demonstrates itself. */
  demoField,
  /* A column header whose remap dropdown auto-opens, so the remap beat
     demonstrates itself. */
  demoHeader,
  /* Show the document thumbnail rail on the left, for the quick-switch beat. */
  docRail = false,
}: {
  fieldsVariant?: Variant;
  fieldsSide?: "left" | "right";
  toolbarVariant?: Variant;
  tableVariant?: Variant | null;
  highlight?: Highlight;
  demoField?: string;
  demoHeader?: string;
  docRail?: boolean;
} = {}) {
  /* The field currently selected for the click-to-locate / correct interaction. */
  const [selected, setSelected] = useState<string | null>(demoField ?? null);
  /* When the beat changes which field to demo, follow it (the user can still
     click any field to override). */
  useEffect(() => {
    setSelected(demoField ?? null);
  }, [demoField]);
  /* The extracted-table sheet: open by default on the table beats, and toggled
     by clicking a Line Items row. Opening it boxes the source table on the PDF. */
  const [tableOpen, setTableOpen] = useState(tableVariant !== null);
  useEffect(() => {
    setTableOpen(tableVariant !== null);
  }, [tableVariant]);
  const toggleTable = () => {
    setTableOpen((o) => !o);
    setSelected(null);
  };
  /* When the extracted-table sheet opens, glide the document up so its own
     line-item table clears the sheet and stays visible for side-by-side
     reconciling. Closing it returns the document to the top. */
  const docScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = docScrollRef.current;
    if (!c) return;
    if (tableOpen) {
      const t = c.querySelector<HTMLElement>("[data-src-table]");
      if (t) c.scrollTo({ top: Math.max(0, t.offsetTop - 24), behavior: "smooth" });
    } else {
      c.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [tableOpen]);
  return (
    <div
      className={cx("staple-theme", inter.variable)}
      style={{
        position: "relative",
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        background: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Left navigation rail — the same product chrome as Staple Chat. */}
      <ProductSidebar active="Extract" />

      <main className="flex h-full min-w-0 flex-1 flex-col bg-primary">
        {toolbarVariant === "before" ? (
          <DocToolbarCluttered highlighted={highlight === "toolbar"} />
        ) : (
          /* The redesigned top bar is just global chrome now, so the beat's
             frame lives on the document toolbar below, not up here. */
          <DocToolbar />
        )}

        {/* The workspace canvas: a white backdrop where each region — queue,
            document, fields — reads as its own card via a hairline border, with
            only the grey PDF surface set apart. */}
        <div className="flex min-h-0 flex-1 gap-3 bg-primary p-3">
          {/* The batch queue, so the next document is one click away. */}
          {docRail && <DocRail highlighted={highlight === "rail"} />}
          {fieldsSide === "left" && (
            <FieldsPanel variant={fieldsVariant} side="left" highlighted={highlight === "fields"} selected={selected} onSelect={setSelected} tableOpen={tableOpen} onToggleTable={toggleTable} />
          )}
          {/* Document viewer — the one gray surface; the source PDF sits here,
              set apart from the white app chrome and the extracted data. */}
          <section className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-secondary bg-tertiary shadow-xs">
            <div ref={docScrollRef} className="scrollbar-subtle relative h-full overflow-y-auto" onClick={() => setSelected(null)}>
              <InvoicePage selected={selected} onSelect={setSelected} tableBoxed={tableVariant === "after" && tableOpen} />
              {/* Room to lift the document above the open sheet. */}
              {tableVariant && tableOpen && <div className="h-[460px] shrink-0" aria-hidden />}
            </div>
            {tableVariant && tableOpen ? (
              <ExtractedTableSheet variant={tableVariant} highlighted={highlight === "table"} onClose={() => setTableOpen(false)} demoHeader={demoHeader} />
            ) : (
              toolbarVariant === "after" && <ReviewActionBar highlighted={highlight === "toolbar"} />

            )}
          </section>

          {fieldsSide === "right" && (
            <FieldsPanel variant={fieldsVariant} side="right" highlighted={highlight === "fields"} selected={selected} onSelect={setSelected} tableOpen={tableOpen} onToggleTable={toggleTable} />
          )}
        </div>
      </main>
    </div>
  );
}

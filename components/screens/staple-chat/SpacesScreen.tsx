"use client";

/**
 * SpacesScreen — the Staple Chat HOME view: a list of the data "spaces" the
 * user has already built (each space is a dataset you can chat with). This is
 * the product's real cold start — not an empty void, but the workspace you
 * return to, with an Add action to bring in new data.
 *
 * Built entirely from the vendored Untitled UI React components (Button,
 * Input, Avatar) + @untitledui/icons + the Untitled UI design tokens, scoped
 * under `.staple-theme` exactly like StapleChatScreen. Brand color is Staple's
 * teal (the reference's purple is swapped for our own accent). The connect-
 * data modal is shared with the chat screen so the walkthrough's "Add → pick
 * sources" step reads as one product.
 *
 * NOTE: after adding any NEW Tailwind class here, regenerate the scoped CSS:
 *   cd tools/staple-ui && npm run build
 */
import "../_ui/ui.generated.css";
import { AnimatePresence } from "framer-motion";
import { Inter } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  SearchLg,
  Star01,
  SwitchVertical01,
} from "@untitledui/icons";
import { Avatar } from "../_ui/uui/avatar";
import { Button } from "../_ui/uui/button";
import { Input } from "../_ui/uui/input";
import { cx } from "../_ui/uui/utils/cx";
import { ConnectDataModal, ProductSidebar, TopBar } from "./StapleChatScreen";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

interface Space {
  name: string;
  description: string;
  owner: string;
  ownerInitials: string;
  modified: string;
  favourite?: boolean;
}

/* Owner avatars: soft-tint initials, one hue per person, driven by the
   Untitled UI utility tokens (50 background / 700 text pairs) so they track the
   theme instead of hardcoded hex. Colour makes the roster scannable without
   depending on external photo services. (Cyan has no hue in this vendored
   theme, so Omar keeps its literal palette value.) */
const OWNER_COLORS: Record<string, { bg: string; fg: string }> = {
  Anand: { bg: "var(--color-utility-indigo-50)", fg: "var(--color-utility-indigo-700)" },
  Priya: { bg: "var(--color-utility-pink-50)", fg: "var(--color-utility-pink-700)" },
  Marcus: { bg: "var(--color-utility-green-50)", fg: "var(--color-utility-green-700)" },
  "Wei Lin": { bg: "var(--color-utility-orange-50)", fg: "var(--color-utility-orange-700)" },
  Sofia: { bg: "var(--color-utility-purple-50)", fg: "var(--color-utility-purple-700)" },
  Rahul: { bg: "var(--color-utility-red-50)", fg: "var(--color-utility-red-700)" },
  Chen: { bg: "var(--color-utility-fuchsia-50)", fg: "var(--color-utility-fuchsia-700)" },
  Omar: { bg: "#ECFDFF", fg: "#0E7090" }, // cyan (no vendored token)
};

function OwnerAvatar({ name, initials }: { name: string; initials: string }) {
  const c = OWNER_COLORS[name] ?? { bg: "var(--color-bg-tertiary)", fg: "var(--color-text-quaternary)" };
  return (
    <Avatar
      size="xs"
      initials={initials}
      contrastBorder={false}
      style={{ background: c.bg, color: c.fg }}
    />
  );
}

/* The user's existing spaces. Four Fingers Invoices is the scenario the rest
   of the case study drills into; the others show a populated, shared
   workspace with a mix of owners. */
const spaces: Space[] = [
  {
    name: "Four Fingers Invoices",
    description: "Invoices of all the Four Fingers shops",
    owner: "Anand",
    ownerInitials: "AN",
    modified: "Aug 14, 2024",
    favourite: true,
  },
  {
    name: "Derma",
    description: "Neo Derma customer reviews",
    owner: "Priya",
    ownerInitials: "PR",
    modified: "Aug 12, 2024",
  },
  {
    name: "DoorDash",
    description: "Purchase invoices",
    owner: "Marcus",
    ownerInitials: "MA",
    modified: "Aug 09, 2024",
    favourite: true,
  },
  {
    name: "Grab Merchants",
    description: "Merchant payout statements",
    owner: "Wei Lin",
    ownerInitials: "WL",
    modified: "Aug 05, 2024",
  },
  {
    name: "Zus Coffee",
    description: "Daily POS exports",
    owner: "Anand",
    ownerInitials: "AN",
    modified: "Jul 28, 2024",
  },
  {
    name: "Supplier Contracts",
    description: "Vendor agreements & payment terms",
    owner: "Sofia",
    ownerInitials: "SO",
    modified: "Jul 21, 2024",
    favourite: true,
  },
  {
    name: "HR Payroll",
    description: "Monthly salary runs",
    owner: "Rahul",
    ownerInitials: "RA",
    modified: "Jul 15, 2024",
  },
  {
    name: "Meta Ads",
    description: "Campaign spend reports",
    owner: "Chen",
    ownerInitials: "CH",
    modified: "Jul 10, 2024",
  },
  {
    name: "Shopify Orders",
    description: "Online store transactions",
    owner: "Sofia",
    ownerInitials: "SO",
    modified: "Jul 03, 2024",
    favourite: true,
  },
  {
    name: "Utility Bills",
    description: "Electricity & water invoices",
    owner: "Omar",
    ownerInitials: "OM",
    modified: "Jun 27, 2024",
  },
];

const FILTERS = ["All", "Favourites"] as const;

/* Pagination model: enough pages to show the ellipsis pattern (any page one
   click away). Static mock — page 1 of 10. */
const CURRENT_PAGE = 1;
const PAGE_ITEMS: (number | "…")[] = [1, 2, 3, "…", 8, 9, 10];

export default function SpacesScreen({
  /* Walkthrough: overlay the shared Connect-data modal (the "Add" action). */
  connectModal = false,
  /* Which segmented filter reads as selected. */
  activeFilter = "All",
}: {
  connectModal?: boolean;
  activeFilter?: (typeof FILTERS)[number];
} = {}) {
  return (
    <div
      className={cx("staple-theme", inter.variable)}
      style={{
        position: "relative",
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        background: "var(--color-bg-secondary)",
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Left navigation rail — identical to the chat screen */}
      <ProductSidebar />

      <main className="flex h-full min-w-0 flex-1 flex-col bg-primary">
        {/* Top bar — the SAME component as the chat screen, so the product's
            chrome is identical across surfaces. */}
        <TopBar />

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-7">
          {/* Page title + primary action */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-display-sm font-semibold text-primary">Staple Chat</h1>
              <p className="mt-1 text-md text-tertiary">
                Ask questions about your data in natural language.
              </p>
            </div>
            <Button color="primary" size="md" iconLeading={Plus}>
              New Space
            </Button>
          </div>

        {/* Filter row — search + segmented control */}
        <div className="mt-6 flex items-center gap-4">
          <Input
            icon={SearchLg}
            placeholder="Search spaces"
            aria-label="Search spaces"
            readOnly
            wrapperClassName="flex-1"
          />
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-secondary p-1">
            {FILTERS.map((f) => (
              <span
                key={f}
                className={cx(
                  "rounded-md px-3.5 py-1 text-sm font-medium transition-colors",
                  f === activeFilter
                    ? "bg-primary text-primary shadow-xs"
                    : "text-tertiary"
                )}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Spaces table — full-bleed zebra rows for scannability. The first
            column is flush-left and the star is flush-right, so the table's
            edges line up exactly with the title and the pagination above and
            below (no rounded-pill inset breaking the left rhythm). */}
        {/* Full-bleed zebra rows: the table is pulled 12px past the content
            box on each side, and every cell has 12px padding — so the row
            text aligns with the page title while the stripe keeps breathing
            room around the first name and the trailing star. */}
        <table
          className="mt-5 border-collapse text-left"
          style={{ width: "calc(100% + 24px)", marginLeft: -12, marginRight: -12 }}
        >
          <thead>
            <tr className="border-b border-secondary">
              <th className="px-3 pb-3 text-sm font-semibold text-tertiary">Name</th>
              <th className="px-3 pb-3 text-sm font-semibold text-tertiary">Description</th>
              <th className="px-3 pb-3 text-sm font-semibold text-tertiary">Owner</th>
              <th className="px-3 pb-3 text-sm font-semibold text-tertiary">
                <span className="inline-flex items-center gap-1.5">
                  Last modified
                  <SwitchVertical01 className="size-4 text-fg-quaternary" />
                </span>
              </th>
              {/* Trailing favourite column — anchors the right edge and gives
                  the Favourites filter something to act on. */}
              <th className="w-12 px-3 pb-3" aria-label="Favourite" />
            </tr>
          </thead>
          <tbody>
            {spaces.map((s) => (
              <tr
                key={s.name}
                className="group cursor-pointer transition-colors even:bg-secondary hover:bg-tertiary"
              >
                <td className="px-3 py-3">
                  <span className="text-md font-medium text-primary">{s.name}</span>
                </td>
                <td className="px-3 py-3 text-md text-secondary">{s.description}</td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-2">
                    <OwnerAvatar name={s.owner} initials={s.ownerInitials} />
                    <span className="text-md text-secondary">{s.owner}</span>
                  </span>
                </td>
                <td className="px-3 py-3 text-md text-secondary">{s.modified}</td>
                <td className="px-3 py-3 text-right">
                  <span
                    className="inline-flex size-6 items-center justify-center rounded-md text-fg-quaternary transition-colors hover:bg-primary"
                    aria-label={s.favourite ? "Remove from favourites" : "Add to favourites"}
                  >
                    <Star01
                      className="size-4.5"
                      style={
                        s.favourite
                          ? {
                              fill: "var(--color-utility-amber-400)",
                              color: "var(--color-utility-amber-500)",
                            }
                          : undefined
                      }
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

          {/* Pagination — Untitled UI's numbered footer: Previous (left) ·
              page-number buttons with an ellipsis (center, so any page is one
              click away) · Next (right). Previous disabled on page one. */}
          <div className="mt-5 flex items-center justify-between border-t border-secondary pt-4">
            <Button color="secondary" size="sm" iconLeading={ArrowLeft} isDisabled>
              Previous
            </Button>
            <div className="flex items-center gap-0.5">
              {PAGE_ITEMS.map((p, i) =>
                p === "…" ? (
                  <span
                    key={`gap-${i}`}
                    className="flex size-10 items-center justify-center text-sm text-tertiary"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    aria-current={p === CURRENT_PAGE ? "page" : undefined}
                    className={cx(
                      "flex size-10 items-center justify-center rounded-lg text-sm transition-colors",
                      p === CURRENT_PAGE
                        ? "bg-brand-primary font-semibold text-brand-secondary"
                        : "font-medium text-tertiary hover:bg-secondary"
                    )}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
            <Button color="secondary" size="sm" iconTrailing={ArrowRight}>
              Next
            </Button>
          </div>
        </div>
      </main>

      <AnimatePresence>{connectModal && <ConnectDataModal />}</AnimatePresence>
    </div>
  );
}

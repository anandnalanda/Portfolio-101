/**
 * data.ts — the mock invoice that every Staple Tables beat renders. One
 * document, shown before and after the redesign, so the comparison is always
 * apples to apples.
 */

export const DOC_TITLE = "Sample Invoice 515e8d7c01a34";

export const invoice = {
  number: "NX-2025-INV-7834",
  issued: "Jan 25, 2025",
  due: "Feb 11, 2025",
  merchant: {
    name: "Summit Software Solutions LLC",
    address: "Suite 450, 75 Pine Street, Redwood Valley, CA 94971, USA",
    email: "info@summitsoftware.com",
    phone: "+1 415 789 5643",
  },
  receiver: {
    name: "BrightSky Analytics Inc.",
    address: "23rd Floor, Skyview Plaza, 184 Beacon Street, Blue Ridge Heights, NY 10038, USA",
    email: "billing@brightsky.com",
    phone: "+1 555 987 6543",
  },
  subtotal: "$2,442.00",
  tax: "$219.78",
  total: "$2,661.78",
};

/* ------------------------------- fields -------------------------------- */

export type FieldGroupId = "invoice" | "merchant" | "receiver" | "totals";

/* Group hues from the Untitled UI utility palette. Chosen as four well-separated
   hues (blue / magenta / orange / green) rather than three near-blues, so they
   stay distinguishable under red-green colour-vision deficiency — an Okabe-Ito-
   style set. Colour is a reinforcement anyway; the group labels carry meaning. */
export const FIELD_GROUPS: { id: FieldGroupId; title: string; bar: string; tint: string }[] = [
  { id: "invoice", title: "Invoice details", bar: "var(--color-utility-blue-500)", tint: "var(--color-utility-blue-50)" },
  { id: "merchant", title: "Merchant", bar: "var(--color-utility-pink-500)", tint: "var(--color-utility-pink-50)" },
  { id: "receiver", title: "Receiver", bar: "var(--color-utility-orange-500)", tint: "var(--color-utility-orange-50)" },
  { id: "totals", title: "Totals", bar: "var(--color-utility-green-500)", tint: "var(--color-utility-green-50)" },
];

export interface ExtractedField {
  label: string;
  value: string;
  group: FieldGroupId;
}

export const extractedFields: ExtractedField[] = [
  { label: "Invoice No", value: invoice.number, group: "invoice" },
  { label: "Invoice Date", value: invoice.issued, group: "invoice" },
  { label: "Due Date", value: invoice.due, group: "invoice" },
  { label: "Merchant_Name", value: invoice.merchant.name, group: "merchant" },
  { label: "Merchant_Address", value: invoice.merchant.address, group: "merchant" },
  { label: "Merchant_Email", value: invoice.merchant.email, group: "merchant" },
  { label: "Merchant_Phone", value: invoice.merchant.phone, group: "merchant" },
  { label: "Receiver_Name", value: invoice.receiver.name, group: "receiver" },
  { label: "Receiver_Address", value: invoice.receiver.address, group: "receiver" },
  { label: "Receiver_Email", value: invoice.receiver.email, group: "receiver" },
  { label: "Receiver_Phone", value: invoice.receiver.phone, group: "receiver" },
  { label: "Sub_Total", value: invoice.subtotal, group: "totals" },
  { label: "Tax_Amount", value: invoice.tax, group: "totals" },
  { label: "Grand_Total", value: invoice.total, group: "totals" },
];

/* ------------------------------ line items ------------------------------ */

export interface LineItem {
  code: string;
  name: string;
  description: string;
  category: string;
  tax: string;
  qty: number;
  unitPrice: string;
  amount: string;
}

export const lineItems: LineItem[] = [
  { code: "OGL-2202", name: "SSL Certificate", description: "1-year wildcard certificate", category: "Hosting Services", tax: "9.5%", qty: 3, unitPrice: "$120.00", amount: "$360.00" },
  { code: "WM-003", name: "Website Maintenance", description: "Monthly security and updates", category: "IT Security", tax: "8.5%", qty: 1, unitPrice: "$450.00", amount: "$450.00" },
  { code: "CH-101", name: "Cloud Hosting Plan", description: "Monthly subscription", category: "Hosting Services", tax: "9.5%", qty: 4, unitPrice: "$89.00", amount: "$356.00" },
  { code: "PO-404", name: "Premium Support Plan", description: "24/7 IT assistance", category: "Support Services", tax: "8.5%", qty: 5, unitPrice: "$200.00", amount: "$1,000.00" },
  { code: "DR-500", name: "Domain Registration", description: "2-year .com domain", category: "Domain Services", tax: "9.5%", qty: 2, unitPrice: "$18.00", amount: "$36.00" },
  { code: "AN-220", name: "Analytics Add-on", description: "Usage dashboards", category: "Software", tax: "8.5%", qty: 1, unitPrice: "$240.00", amount: "$240.00" },
];

/* The pre-redesign "old data area": grouped, but plain and cramped, with lots
   of unmapped N/A fields and no visual hierarchy or cues. This is the "before"
   the case study argues against. */
export const beforeFieldGroups: { title: string; rows: [string, string][] }[] = [
  {
    title: "Basic information",
    rows: [
      ["Invoice number", invoice.number],
      ["Order number", "N/A"],
      ["Issue date", invoice.issued],
      ["Due date", invoice.due],
      ["Tax point date", "N/A"],
    ],
  },
  {
    title: "Payment instructions",
    rows: [
      ["Payment reference", "N/A"],
      ["Account number", "N/A"],
      ["Bank code", "N/A"],
      ["IBAN", "N/A"],
      ["BIC / SWIFT", "N/A"],
    ],
  },
  {
    title: "Merchant",
    rows: [
      ["Merchant name", invoice.merchant.name],
      ["Merchant address", invoice.merchant.address],
      ["Merchant email", invoice.merchant.email],
      ["Merchant phone", invoice.merchant.phone],
    ],
  },
  {
    title: "Receiver",
    rows: [
      ["Receiver name", invoice.receiver.name],
      ["Receiver address", invoice.receiver.address],
      ["Receiver phone", invoice.receiver.phone],
    ],
  },
  {
    title: "Custom",
    rows: [
      ["Vendor company ID", "N/A"],
      ["Vendor VAT number", "N/A"],
      ["Customer company ID", "N/A"],
      ["Customer VAT number", "N/A"],
    ],
  },
];

/* The pre-redesign table showed the real extracted columns, but under the raw
   field keys the extractor emits (snake_case, developer-facing) — the same raw
   style as the "before" fields panel. The redesign humanises them into the
   plain labels below. Same column order in both. */
/* The document's line-item table has exactly these columns; the extraction
   mirrors them (raw field keys "before", plain labels "after"). */
export const TABLE_HEADERS_BEFORE = ["Item_Name", "Description", "Quantity", "Unit_Price", "Line_Amount"];
export const TABLE_HEADERS_AFTER = ["Item", "Description", "Qty", "Unit price", "Amount"];

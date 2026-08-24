/* Hardcoded demo data for the Staple Chat screen - "Four Finger Invoices".
   Purely presentational: a franchise finance lead asking sales questions
   across Four Fingers outlets in Southeast Asia.

   Numbers are internally consistent:
   - Jan total  = 112,000 + 98,540 + 76,310 + 64,780 = $351,630
   - Feb total  = 125,400 + 94,210 + 81,650 + 66,120 = $367,380 (+4.5% MoM)
   - Singapore Feb $125,400 vs Jan $112,000 = +12.0% (quoted in answer 2) */

export interface SalesTable {
  columns: string[];
  rows: string[][];
  download?: string;
}

export interface ChartBar {
  label: string;
  value: number;
  display: string;
}

export type ChatMessage =
  | { role: "user"; text: string; entrance?: boolean }
  | {
      role: "assistant";
      /* Prose reasoning - shown in the expanded drawer when no discrete
         thinkingSteps are provided. */
      thinking: string;
      /* Quiet one-line summary shown in the collapsed drawer header,
         e.g. "reasoned over 1 document + 4 datasets". */
      thinkingSummary?: string;
      /* Discrete reasoning steps - when present, the expanded drawer shows
         these as a sequential list instead of the prose. */
      thinkingSteps?: string[];
      file?: string;
      lead?: string;
      table?: SalesTable;
      /* Inline bar chart rendered inside the message flow (beat "d3"). */
      chart?: ChartBar[];
      trailing?: string;
      confirm?: boolean;
      answer?: string;
      /* Marks messages that play an entrance (fade-up) when they mount -
         used by the chart beat's continuing-thread choreography. */
      entrance?: boolean;
    };

export const conversation: ChatMessage[] = [
  {
    role: "user",
    text: "What are the total sales during the month of January?",
  },
  {
    role: "assistant",
    thinking:
      "You're asking for total sales for January. I'm reading the January invoice document you linked, extracting per-market revenue lines, and reconciling them against the POS transaction tables…",
    thinkingSummary: "reasoned over 1 document + 4 datasets",
    file: "Invoice_FourFingers_FriedChicken_January2023.pdf",
    lead: "Here are the total sales across Four Fingers markets during January, $351,630 overall:",
    table: {
      columns: ["Market", "Sales"],
      rows: [
        ["Singapore", "$112,000"],
        ["Malaysia", "$98,540"],
        ["Vietnam", "$76,310"],
        ["Thailand", "$64,780"],
      ],
      download: "CSV",
    },
    trailing: "Do you have any other questions?",
    confirm: true,
  },
  {
    role: "user",
    text: "Give me the sales of the Singapore stores during the month of February",
  },
  {
    role: "assistant",
    thinking:
      "You want February revenue for the Singapore market specifically. Summing February POS transactions across the 6 Singapore outlets and comparing against January to surface the month-over-month trend…",
    thinkingSummary: "reasoned over 6 outlet tables",
    answer:
      "The total sales of the Singapore stores for the month of February amounted to **$125,400**, reflecting a **12% increase compared to January**. The Orchard Road and Jewel Changi outlets contributed most of the lift, together adding $9,800 of the $13,400 increase.",
  },
  {
    role: "user",
    text: "Compare the sales between Jan and Feb across all markets",
  },
  {
    role: "assistant",
    thinking:
      "Aggregating February totals per market and computing month-over-month change against the January figures already extracted…",
    thinkingSummary: "reasoned over 4 markets × 2 months",
    lead: "Here's the month-over-month comparison across all four markets:",
    table: {
      columns: ["Market", "January", "February", "Change"],
      rows: [
        ["Singapore", "$112,000", "$125,400", "+12.0%"],
        ["Malaysia", "$98,540", "$94,210", "−4.4%"],
        ["Vietnam", "$76,310", "$81,650", "+7.0%"],
        ["Thailand", "$64,780", "$66,120", "+2.1%"],
      ],
      download: "CSV",
    },
    answer:
      "February closed at **$367,380 across all markets, up 4.5% from January**. Singapore led the growth at +12.0% on the back of the Chinese New Year set-meal promotion, while Malaysia declined 4.4%, largely explained by two fewer trading days in February.",
  },
];

/* First-reveal exchange - case study beat "d1". One query, one clear answer:
   the category breakdown net of returns and taxes. Kept separate from the
   full `conversation` thread above (which later beats and the home page use).

   Numbers reconcile against the January gross above:
   - Jan gross $351,630 − returns $4,890 − taxes $18,200 = net $328,540
   - Categories: 186,420 + 54,310 + 41,870 + 32,110 + 13,830 = $328,540 */
export const revealConversation: ChatMessage[] = [
  {
    role: "user",
    text: "What are the total sales for each product category in January, excluding returns and taxes?",
  },
  {
    role: "assistant",
    thinking:
      "You're asking for January sales by product category, net of returns and taxes. I'm reading the January invoice document you linked, grouping revenue lines by category, removing return credits, and stripping the tax lines before totalling…",
    thinkingSummary: "reasoned over 1 document + 4 datasets",
    /* The last step lands on the same net total shown in the answer below -
       the visible reconciliation is the point. */
    thinkingSteps: [
      "Read Invoice_FourFingers_FriedChicken_January2023.pdf",
      "Grouped revenue lines by product category",
      "Removed return credits (−$4,890)",
      "Stripped tax lines (−$18,200)",
      "Totaled net sales by category → $328,540",
    ],
    file: "Invoice_FourFingers_FriedChicken_January2023.pdf",
    lead: "Here are January's sales by product category, $328,540 net after excluding $4,890 in returns and $18,200 in taxes:",
    table: {
      columns: ["Category", "Sales"],
      rows: [
        ["Fried Chicken", "$186,420"],
        ["Burgers & Wraps", "$54,310"],
        ["Sides & Snacks", "$41,870"],
        ["Beverages", "$32,110"],
        ["Desserts", "$13,830"],
      ],
      download: "CSV",
    },
    trailing: "Do you have any other questions?",
    confirm: true,
  },
];

/* The outlet split (bars) that answers "Break that down by outlet" - used
   inside chartConversation, the impact resting screen, and the details
   crops. Fourteen outlets (6 SG - matching the "6 Singapore outlets" in the
   February answer - 3 MY, 3 VN, 2 TH); per-market subtotals match the
   market figures used everywhere else and the grand total is the same
   $328,540 net:
   SG 104,600 = 29,840 + 21,120 + 16,890 + 14,630 + 12,340 + 9,780
   MY  92,080 = 41,350 + 28,470 + 22,260
   VN  71,300 = 32,180 + 24,640 + 14,480
   TH  60,560 = 36,320 + 24,240 */
export const outletChart: ChartBar[] = [
  { label: "KLCC", value: 41350, display: "$41,350" },
  { label: "Bangkok", value: 36320, display: "$36,320" },
  { label: "Saigon", value: 32180, display: "$32,180" },
  { label: "Orchard", value: 29840, display: "$29,840" },
  { label: "Penang", value: 28470, display: "$28,470" },
  { label: "Hanoi", value: 24640, display: "$24,640" },
  { label: "Phuket", value: 24240, display: "$24,240" },
  { label: "Johor", value: 22260, display: "$22,260" },
  { label: "Jewel", value: 21120, display: "$21,120" },
  { label: "Bugis", value: 16890, display: "$16,890" },
  { label: "Tampines", value: 14630, display: "$14,630" },
  { label: "Da Nang", value: 14480, display: "$14,480" },
  { label: "Sentosa", value: 12340, display: "$12,340" },
  { label: "Changi", value: 9780, display: "$9,780" },
];

/* Details beat, crop 2 - the line-chart answer to the follow-up chip
   "How does that compare to December?". Monthly NET sales (after returns
   and taxes) with a modest upward trend; January lands on the same $328,540
   net figure every other state reconciles to (Jan +3.2% vs December). */
export const trendChart: ChartBar[] = [
  { label: "Aug", value: 289300, display: "$289,300" },
  { label: "Sep", value: 296750, display: "$296,750" },
  { label: "Oct", value: 301420, display: "$301,420" },
  { label: "Nov", value: 309880, display: "$309,880" },
  { label: "Dec", value: 318240, display: "$318,240" },
  { label: "Jan", value: 328540, display: "$328,540" },
];

/* Chart beat - case study "d3" ("Charts live inside the conversation").
   The thread CONTINUES from the reveal exchange: the follow-up chip
   "Break that down by market" becomes a real user message, answered by an
   inline bar chart. */
export const chartConversation: ChatMessage[] = [
  ...revealConversation,
  { role: "user", text: "Break that down by outlet", entrance: true },
  {
    role: "assistant",
    entrance: true,
    thinking:
      "Splitting January net sales by outlet. Reusing the extraction from the previous answer, re-aggregating per outlet via outlet_master, and keeping the same returns and tax exclusions…",
    thinkingSummary: "reasoned over 14 outlets",
    lead: "January net sales by outlet, after returns and taxes. KLCC leads at $41,350:",
    chart: outletChart,
  },
];

/* Impact beat (11) - the finished product at REST behind the metrics: one
   settled exchange that fits a single viewport with no scrolling (question,
   collapsed reasoning, answer, chart). No entrance flags on purpose - the
   background screen must not animate. Same net figures as everywhere else. */
export const impactConversation: ChatMessage[] = [
  {
    role: "user",
    text: "What were January's net sales by outlet, excluding returns and taxes?",
  },
  {
    role: "assistant",
    thinking:
      "You're asking for January sales split by outlet, net of returns and taxes. I'm reading the January invoice document, aggregating revenue lines per outlet via outlet_master, and removing return credits and tax lines before totalling…",
    thinkingSummary: "reasoned over 1 document + 4 datasets",
    lead: "January net sales by outlet, after returns and taxes. $328,540 overall, led by KLCC at $41,350:",
    chart: outletChart,
  },
];

/* Voice beat (12) - "from chatting to talking". The spoken follow-up and its
   answer. Quarterly growth per market (Nov -> Jan net sales, same returns and
   tax exclusions), consistent with trendChart's Nov $309,880 -> Jan $328,540
   (+6.0% overall): each market's implied November base against its January
   net figure sums back to ~$309,900. */
export const voiceQuestion = "Which market grew fastest this quarter?";

export const voiceChart: ChartBar[] = [
  { label: "Singapore", value: 9.5, display: "+9.5%" },
  { label: "Vietnam", value: 7.6, display: "+7.6%" },
  { label: "Malaysia", value: 3.2, display: "+3.2%" },
  { label: "Thailand", value: 2.9, display: "+2.9%" },
];

export const voiceAnswer: ChatMessage = {
  role: "assistant",
  entrance: true,
  thinking:
    "You're asking which market grew fastest this quarter. Comparing each market's November and January net sales, keeping the same returns and tax exclusions…",
  thinkingSummary: "reasoned over 4 markets × 3 months",
  lead: "Singapore grew fastest this quarter, with net sales up 9.5% since November, ahead of Vietnam at 7.6%:",
  chart: voiceChart,
};

/* Follow-ups shown during the voice beat (the asked chip is gone). */
export const voiceFollowUps = [
  "Compare to December",
  "Show this as a share of total",
];

/* Blank-canvas beat ("d5"): a brand-new chat. The empty thread is the
   problem state; these starter chips are the fix. */
export const blankConversation: ChatMessage[] = [];
export const starterChips = [
  "What were total sales in January?",
  "Which market is growing fastest?",
  "Show returns as a share of gross",
  "Compare this month to last",
];

/* Fresh follow-ups for the chart beat - the thread keeps going. */
export const chartFollowUps = [
  "Which market grew fastest?",
  "Compare to December",
  "Show this as a share of total",
];

/* Parsed-intent tokens - CURRENTLY UNUSED. The d2 strip was cut (the beat
   highlights the Thinking block instead); data kept for possible reuse. */
export const revealIntent = [
  { label: "metric", value: "total sales" },
  { label: "group", value: "product category" },
  { label: "period", value: "January" },
  { label: "exclude", value: "returns" },
  { label: "exclude", value: "taxes" },
];

/* Follow-ups that fit the reveal exchange (the default set below references
   February, which doesn't exist yet in the single-query state). */
export const revealFollowUps = [
  "Break that down by outlet",
  "How does that compare to December?",
  "Which category has the best margin?",
  "Show returns as a share of gross",
];

export const followUps = [
  "Which outlet drove the February increase?",
  "Show the monthly trend for 2023",
  "What's the average order value by market?",
  "Forecast March sales",
];

export interface DataSource {
  name: string;
  sub: string;
  type: string;
}

/* Instructions tab (beat "d4" + walkthrough step 7): custom business logic
   Staple applies to every answer. Global rules - never tied to a specific
   document or source. */
export const panelInstructions = [
  { source: "Reviews", rule: "Treat anything below 3 stars as negative." },
  { source: "Transactions", rule: "Exclude voided and test transactions from every total." },
  { source: "Revenue figures", rule: "Report net of returns and taxes unless asked otherwise." },
];

export const dataSources: DataSource[] = [
  { name: "Invoice_FourFingers_FriedChicken_January2023", sub: "finance.invoices", type: "Document" },
  { name: "pos_transactions_singapore", sub: "sales.singapore", type: "Table" },
  { name: "pos_transactions_malaysia", sub: "sales.malaysia", type: "Table" },
  { name: "pos_transactions_vietnam", sub: "sales.vietnam", type: "Table" },
  { name: "pos_transactions_thailand", sub: "sales.thailand", type: "Table" },
  { name: "outlet_master", sub: "ops.locations", type: "Table" },
  { name: "monthly_pnl_2023", sub: "finance.reports", type: "Table" },
  { name: "supplier_invoices_q1", sub: "finance.payables", type: "Document" },
  { name: "delivery_orders_grabfood", sub: "sales.delivery", type: "Table" },
  { name: "customer_reviews", sub: "marketing.feedback", type: "Table" },
];

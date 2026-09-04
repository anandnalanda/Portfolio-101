"use client";

/* Shared candidate data + presentation used by two employer surfaces:
   - CandidatePool (inbound applicants — interim d3 view)
   - DiscoverMarket (outbound sourcing — the "Discover" nav destination)
   Both render the same rich person: a feed row (with a mode-specific action)
   and a detail drawer (Overview grading · Experience · Skill map). Keeping the
   humans + drawer here means the two screens stay in lockstep. OFM Kibo system
   (zinc + ofm). */

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import {
  ChevronDown,
  BadgeCheck,
  MapPin,
  Briefcase,
  BookOpenText,
  Mic,
  Headphones,
  Gauge,
  Keyboard,
  Play,
  Pause,
  Check,
  Plus,
  MessageSquare,
  Contact,
  Award,
  Languages,
  Clock,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const EASE = [0.22, 1, 0.36, 1] as const;

/* ── the humans ────────────────────────────────────────────── */
export type Exp = {
  role: string;
  org: string;
  when: string;
  type: string; // employment type (Full-time / Part-time / Contract)
  detail: string; // what the role actually involved (shown on the Experience tab)
};
export type Candidate = {
  name: string;
  initials: string;
  photo?: string;
  role: string;
  years: string;
  score: number; // overall, avg of the battery
  pn: "she" | "he";
  location: string;
  english: number;
  verbal: number;
  listening: number;
  mbps: number;
  wpm: number;
  acc: number;
  verbalWhy: string;
  experience: Exp[];
  tenure: { avg: string; current: string; total: string };
  languages: string;
  bars: number[]; // per-test strengths (E·V·L·S·T), 0–100
  /* the feed one-liner — who they are, not their scores (those live in the
     detail). `mark` is the standout phrase highlighted inside `summary`. */
  summary: string;
  mark: string;
  seeking: string; // employment type sought (e.g., Full-time)
  topSkill: string; // the candidate's headline skill
  about: string; // the candidate's own short bio (first person)
};

export const POOL: Candidate[] = [
  {
    name: "Maria Reyes", initials: "MR", photo: "/maria.jpg", role: "Chat support", years: "3 yrs", score: 91,
    pn: "she", location: "Manila, PH",
    english: 92, verbal: 88, listening: 95, mbps: 92, wpm: 68, acc: 97,
    verbalWhy: "Clear, calm phrasing. De-escalated the refund scenario without over-promising a timeline.",
    experience: [
      {
        role: "Customer Support Rep",
        org: "BloomCommerce",
        when: "Mar 2024 – Present",
        type: "Full-time",
        detail:
          "Runs live chat and email for a high-volume fashion store, owning refunds, delivery disputes, and order changes. Holds CSAT above 95 percent while handling up to sixty chats a day.",
      },
      {
        role: "Live Chat Agent",
        org: "Nimbus Support",
        when: "2022 – 2024",
        type: "Full-time",
        detail:
          "Covered concurrent chat queues for three SaaS clients, resolving billing and login issues on first contact. Wrote canned replies the team still uses.",
      },
      {
        role: "Chat Support Associate",
        org: "HelpNest",
        when: "2021 – 2022",
        type: "Part-time",
        detail:
          "First support role, handling tier-one tickets and learning to keep a calm, steady tone under a full queue.",
      },
      {
        role: "Customer Service Intern",
        org: "QuickCart",
        when: "2020 – 2021",
        type: "Internship",
        detail:
          "Internship on a small e-commerce support desk, shadowing senior agents and taking her first live chats.",
      },
    ],
    tenure: { avg: "1 yr 6 mos", current: "1 yr 2 mos", total: "3 yrs" },
    languages: "English · Spanish", bars: [92, 88, 95, 90, 88],
    summary: "Three years across live chat and support, calm under pressure and quick to de-escalate.",
    mark: "calm under pressure",
    seeking: "Full-time", topSkill: "De-escalation",
    about: "I've spent three years in live chat and I'm at my best calming a heated conversation. I like juggling a few chats at once and keeping every one on track. Most of my work has been in e-commerce support, where refunds and delivery issues taught me to stay clear and honest under pressure. I also keep notes on what worked, so the next tough chat goes smoother.",
  },
  {
    name: "Aisha Khan", initials: "AK", photo: "/aisha.jpg", role: "Email support", years: "3 yrs", score: 90,
    pn: "she", location: "Lahore, PK",
    english: 95, verbal: 84, listening: 92, mbps: 88, wpm: 70, acc: 98,
    verbalWhy: "Polite and precise. Answered the billing question directly and offered a clear next step.",
    experience: [
      {
        role: "Email Support Specialist",
        org: "Zendly",
        when: "Jun 2023 – Present",
        type: "Full-time",
        detail:
          "Owns a shared inbox of a hundred-plus emails a day for a subscription brand, keeping first response under two hours. Cut repeat contacts by tightening the macro library.",
      },
      {
        role: "Helpdesk Agent",
        org: "TicketFlow",
        when: "2021 – 2023",
        type: "Full-time",
        detail:
          "Triaged and answered support tickets across email and a help center, tagging and routing anything that needed engineering.",
      },
      {
        role: "Data Entry Clerk",
        org: "InfoBase",
        when: "2020 – 2021",
        type: "Full-time",
        detail:
          "Processed and verified records at speed, where accuracy mattered above all and typing had to keep pace.",
      },
      {
        role: "Office Assistant",
        org: "Lahore Textiles",
        when: "2019 – 2020",
        type: "Full-time",
        detail:
          "Handled correspondence and records for a busy trading office, where clean writing and fast typing first paid off.",
      },
    ],
    tenure: { avg: "1 yr 9 mos", current: "2 yrs 4 mos", total: "3 yrs 2 mos" },
    languages: "English · Urdu", bars: [95, 84, 92, 88, 90],
    summary: "The pool's sharpest writer and its fastest typist, built for high-volume email and chat.",
    mark: "fastest typist",
    seeking: "Full-time", topSkill: "High-volume email",
    about: "I write fast and clean, and email and chat are where I shine. Three years in, I still sweat the small details of a good reply. I've handled shared inboxes where a hundred emails a day was normal, and I learned to keep quality up while the volume climbs. Clear subject lines, tight paragraphs, and no loose ends.",
  },
  {
    name: "Diego Salas", initials: "DS", photo: "/diego.jpg", role: "Customer support", years: "2 yrs", score: 88,
    pn: "he", location: "Bogotá, CO",
    english: 88, verbal: 82, listening: 90, mbps: 86, wpm: 67, acc: 96,
    verbalWhy: "Warm tone, stayed on-topic. Slight hesitation mid-answer but recovered well.",
    experience: [
      {
        role: "Customer Support Rep",
        org: "PetPal",
        when: "Jan 2024 – Present",
        type: "Full-time",
        detail:
          "Handles chat and email for a pet-supplies store, from order tracking to upset-customer recovery. Known for turning a bad delivery into a five-star review.",
      },
      {
        role: "Chat Agent",
        org: "Mercado",
        when: "2022 – 2024",
        type: "Full-time",
        detail:
          "Answered pre-sale and post-sale chats on a busy marketplace, switching between English and Spanish shoppers all shift.",
      },
      {
        role: "Retail Associate",
        org: "TiendaMax",
        when: "2021 – 2022",
        type: "Part-time",
        detail:
          "Front-line retail, where reading a frustrated customer quickly and staying warm became second nature.",
      },
      {
        role: "Call Center Trainee",
        org: "Andina BPO",
        when: "2020 – 2021",
        type: "Full-time",
        detail:
          "Learned the basics of phone and chat support on a large BPO floor, scripted at first and improvising by the end.",
      },
    ],
    tenure: { avg: "1 yr 4 mos", current: "1 yr 8 mos", total: "2 yrs 6 mos" },
    languages: "English · Spanish", bars: [88, 82, 90, 86, 88],
    summary: "Two years in customer support with a warm, steady tone and a genuine ear for the customer.",
    mark: "strong listener",
    seeking: "Full-time", topSkill: "Active listening",
    about: "I really try to hear the customer before I respond. Two years in support taught me that a warm, steady tone solves most problems before they grow. I've worked both chat and email queues for marketplaces, so I'm comfortable switching styles mid-shift. Teammates say I'm the one they hand the tricky, upset customers to.",
  },
  {
    name: "Priya Nair", initials: "PN", photo: "/priya.jpg", role: "Virtual assistant", years: "4 yrs", score: 85,
    pn: "she", location: "Kochi, IN",
    english: 86, verbal: 80, listening: 84, mbps: 89, wpm: 63, acc: 95,
    verbalWhy: "Confident delivery. Answer ran a touch long but covered the scenario fully.",
    experience: [
      {
        role: "Virtual Assistant",
        org: "Wanderly",
        when: "Aug 2022 – Present",
        type: "Full-time",
        detail:
          "Runs calendars, inboxes, travel, and vendor chasing for two founders across time zones, working async and over-communicating so nothing slips.",
      },
      {
        role: "Data Entry Specialist",
        org: "BloomCommerce",
        when: "2020 – 2022",
        type: "Full-time",
        detail:
          "Kept product catalogs and order records clean and current, catching mismatches before they reached customers.",
      },
      {
        role: "Admin Assistant",
        org: "Kochi Traders",
        when: "2019 – 2020",
        type: "Full-time",
        detail:
          "General office support: scheduling, filing, and first point of contact for calls and walk-ins.",
      },
      {
        role: "Front Desk Executive",
        org: "Marine Hotel",
        when: "2018 – 2019",
        type: "Full-time",
        detail:
          "Greeted guests, managed bookings, and juggled phones and walk-ins, the start of her multitasking habit.",
      },
    ],
    tenure: { avg: "2 yrs", current: "3 yrs 1 mo", total: "4 yrs 2 mos" },
    languages: "English · Hindi · Malayalam", bars: [86, 80, 84, 88, 82],
    summary: "The most seasoned here: four years as a trilingual, unflappable virtual assistant.",
    mark: "trilingual",
    seeking: "Full-time", topSkill: "Multitasking",
    about: "Four years as a virtual assistant across three languages. I like owning the messy behind-the-scenes work so the team can move faster. Calendars, inboxes, travel, vendor chasing, light bookkeeping: if it keeps someone's day running, I've probably done it. I work async-friendly hours and over-communicate so nothing slips.",
  },
  {
    name: "Tomas Vega", initials: "TV", photo: "/tomas.jpg", role: "Chat support", years: "1 yr", score: 82,
    pn: "he", location: "Lima, PE",
    english: 80, verbal: 78, listening: 82, mbps: 84, wpm: 66, acc: 94,
    verbalWhy: "Friendly and quick. Phrasing simple but effective for a chat context.",
    experience: [
      {
        role: "Chat Support",
        org: "Shopline",
        when: "Sep 2024 – Present",
        type: "Full-time",
        detail:
          "Covers evening chat shifts solo for an e-commerce store, prioritizing a full queue and escalating cleanly when something is over his head.",
      },
      {
        role: "Retail Sales Associate",
        org: "MercadoLima",
        when: "2023 – 2024",
        type: "Part-time",
        detail:
          "Sold electronics on the floor, where a quick, friendly read of the customer moved a lot of stock.",
      },
      {
        role: "Warehouse Assistant",
        org: "DepoSur",
        when: "2022 – 2023",
        type: "Part-time",
        detail:
          "Picking, packing, and inventory checks, where speed and accuracy under a clock became second nature.",
      },
    ],
    tenure: { avg: "1 yr", current: "1 yr", total: "1 yr 3 mos" },
    languages: "English · Spanish", bars: [80, 78, 82, 84, 84],
    summary: "Newer to the field but fast on his feet and easy to talk to, with a year of chat support.",
    mark: "fast and friendly",
    seeking: "Full-time", topSkill: "Fast response",
    about: "I'm newer to support but quick on my feet and easy to talk to. I pick things up fast and keep every chat friendly. In my first year I covered evening shifts alone, which taught me to prioritize and stay calm when the queue fills up. I ask good questions early so I don't waste the customer's time.",
  },
  {
    name: "Lucas Meyer", initials: "LM", photo: "/lucas.jpg", role: "Sales chat", years: "2 yrs", score: 80,
    pn: "he", location: "Córdoba, AR",
    english: 82, verbal: 76, listening: 78, mbps: 80, wpm: 64, acc: 94,
    verbalWhy: "Persuasive and upbeat. Leaned slightly salesy for a support scenario.",
    experience: [
      {
        role: "Sales Development Rep",
        org: "UpsellIQ",
        when: "Apr 2024 – Present",
        type: "Full-time",
        detail:
          "Works inbound sales chat to a monthly quota, qualifying leads and closing softly without pushing. Consistently top three on the team.",
      },
      {
        role: "Live Chat Agent",
        org: "Shopline",
        when: "2022 – 2024",
        type: "Full-time",
        detail:
          "Guided browsing shoppers to the right product over chat, blending support with a gentle upsell.",
      },
      {
        role: "Retail Associate",
        org: "CityStore",
        when: "2021 – 2022",
        type: "Part-time",
        detail:
          "Floor sales for fashion and electronics, learning to read intent and close on a busy Saturday.",
      },
      {
        role: "Event Promoter",
        org: "EventosAR",
        when: "2020 – 2021",
        type: "Part-time",
        detail:
          "Worked crowds at brand activations, learning to open a conversation with a stranger and keep it warm.",
      },
    ],
    tenure: { avg: "1 yr 2 mos", current: "1 yr 6 mos", total: "2 yrs 4 mos" },
    languages: "English · Spanish", bars: [82, 76, 78, 80, 82],
    summary: "A sales-chat background, persuasive and upbeat, at his best steering toward a close.",
    mark: "persuasive and upbeat",
    seeking: "Full-time", topSkill: "Upselling",
    about: "I come from sales chat, so I'm comfortable guiding a conversation somewhere useful. Upbeat and persuasive, never pushy. Two years of working to a quota taught me to listen for what the customer actually needs before suggesting anything. I like the moment a hesitant browser turns into a happy yes, and I'm patient enough to get there gently.",
  },
  {
    name: "Hana Sato", initials: "HS", photo: "/hana.jpg", role: "Community support", years: "2 yrs", score: 78,
    pn: "she", location: "Cebu, PH",
    english: 78, verbal: 72, listening: 80, mbps: 78, wpm: 61, acc: 93,
    verbalWhy: "Calm and clear. A little quiet on audio; a retake was offered, not required.",
    experience: [
      {
        role: "Community Support",
        org: "Fandom House",
        when: "Mar 2024 – Present",
        type: "Full-time",
        detail:
          "Moderates and supports fan communities across three languages, defusing heated threads before they spiral.",
      },
      {
        role: "Content Moderator",
        org: "Wanderly",
        when: "2022 – 2024",
        type: "Full-time",
        detail:
          "Reviewed user posts against policy at volume, balancing speed with fair, human judgment.",
      },
      {
        role: "Forum Moderator",
        org: "AnimeHub",
        when: "2021 – 2022",
        type: "Part-time",
        detail:
          "Volunteer-turned-paid mod for a large anime forum, writing the tone guidelines new mods still follow.",
      },
      {
        role: "Community Volunteer",
        org: "MangaClub",
        when: "2020 – 2021",
        type: "Part-time",
        detail:
          "Volunteer helper on a hobby forum, answering newcomer questions and keeping threads friendly.",
      },
    ],
    tenure: { avg: "1 yr 3 mos", current: "1 yr 7 mos", total: "2 yrs 1 mo" },
    languages: "English · Japanese · Filipino", bars: [78, 72, 80, 76, 78],
    summary: "Two years in community support, trilingual and unfailingly calm under a heated thread.",
    mark: "trilingual and calm",
    seeking: "Full-time", topSkill: "Community moderation",
    about: "Two years in community support across three languages. I stay calm and patient, which helps when a thread gets tense. I've moderated gaming and fandom spaces, so I know how fast a small misunderstanding can spiral without a steady voice. I care about keeping the rules clear while still sounding human.",
  },
  {
    name: "Grace Okafor", initials: "GO", photo: "/grace.jpg", role: "Community support", years: "2 yrs", score: 77,
    pn: "she", location: "Lagos, NG",
    english: 82, verbal: 80, listening: 78, mbps: 74, wpm: 62, acc: 93,
    verbalWhy: "Warm and articulate. Kept the community guidelines clear without sounding preachy.",
    experience: [
      {
        role: "Community Support",
        org: "ForumHub",
        when: "Feb 2024 – Present",
        type: "Full-time",
        detail:
          "Keeps busy discussion communities on-topic and calm, onboarding new moderators and owning the late-night queue.",
      },
      {
        role: "Chat Moderator",
        org: "PlayNet",
        when: "2022 – 2024",
        type: "Full-time",
        detail:
          "Moderated live game chat, acting fast on rule-breaks while keeping the room welcoming.",
      },
      {
        role: "Support Volunteer",
        org: "GameCircle",
        when: "2021 – 2022",
        type: "Part-time",
        detail:
          "Started as a community volunteer answering member questions and flagging issues to staff.",
      },
      {
        role: "Social Media Assistant",
        org: "LagosLive",
        when: "2020 – 2021",
        type: "Part-time",
        detail:
          "Scheduled posts and replied to comments for a local media page, her first taste of managing a community.",
      },
    ],
    tenure: { avg: "1 yr", current: "1 yr 4 mos", total: "2 yrs 3 mos" },
    languages: "English · Yoruba", bars: [82, 80, 78, 74, 76],
    summary: "Two years moderating busy communities, warm and even-keeled when a thread turns heated.",
    mark: "warm and even-keeled",
    seeking: "Full-time", topSkill: "Community moderation",
    about: "Two years keeping online communities calm and on-topic. I'm good at defusing a heated thread before it spirals. I've written moderation guidelines, onboarded new mods, and handled the late-night queue when things got loud. Firm on the rules, warm with the people is how I try to work.",
  },
  {
    name: "Sofia Torres", initials: "ST", photo: "/sofia.jpg", role: "Sales chat", years: "3 yrs", score: 76,
    pn: "she", location: "Mexico City, MX",
    english: 80, verbal: 82, listening: 76, mbps: 78, wpm: 60, acc: 92,
    verbalWhy: "Energetic and persuasive. Closed the mock upsell naturally, without pressure.",
    experience: [
      {
        role: "Sales Chat Rep",
        org: "VentaYa",
        when: "May 2023 – Present",
        type: "Full-time",
        detail:
          "Sells fashion and electronics over chat in two languages, hitting a soft-close target on high-traffic days.",
      },
      {
        role: "Live Chat Agent",
        org: "Tiendita",
        when: "2021 – 2023",
        type: "Full-time",
        detail:
          "Handled pre-sale questions and order help for a growing online shop, turning questions into orders.",
      },
      {
        role: "Retail Associate",
        org: "ModaSur",
        when: "2020 – 2021",
        type: "Part-time",
        detail:
          "In-store fashion sales, where tone and timing mattered more than any script.",
      },
      {
        role: "Cashier",
        org: "SuperMart",
        when: "2019 – 2020",
        type: "Part-time",
        detail:
          "Front-register retail at a busy grocery, staying friendly and quick through long weekend lines.",
      },
    ],
    tenure: { avg: "1 yr 6 mos", current: "2 yrs 1 mo", total: "3 yrs 1 mo" },
    languages: "English · Spanish", bars: [80, 82, 76, 78, 74],
    summary: "Three years in sales chat, energetic and persuasive with a knack for a soft close.",
    mark: "energetic and persuasive",
    seeking: "Full-time", topSkill: "Upselling",
    about: "Three years in sales chat across two languages. I like turning a browsing customer into a happy buyer, gently. I've sold fashion and electronics over chat, where tone and timing matter more than any script. Give me a busy Saturday queue and a soft-close target and I'm in my element.",
  },
  {
    name: "Ivan Petrov", initials: "IP", photo: "/ivan.jpg", role: "Technical support", years: "4 yrs", score: 75,
    pn: "he", location: "Kyiv, UA",
    english: 78, verbal: 72, listening: 80, mbps: 84, wpm: 68, acc: 95,
    verbalWhy: "Precise and methodical. Walked through the troubleshooting steps clearly.",
    experience: [
      {
        role: "Technical Support Rep",
        org: "SoftLine",
        when: "Feb 2023 – Present",
        type: "Full-time",
        detail:
          "Resolves SaaS and hardware tickets with step-by-step fixes anyone can follow, closing half on first reply thanks to a personal playbook of solved cases.",
      },
      {
        role: "Helpdesk Agent",
        org: "NetCore",
        when: "2020 – 2023",
        type: "Full-time",
        detail:
          "Supported internal and customer users on connectivity and account issues, methodical even when the caller was not.",
      },
      {
        role: "IT Support Trainee",
        org: "DataWorks",
        when: "2019 – 2020",
        type: "Full-time",
        detail:
          "Learned the fundamentals of ticketing, diagnostics, and clear written fixes on a small IT team.",
      },
      {
        role: "Computer Lab Assistant",
        org: "Tech Institute",
        when: "2018 – 2019",
        type: "Part-time",
        detail:
          "Kept a campus computer lab running and helped students with setups and fixes, where his patience started.",
      },
    ],
    tenure: { avg: "2 yrs", current: "2 yrs 6 mos", total: "4 yrs 3 mos" },
    languages: "English · Ukrainian · Russian", bars: [78, 72, 80, 84, 82],
    summary: "Four years in technical support, methodical and patient with even the trickiest ticket. Walks customers through the fix step by step and never loses his composure.",
    mark: "methodical and patient",
    seeking: "Full-time", topSkill: "Troubleshooting",
    about: "Four years solving technical tickets. I stay methodical and patient, even when the customer isn't. I've supported SaaS and hardware products, writing step-by-step fixes that people can actually follow. I keep a personal playbook of solved cases, and half my tickets close on the first reply because of it.",
  },
  {
    name: "Daniel Mensah", initials: "DM", photo: "/daniel.jpg", role: "Customer support", years: "2 yrs", score: 73,
    pn: "he", location: "Accra, GH",
    english: 76, verbal: 74, listening: 76, mbps: 72, wpm: 60, acc: 92,
    verbalWhy: "Friendly and confident. Clear delivery with an easy, reassuring tone.",
    experience: [
      {
        role: "Customer Support Rep",
        org: "ShopAfrica",
        when: "Jan 2024 – Present",
        type: "Full-time",
        detail:
          "Handles e-commerce chat and email at speed, aiming to resolve on the first message with a warm, reassuring tone.",
      },
      {
        role: "Call Center Agent",
        org: "ConnectLine",
        when: "2022 – 2024",
        type: "Full-time",
        detail:
          "Took inbound support calls to tight handle-time targets without letting quality slip.",
      },
      {
        role: "Retail Associate",
        org: "AccraMart",
        when: "2021 – 2022",
        type: "Part-time",
        detail:
          "Floor and register work at a busy store, learning to keep customers happy when the line got long.",
      },
    ],
    tenure: { avg: "1 yr", current: "1 yr 8 mos", total: "2 yrs 2 mos" },
    languages: "English · Twi", bars: [76, 74, 76, 72, 74],
    summary: "Two years in customer support, friendly and reassuring from the first message. Aims to resolve on first contact with an easy tone that quickly puts people at ease.",
    mark: "friendly and reassuring",
    seeking: "Full-time", topSkill: "First-contact resolution",
    about: "Two years in customer support. I aim to sort things out on the first message, with an easy, reassuring tone. I've worked e-commerce queues where speed matters, but I never let a fast reply become a sloppy one. Customers remember how you made them feel, so I make sure that part is looked after.",
  },
  {
    name: "Elena Novak", initials: "EN", photo: "/elena.jpg", role: "Chat support", years: "3 yrs", score: 72,
    pn: "she", location: "Belgrade, RS",
    english: 79, verbal: 70, listening: 74, mbps: 80, wpm: 66, acc: 94,
    verbalWhy: "Calm and clear. Slightly formal but easy to follow.",
    experience: [
      {
        role: "Chat Support Agent",
        org: "EuroServe",
        when: "Jun 2023 – Present",
        type: "Full-time",
        detail:
          "Runs chat queues for European travel and retail brands, switching languages mid-shift without losing the thread. Checklists keep her error rate low.",
      },
      {
        role: "Data Entry",
        org: "InfoBase",
        when: "2021 – 2023",
        type: "Full-time",
        detail:
          "Entered and reconciled records accurately under deadline, building the typing speed her support work runs on.",
      },
      {
        role: "Reception Assistant",
        org: "Praha Group",
        when: "2020 – 2021",
        type: "Part-time",
        detail:
          "Front desk and phones, first point of contact and the person who kept the day organized.",
      },
      {
        role: "Sales Assistant",
        org: "Novak Retail",
        when: "2019 – 2020",
        type: "Part-time",
        detail:
          "Helped shoppers on the floor and at the till, her first practice at reading people and staying calm.",
      },
    ],
    tenure: { avg: "1 yr 6 mos", current: "2 yrs", total: "3 yrs" },
    languages: "English · Serbian · German", bars: [79, 70, 74, 80, 80],
    summary: "Three years in chat support, calm and precise across three languages. Holds a clear, steady tone at volume and rarely lets a detail slip, however busy the queue.",
    mark: "calm and precise",
    seeking: "Full-time", topSkill: "Multilingual chat",
    about: "Three years in chat support across three languages. I keep things calm and precise, even at volume. I've worked for European travel and retail brands, switching languages mid-shift without losing the thread. Checklists and short, clear sentences keep my queue moving and my error rate low.",
  },
  {
    name: "Nora Varga", initials: "NV", photo: "/nora.jpg", role: "Email support", years: "2 yrs", score: 70,
    pn: "she", location: "Budapest, HU",
    english: 77, verbal: 70, listening: 72, mbps: 78, wpm: 64, acc: 93,
    verbalWhy: "Polite and steady. A little reserved but clear throughout.",
    experience: [
      {
        role: "Email Support Agent",
        org: "MailDesk",
        when: "Mar 2024 – Present",
        type: "Full-time",
        detail:
          "Owns an email queue with a strict inbox-zero habit, sorting and answering in batches so nothing sits overnight.",
      },
      {
        role: "Administrative Assistant",
        org: "Budapest Co",
        when: "2022 – 2024",
        type: "Full-time",
        detail:
          "Scheduling, correspondence, and document handling for a small team, where a tidy system kept everyone unblocked.",
      },
      {
        role: "Office Intern",
        org: "Danube Group",
        when: "2021 – 2022",
        type: "Internship",
        detail:
          "Internship supporting an admin team with filing, data entry, and inbox cleanup, where her tidy habits formed.",
      },
    ],
    tenure: { avg: "1 yr", current: "1 yr 6 mos", total: "2 yrs 1 mo" },
    languages: "English · Hungarian", bars: [77, 70, 72, 78, 78],
    summary: "Two years in email support, polite and steady with a famously tidy inbox. Keeps replies clear and on time even on the busiest days, never leaving a thread hanging.",
    mark: "polite and steady",
    seeking: "Full-time", topSkill: "Inbox management",
    about: "Two years in email support. I keep a tidy inbox and a polite, steady tone, even on a busy day. I sort, tag, and answer in batches, so nothing sits unanswered overnight. The inbox-zero habit is a bit of a personality trait at this point, and my response times show it.",
  },
];

export const barTone = (v: number) =>
  v >= 85 ? "bg-ofm-500" : v >= 70 ? "bg-ofm-300" : "bg-zinc-200";

/* the five tests, ordered so the AI-scored verbal (with its reasoning) lands
   last — each mapped to how it was graded. */
export type Row = {
  label: string;
  icon: typeof Mic;
  value: (c: Candidate) => string;
  method: "Measured" | "Auto-scored" | "AI-scored";
  strength: (c: Candidate) => number;
};
export const TESTS: Row[] = [
  { label: "English", icon: BookOpenText, value: (c) => `${c.english} / 100`, method: "Auto-scored", strength: (c) => c.english },
  { label: "Listening", icon: Headphones, value: (c) => `${c.listening} / 100`, method: "Auto-scored", strength: (c) => c.listening },
  { label: "Typing", icon: Keyboard, value: (c) => `${c.wpm} WPM`, method: "Measured", strength: (c) => c.bars[4] },
  { label: "Internet speed", icon: Gauge, value: (c) => `${c.mbps} Mbps`, method: "Measured", strength: (c) => c.bars[3] },
  { label: "Verbal", icon: Mic, value: (c) => `${c.verbal} / 100`, method: "AI-scored", strength: (c) => c.verbal },
];

/* the employer's pass mark per test (d4 "a score you can trust") */
const PASS_MARK: Record<string, string> = {
  English: "80",
  Listening: "80",
  Typing: "55 WPM",
  "Internet speed": "70 Mbps",
  Verbal: "70",
};

/* when each verified score was earned — all predate this search (d5) */
const EARNED: Record<string, string> = {
  English: "3 weeks ago",
  Listening: "3 weeks ago",
  Typing: "6 weeks ago",
  "Internet speed": "6 weeks ago",
  Verbal: "2 months ago",
};

/* ── small shared UI ───────────────────────────────────────── */
export function Hi({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-ofm-50 px-1 font-medium text-ofm-700">
      {children}
    </span>
  );
}

export function ScoreChip({ score }: { score: number }) {
  const strong = score >= 85;
  return (
    <span
      className={`flex items-center justify-center rounded-lg px-2 py-1 text-ofm-label font-semibold tabular-nums ${
        strong ? "bg-ofm-50 text-ofm-700" : "bg-zinc-100 text-zinc-600"
      }`}
    >
      {score}
    </span>
  );
}


export function Avatar({ c, size }: { c: Candidate; size: number }) {
  const cls = "shrink-0 rounded-full ring-1 ring-black/5";
  return c.photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={c.photo} alt={c.name} className={`${cls} object-cover`} style={{ width: size, height: size }} />
  ) : (
    <span
      className={`${cls} flex items-center justify-center bg-zinc-100 font-semibold text-zinc-500`}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {c.initials}
    </span>
  );
}

/* ── a feed row (mode swaps the action + the summary framing) ── */
export function FeedRow({
  c,
  active,
  landed,
  onSelect,
  mode,
}: {
  c: Candidate;
  active: boolean;
  landed: boolean;
  onSelect: () => void;
  /* "pipeline" = an applicant you advance; "market" = a Discover profile you
     shortlist (saves them into Candidates). Both label the action "Shortlist";
     the framing + icon differ. */
  mode: "pipeline" | "market";
}) {
  const market = mode === "market";
  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`flex w-full cursor-pointer items-start gap-3 border-b border-zinc-100 px-5 py-4 transition-colors last:border-b-0 ${
        active ? "bg-ofm-50/40" : "hover:bg-zinc-50/70"
      }`}
    >
      <Avatar c={c} size={36} />

      <div className="min-w-0 flex-1">
        {/* name + meta span the avatar height: name pinned to the top, meta to
            the bottom, so both edges line up with the profile picture. */}
        <div className="flex h-9 flex-col justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-ofm-body font-semibold leading-none ${
                active ? "text-ofm-900" : "text-zinc-900"
              }`}
            >
              {c.name}
            </span>
            <BadgeCheck className="size-4 shrink-0 text-ofm-500" strokeWidth={2} />
          </div>

          <div className="flex items-center gap-3 text-ofm-caption leading-none text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Briefcase
                className="size-3.5 shrink-0 -translate-y-px text-zinc-500"
                strokeWidth={1.75}
              />
              <span>
                {c.role} · {c.years}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin
                className="size-3.5 shrink-0 -translate-y-px text-zinc-500"
                strokeWidth={1.75}
              />
              <span>{c.location}</span>
            </span>
          </div>
        </div>

        <p className="mt-2 text-ofm-label leading-relaxed text-zinc-600">
          {c.summary}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <motion.span
          initial={false}
          animate={{ opacity: landed ? 1 : 0, scale: landed ? 1 : 0.8 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          <ScoreChip score={c.score} />
        </motion.span>
        {/* row actions — real Button primitives; stopPropagation so they act
            on their own instead of opening the overlay. */}
        <div
          className="flex items-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-zinc-500"
            aria-label="Message"
          >
            <MessageSquare />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-zinc-500"
            aria-label="Contact details"
          >
            <Contact />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-ofm-label font-medium text-zinc-600"
          >
            {market ? (
              <>
                <Plus />
                Shortlist
              </>
            ) : (
              <>
                Shortlist
                <ChevronDown />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── the detail drawer (overlay content) ───────────────────── */
/* which beat is driving the scene: feed = closed; trust/portable = overlay open
   on the Test result tab, with the trust or portability layer. */
export type Phase = "feed" | "trust" | "experience" | "portable";
export type Tab = "Overview" | "Experience" | "Test result";

export function CandidateDrawer({
  c,
  phase = "feed",
  demoTab = null,
}: {
  c: Candidate;
  phase?: Phase;
  /* when the scripted cursor drives the tabs (d5), the parent controls which
     tab is showing; null = the drawer picks its own from the phase. */
  demoTab?: Tab | null;
}) {
  const reduced = useReducedMotion();
  // the feed and d4 (trust) open on the rich Overview; the Experience beat opens
  // on Experience; d5 (portable) opens on the Test result tab. (When the scripted
  // cursor is driving, it starts on Overview and clicks across — see demoTab.)
  const startTab: Tab =
    phase === "portable"
      ? "Test result"
      : phase === "experience"
      ? "Experience"
      : "Overview";
  const [tab, setTab] = useState<Tab>(demoTab ?? startTab);
  const [typed, setTyped] = useState(reduced ? c.verbalWhy.length : 0);

  // land on the phase's tab (or the cursor-driven one); retype on change
  useEffect(() => setTab(demoTab ?? startTab), [c.name, startTab, demoTab]);
  useEffect(() => {
    if (reduced) {
      setTyped(c.verbalWhy.length);
      return;
    }
    setTyped(0);
    let i = 0;
    let iv: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      iv = setInterval(() => {
        i += 2;
        setTyped(i);
        if (i >= c.verbalWhy.length) clearInterval(iv);
      }, 22);
    }, 600);
    return () => {
      clearTimeout(start);
      if (iv) clearInterval(iv);
    };
  }, [reduced, c.name, c.verbalWhy]);

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* pt-4 only — the tabs form the header's true bottom edge, so the active
          underline lands exactly on the border-b (Juicebox superimposition). */}
      <div className="shrink-0 border-b border-zinc-200/70 px-5 pt-4">
        {/* identity — same anatomy as the Discover feed card: name pinned to
            the avatar's top edge, meta to its bottom, badge only (no pill). */}
        <div className="flex items-start gap-3">
          <Avatar c={c} size={44} />
          <div className="flex h-11 min-w-0 flex-1 flex-col justify-between">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-ofm-display font-semibold leading-none text-zinc-900">
                {c.name}
              </h1>
              <BadgeCheck className="size-4 shrink-0 text-ofm-500" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-3 text-ofm-caption leading-none text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Briefcase
                  className="size-3.5 shrink-0 -translate-y-px text-zinc-500"
                  strokeWidth={1.75}
                />
                <span>
                  {c.role} · {c.years}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin
                  className="size-3.5 shrink-0 -translate-y-px text-zinc-500"
                  strokeWidth={1.75}
                />
                <span>{c.location}</span>
              </span>
            </div>
          </div>

          {/* actions — same cluster as the feed row; Shortlist is the
              overlay's primary action, so it takes the filled ofm button. */}
          <div className="mt-1 flex shrink-0 items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-zinc-500"
              aria-label="Message"
            >
              <MessageSquare />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-zinc-500"
              aria-label="Contact details"
            >
              <Contact />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-ofm-label font-medium text-zinc-600"
            >
              <Plus />
              Shortlist
            </Button>
          </div>
        </div>

        {/* section switcher — Juicebox profile-detail tabs (Mobbin ref): quiet
            text tabs whose active underline sits on the header's bottom border
            and slides between sections. ToggleGroup underneath for semantics. */}
        <ToggleGroup
          value={tab}
          onValueChange={(v) => v && setTab(v as Tab)}
          className="mt-8 gap-5 rounded-none border-none bg-transparent p-0"
        >
          {(["Overview", "Experience", "Test result"] as Tab[]).map((t) => (
            <ToggleGroupItem
              key={t}
              value={t}
              className={`relative h-auto rounded-none bg-transparent px-0 pb-2.5 pt-0 text-ofm-label shadow-none transition-colors ${
                tab === t
                  ? "font-semibold text-zinc-900"
                  : "font-normal text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {t}
              {tab === t && (
                <motion.span
                  layoutId="drawer-tab-underline"
                  className="absolute inset-x-0 -bottom-px h-[2.5px] rounded-full bg-ofm-600"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <ScrollArea type="scroll" className="min-h-0 flex-1">
        {tab === "Overview" && <OverviewBasicTab c={c} />}
        {tab === "Experience" && <ExperienceTab c={c} />}
        {tab === "Test result" && <TestResultTab c={c} phase={phase} typed={typed} />}
      </ScrollArea>
    </div>
  );
}

/* quiet uppercase section eyebrow — the drawer reads as a refined dossier,
   so section labels stay small and let the content carry the weight. */
function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`text-ofm-micro font-semibold uppercase leading-none tracking-[0.1em] text-zinc-500 ${className}`}
    >
      {children}
    </h3>
  );
}

/* The signature moment of the "a score you can trust" beat. On open, each
   verified score counts up from zero and settles from OFM green to ink as it
   lands: verification, happening in front of you. The whole point of the beat
   (these numbers are earned, not typed) made visible in the one artifact the
   eye lands on. */
const OFM_GREEN = "#006E42";
function ScoreValue({
  value,
  unit,
  delay,
  reduced,
}: {
  value: number;
  unit: string;
  delay: number;
  reduced: boolean;
}) {
  const prog = useMotionValue(reduced ? 1 : 0);
  const num = useTransform(prog, (v) => Math.round(v * value));
  // hold green through the count, snap to ink only as it lands
  const color = useTransform(prog, [0, 0.82, 1], [OFM_GREEN, OFM_GREEN, "#18181b"]);

  useEffect(() => {
    if (reduced) return;
    const controls = animate(prog, 1, {
      duration: 0.75,
      delay,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [prog, value, delay, reduced]);

  return (
    <span className="flex items-baseline gap-0.5 text-ofm-title font-semibold leading-none tabular-nums">
      <motion.span style={{ color }}>{num}</motion.span>
      <span className="text-ofm-micro font-medium text-zinc-500">{unit}</span>
    </span>
  );
}

/* the candidate overview — Juicebox-style profile detail, dossier rhythm:
   About (self-written) → the verified scorecard (the trust artifact) →
   tinted highlight cards → one experience card with tenure as its footer. */
function OverviewBasicTab({ c }: { c: Candidate }) {
  const reduced = useReducedMotion();
  const langCount = c.languages.split("·").length;
  const langWord =
    langCount >= 3 ? "Trilingual" : langCount === 2 ? "Bilingual" : "Fluent";
  const scores = [
    { label: "English", value: c.english, unit: "/100" },
    { label: "Listening", value: c.listening, unit: "/100" },
    { label: "Typing", value: c.wpm, unit: "WPM" },
    { label: "Speed", value: c.mbps, unit: "Mbps" },
    { label: "Verbal", value: c.verbal, unit: "/100" },
  ];
  const highlights = [
    { icon: BadgeCheck, title: "Fully verified", sub: "Every bar cleared" },
    { icon: Award, title: c.topSkill, sub: "Top verified skill" },
    { icon: Languages, title: langWord, sub: c.languages },
  ];
  const tenure = [
    { label: "Avg tenure", value: c.tenure.avg },
    { label: "Current", value: c.tenure.current },
    { label: "Total exp.", value: c.tenure.total },
  ];
  return (
    <div className="px-5 py-5">
      {/* About — the candidate's own words; availability docks on the eyebrow
          as a tinted status pill (positive signal → ofm) */}
      <div className="flex items-center justify-between">
        <Eyebrow className="translate-y-[1px]">About</Eyebrow>
        <span className="flex h-6 items-center gap-1.5 rounded-full bg-ofm-50 px-2.5 text-ofm-caption font-medium leading-none text-ofm-700">
          <Clock className="size-3.5 -translate-y-px" strokeWidth={2} />
          <span>Open to {c.seeking.toLowerCase()} work</span>
        </span>
      </div>
      <p className="mt-2.5 text-ofm-label leading-relaxed text-zinc-600">
        {c.about}
      </p>

      {/* the verified scorecard — the beat's proof and its signature moment:
          five numbers that count up and lock in on open (see ScoreValue).
          Numbers carry it; no per-cell icons, a quiet unit anchors each. */}
      <div className="mt-6">
        <Eyebrow>Verified scores</Eyebrow>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200/70">
        <div className="grid grid-cols-5 divide-x divide-zinc-100">
          {scores.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1.5 px-1 py-3.5"
            >
              <ScoreValue
                value={s.value}
                unit={s.unit}
                delay={0.18 + i * 0.11}
                reduced={!!reduced}
              />
              <span className="text-ofm-micro leading-none text-zinc-500">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* highlights — tinted, not bordered; uniform single-line subs */}
      <div className="mt-6">
        <Eyebrow>Highlights</Eyebrow>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {highlights.map((h) => (
          <div key={h.title} className="rounded-xl bg-zinc-50 p-3">
            <h.icon className="size-4 text-ofm-600" strokeWidth={2} />
            <div className="mt-2 truncate text-ofm-label font-semibold leading-tight text-zinc-800">
              {h.title}
            </div>
            <div className="mt-0.5 truncate text-ofm-caption leading-tight text-zinc-500">
              {h.sub}
            </div>
          </div>
        ))}
      </div>

      {/* experience — one card: current role, then tenure as its footer */}
      <div className="mt-6">
        <Eyebrow>Experience</Eyebrow>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200/70">
        {/* history rows — role / org, dates right-aligned. Two-line text block
            spans the icon square exactly (same flush pattern as Test result). */}
        {c.experience.map((e, i) => (
          <div
            key={e.role + i}
            className={`flex items-start gap-3 px-4 py-3.5 ${
              i > 0 ? "border-t border-zinc-100" : ""
            }`}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
              <Briefcase className="size-5 text-zinc-500" strokeWidth={1.75} />
            </span>
            <span className="flex h-9 min-w-0 flex-1 flex-col justify-between py-px">
              <span className="block truncate text-ofm-label font-semibold leading-none text-zinc-800">
                {e.role}
              </span>
              <span className="block truncate text-ofm-caption leading-none text-zinc-500">
                {e.org}
              </span>
            </span>
            <span className="shrink-0 text-ofm-caption tabular-nums text-zinc-500">
              {e.when}
            </span>
          </div>
        ))}
        {/* tenure footer */}
        <div className="grid grid-cols-3 divide-x divide-zinc-100 border-t border-zinc-100">
          {tenure.map((t) => (
            <div key={t.label} className="px-4 py-2.5">
              <div className="text-ofm-micro font-medium uppercase tracking-[0.08em] text-zinc-500">
                {t.label}
              </div>
              <div className="mt-0.5 text-ofm-label font-semibold text-zinc-900">
                {t.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExperienceTab({ c }: { c: Candidate }) {
  const tiles = [
    { label: "Avg tenure", value: c.tenure.avg },
    { label: "Current", value: c.tenure.current },
    { label: "Total exp.", value: c.tenure.total },
  ];
  const langs = c.languages.split("·").map((l) => l.trim());
  return (
    <div className="px-5 py-5">
      {/* track record — tenure as the corroboration of the scores */}
      <Eyebrow>Track record</Eyebrow>
      <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200/70">
        <div className="grid grid-cols-3 divide-x divide-zinc-100">
          {tiles.map((t) => (
            <div key={t.label} className="px-3.5 py-3">
              <div className="text-ofm-micro font-medium uppercase tracking-[0.08em] text-zinc-500">
                {t.label}
              </div>
              <div className="mt-1 text-ofm-body font-semibold text-zinc-900">
                {t.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* the full role history */}
      <div className="mt-6">
        <Eyebrow>Work history</Eyebrow>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200/70">
        {c.experience.map((e, i) => (
          <div
            key={e.role + i}
            className={`flex items-start gap-3 px-4 py-3.5 ${
              i > 0 ? "border-t border-zinc-100" : ""
            }`}
          >
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
              <Briefcase className="size-5 text-zinc-500" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-ofm-label font-semibold leading-tight text-zinc-800">
                  {e.role}
                </span>
                <span className="shrink-0 text-ofm-caption tabular-nums text-zinc-500">
                  {e.when}
                </span>
              </div>
              <div className="mt-1 text-ofm-caption leading-tight text-zinc-500">
                {e.org} · {e.type}
              </div>
              <p className="mt-2 text-ofm-caption leading-normal text-zinc-600">
                {e.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* languages */}
      <div className="mt-6">
        <Eyebrow>Languages</Eyebrow>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {langs.map((l) => (
          <span
            key={l}
            className="rounded-full bg-zinc-50 px-2.5 py-1 text-ofm-caption text-zinc-600"
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/* a static waveform for the verbal recording player (bar heights, %) */
const WAVE = [
  34, 52, 70, 44, 86, 60, 40, 74, 96, 54, 64, 80, 48, 70, 90, 46, 60, 78, 52,
  68, 88, 42, 58, 72, 50, 62, 82, 38, 54, 66, 44, 60,
];

const fmtTime = (s: number) => {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

/* the candidate's recorded verbal answer — a real, playable clip. The waveform
   fills as it plays; the time counts down. (Krea/PlayAI voice-player pattern.) */
function VerbalPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [dur, setDur] = useState(0);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play();
    else a.pause();
  };

  const played = Math.round(progress * WAVE.length);
  const shown = playing || progress > 0 ? dur * (1 - progress) : dur;

  return (
    <div className="ml-12 mt-2.5 flex items-center gap-3 rounded-lg border border-zinc-200/70 px-3 py-2">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          setProgress(a.duration ? a.currentTime / a.duration : 0);
        }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause recorded answer" : "Play recorded answer"}
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ofm-600 text-white transition-colors hover:bg-ofm-700"
      >
        {playing ? (
          <Pause className="size-3.5" fill="currentColor" strokeWidth={0} />
        ) : (
          <Play
            className="size-3.5 translate-x-[1px]"
            fill="currentColor"
            strokeWidth={0}
          />
        )}
      </button>
      <div className="flex h-5 flex-1 items-center justify-between">
        {WAVE.map((h, k) => (
          <span
            key={k}
            className={`w-[3px] rounded-full transition-colors ${
              k < played ? "bg-ofm-600" : "bg-zinc-200"
            }`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <span className="shrink-0 text-ofm-caption tabular-nums text-zinc-500">
        {fmtTime(shown)}
      </span>
    </div>
  );
}

/* the d5 hero: one portable "verified score" as a ring.
   The single number that travels job to job — the whole point of the beat.
   pathLength normalizes the circle to 1 so the fill is exact and reliable. */
function ScoreRing({ value }: { value: number }) {
  return (
    <div className="relative size-[60px] shrink-0">
      <svg viewBox="0 0 72 72" className="size-full -rotate-90">
        <circle
          cx="36"
          cy="36"
          r="30"
          fill="none"
          strokeWidth="7"
          className="stroke-ofm-100"
        />
        <circle
          cx="36"
          cy="36"
          r="30"
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          className="stroke-ofm-600"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - value / 100}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center leading-none">
        <span className="text-ofm-title font-semibold tabular-nums text-zinc-900">
          {value}
        </span>
      </div>
    </div>
  );
}

function TestResultTab({
  c,
  phase,
  typed,
}: {
  c: Candidate;
  phase: Phase;
  typed: number;
}) {
  const reduced = useReducedMotion();
  const trust = phase === "trust";
  const portable = phase === "portable";

  // d4 "highlighting frame" — a frame sweeps down through each result in turn,
  // then clears (−2 = settled / no highlight).
  const [lit, setLit] = useState(-2);
  useEffect(() => {
    if (!trust || reduced) {
      setLit(-2);
      return;
    }
    setLit(-1);
    const ts = TESTS.map((_, i) => setTimeout(() => setLit(i), 450 + i * 620));
    const done = setTimeout(() => setLit(-2), 450 + TESTS.length * 620 + 250);
    return () => {
      ts.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [trust, reduced, c.name]);

  return (
    <div className="px-5 py-5">
      <Eyebrow>{portable ? "Verified profile" : "Verified test results"}</Eyebrow>

      {/* d5 hero — the one portable verified score, front and center */}
      {portable && (
        <div className="mt-3 flex items-center gap-4 rounded-xl border border-ofm-100 bg-ofm-50/40 p-4">
          <div className="flex h-[60px] min-w-0 flex-1 flex-col justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-ofm-title font-semibold leading-none text-zinc-900">
                Fully verified
              </span>
              <BadgeCheck
                className="size-[18px] shrink-0 text-ofm-600"
                strokeWidth={2}
              />
            </div>
            <p className="text-ofm-label leading-snug text-zinc-500">
              Five skills, each earned on {c.pn === "she" ? "her" : "his"} own
              time. One score, carried from job to job.
            </p>
          </div>
          <ScoreRing value={c.score} />
        </div>
      )}

      {portable && (
        <div className="mt-6">
          <Eyebrow>By skill</Eyebrow>
        </div>
      )}
      <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200/70">
        {TESTS.map((t, i) => {
          const ai = t.method === "AI-scored";
          const isLit = trust && lit === i;
          const isSpeed = t.label === "Internet speed";
          return (
            <div
              key={t.label}
              className={`px-4 py-3.5 transition-colors duration-300 ${
                i > 0 ? "border-t border-zinc-100" : ""
              } ${isLit ? "bg-ofm-50/60" : ""}`}
            >
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ofm-50">
                  <t.icon className="size-5 text-ofm-600" strokeWidth={1.75} />
                </span>
                <div
                  className={`flex h-9 min-w-0 flex-1 flex-col py-px ${
                    portable || trust ? "justify-between" : "justify-center"
                  }`}
                >
                  <span className="block truncate text-ofm-body font-medium leading-none text-zinc-800">
                    {t.label}
                  </span>
                  {portable && (
                    <span className="block truncate text-ofm-caption leading-none text-zinc-500">
                      Verified {EARNED[t.label]}
                    </span>
                  )}
                  {trust && (
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-ofm-caption">
                      <span className="text-zinc-500">Bar {PASS_MARK[t.label]}</span>
                      <span className="flex items-center gap-1 font-medium text-ofm-700">
                        <Check className="size-3" strokeWidth={3} />
                        cleared
                      </span>
                      {isSpeed && (
                        <span className="flex h-5 items-center rounded-full bg-amber-50 px-2 text-ofm-micro font-medium leading-none text-amber-700">
                          1st reading flagged · retaken
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <span className="shrink-0 text-ofm-body font-semibold tabular-nums text-zinc-900">
                  {t.value(c)}
                </span>
              </div>

              {ai && (
                <>
                  {/* the candidate's recorded verbal answer — a real clip */}
                  <VerbalPlayer src="/verbal-sample.m4a" />
                  <p className="ml-12 mt-2 rounded-lg bg-zinc-50 px-3 py-2 text-ofm-caption leading-relaxed text-zinc-600">
                    <span className="font-medium text-zinc-700">Why:</span>{" "}
                    {c.verbalWhy.slice(0, typed)}
                    {typed < c.verbalWhy.length && (
                      <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-ofm-600" />
                    )}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

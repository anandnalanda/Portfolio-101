"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Project shelf — modern Apple Books aesthetic with a warm nod.
 * Swap the BOOKS array for real projects. Give a book an `href` to make it
 * navigate on click; without one it still lifts on hover.
 */
type Book = {
  label: string; // supports \n for a two-line spine label
  from: string;
  to: string;
  href?: string;
};

const BOOKS: Book[][] = [
  [
    { label: "Staple\nChat", from: "#6D7BFF", to: "#3A46C7", href: "/staple-chat" },
    { label: "Staple\nTables", from: "#2FC08A", to: "#148A63", href: "/staple-tables" },
    { label: "Kanban\nAI", from: "#FFA24B", to: "#EF7A1E", href: "/kanban-and-ai" },
  ],
  [
    { label: "OFM\nJobs", from: "#FF6E8E", to: "#E23E63", href: "/ofm-jobs-tests" },
    { label: "Arc\nCarousel", from: "#33C7D6", to: "#159BAB", href: "/arc-carousel-demo" },
    { label: "Play\nground", from: "#A879FF", to: "#7A3FE0" },
  ],
  [
    { label: "In\nProgress", from: "#8E97A6", to: "#5B6472" },
    { label: "Coming\nSoon", from: "#B0A38F", to: "#8A7C64" },
    { label: "New\nIdea", from: "#7FB0FF", to: "#4F82E0" },
  ],
];

const BOOK_W = 66;
const BOOK_H = 92;

function Cover({ book }: { book: Book }) {
  const body = (
    <>
      {/* contact shadow — stays seated on the ledge while the cover lifts */}
      <span
        className="absolute left-1/2 -translate-x-1/2 rounded-[50%] blur-[3px] transition-all duration-300 ease-out group-hover/book:opacity-70 group-hover/book:w-[74%]"
        style={{
          bottom: -3,
          width: "84%",
          height: 6,
          background: "rgba(60,45,25,0.28)",
        }}
      />
      {/* cover */}
      <span
        className="absolute inset-0 overflow-hidden transition-all duration-300 ease-out will-change-transform group-hover/book:-translate-y-[8px]"
        style={{
          borderRadius: "2px 5px 5px 2px",
          background: `linear-gradient(135deg, ${book.from}, ${book.to})`,
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.22), inset 0 0 0 0.5px rgba(255,255,255,0.12)",
        }}
      >
        {/* spine shadow (bound edge) */}
        <span
          className="absolute inset-y-0 left-0"
          style={{
            width: 5,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.30), rgba(0,0,0,0.06) 60%, transparent)",
          }}
        />
        {/* page edge (right) */}
        <span
          className="absolute inset-y-[3px] right-0"
          style={{
            width: 2.5,
            background:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.55) 0 0.6px, rgba(0,0,0,0.08) 0.6px 1.2px)",
          }}
        />
        {/* top-left sheen */}
        <span
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.30), rgba(255,255,255,0) 42%)",
          }}
        />
        {/* small abstract mark */}
        <span
          className="absolute rounded-full"
          style={{
            top: 9,
            left: 11,
            width: 12,
            height: 12,
            border: "1.5px solid rgba(255,255,255,0.45)",
          }}
        />
        {/* label */}
        <span
          className="absolute left-0 right-0 px-1.5 text-center font-semibold text-white/95 whitespace-pre-line leading-[1.05]"
          style={{ bottom: 8, fontSize: 8.5, letterSpacing: "0.01em" }}
        >
          {book.label}
        </span>
      </span>
    </>
  );

  const shell = "group/book relative block";
  const style = { width: BOOK_W, height: BOOK_H };

  return book.href ? (
    <Link href={book.href} className={shell} style={style} aria-label={book.label.replace("\n", " ")}>
      {body}
    </Link>
  ) : (
    <div className={shell} style={style}>
      {body}
    </div>
  );
}

function Shelf({ books }: { books: Book[] }) {
  return (
    <div className="relative">
      <div className="flex items-end justify-center gap-[10px]">
        {books.map((b, i) => (
          <Cover key={i} book={b} />
        ))}
      </div>
      {/* warm ledge the books rest on */}
      <div
        className="mx-3 mt-[3px] rounded-[2px]"
        style={{
          height: 7,
          background: "linear-gradient(to bottom, #F5EEE1, #E6DAC6)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.7), 0 7px 11px -5px rgba(120,92,52,0.28)",
        }}
      />
    </div>
  );
}

export default function ExperimentsCard() {
  return (
    <div className="row-span-2">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={{
          hidden: { opacity: 0, y: 12 },
          show: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
              when: "beforeChildren",
              staggerChildren: 0.05,
            },
          },
        }}
        className="bg-white rounded-card border-2 border-surface-border overflow-hidden relative h-full"
      >
        {/* shelves — evenly distributed above the label */}
        <div className="absolute top-0 left-0 right-0 bottom-[92px] flex flex-col justify-evenly px-2">
          {BOOKS.map((row, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              <Shelf books={row} />
            </motion.div>
          ))}
        </div>

        {/* label */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-10 bg-gradient-to-t from-white via-white/90 to-transparent">
          <h3 className="text-[14px] font-semibold text-txt-heading leading-tight">
            Experiments with AI
          </h3>
          <p className="text-[12px] text-txt-secondary mt-0.5 leading-snug">
            Products built with AI, from concept to shipped.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

export default function LaptopCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{}}
      className="col-span-2 row-span-2 bg-white rounded-card border-2 border-surface-border overflow-hidden relative cursor-pointer"
    >
      <svg
        viewBox="0 0 540 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Top-right corner decoration */}
        <g transform="translate(420, -20) rotate(15)">
          <rect x="0" y="0" width="140" height="100" rx="8" fill="#e8f5e9" stroke="#c8e6c9" strokeWidth="0.5" />
          <rect x="10" y="10" width="120" height="75" rx="4" fill="#f1f8e9" />
        </g>

        {/* Main laptop - centered, slightly rotated */}
        <g transform="translate(270, 210) rotate(-5)">
          {/* Laptop screen bezel */}
          <rect x="-155" y="-110" width="310" height="195" rx="10" fill="#e8f5e9" stroke="#c8e6c9" strokeWidth="1" />

          {/* Screen */}
          <rect x="-140" y="-98" width="280" height="170" rx="4" fill="white" stroke="#e0e0e0" strokeWidth="0.5" />

          {/* Browser chrome */}
          <rect x="-140" y="-98" width="280" height="22" rx="4" fill="#f5f5f5" />
          <circle cx="-126" cy="-87" r="3" fill="#e0e0e0" />
          <circle cx="-116" cy="-87" r="3" fill="#e0e0e0" />
          <circle cx="-106" cy="-87" r="3" fill="#e0e0e0" />

          {/* Green logo dot */}
          <circle cx="-120" cy="-64" r="6" fill="#4caf50" />

          {/* Nav bar elements */}
          <rect x="-100" y="-68" width="40" height="6" rx="2" fill="#e0e0e0" />
          <rect x="-50" y="-68" width="30" height="6" rx="2" fill="#e0e0e0" />
          <rect x="80" y="-68" width="50" height="8" rx="4" fill="#4caf50" />

          {/* Content blocks */}
          <rect x="-120" y="-46" width="100" height="8" rx="2" fill="#e0e0e0" />
          <rect x="-120" y="-32" width="70" height="6" rx="2" fill="#eeeeee" />

          {/* Image placeholders */}
          <rect x="-10" y="-50" width="60" height="45" rx="4" fill="#e0e0e0" />
          <rect x="60" y="-50" width="60" height="45" rx="4" fill="#bdbdbd" />

          {/* Bottom content */}
          <rect x="-120" y="10" width="80" height="6" rx="2" fill="#e0e0e0" />
          <rect x="-120" y="22" width="60" height="6" rx="2" fill="#eeeeee" />
          <rect x="-120" y="40" width="50" height="8" rx="4" fill="#4caf50" />
          <rect x="-10" y="10" width="130" height="55" rx="4" fill="#eeeeee" />

          {/* Laptop base */}
          <path d="-170,88 L170,88 L180,95 Q180,100 175,100 L-175,100 Q-180,100 -180,95 Z" fill="#e8e8e8" />
          <rect x="-170" y="85" width="340" height="10" rx="2" fill="#e8e8e8" />
          <rect x="-40" y="87" width="80" height="4" rx="2" fill="#d5d5d5" />
        </g>

        {/* Up/down arrows - left side */}
        <g transform="translate(42, 320)">
          <rect x="-18" y="-30" width="36" height="60" rx="18" fill="white" stroke="#e0e0e0" strokeWidth="1" />
          <path d="M0,-15 L-6,-8 L6,-8 Z" fill="#bdbdbd" />
          <path d="M0,15 L-6,8 L6,8 Z" fill="#bdbdbd" />
        </g>

        {/* Bottom-right laptop - angled, partially visible */}
        <g transform="translate(400, 440) rotate(-8)">
          <rect x="-120" y="-80" width="240" height="150" rx="8" fill="#e8f5e9" stroke="#c8e6c9" strokeWidth="0.75" />
          <rect x="-108" y="-70" width="216" height="125" rx="4" fill="white" stroke="#e0e0e0" strokeWidth="0.5" />

          {/* Browser chrome */}
          <rect x="-108" y="-70" width="216" height="18" rx="4" fill="#f5f5f5" />

          {/* Content lines */}
          <rect x="-90" y="-40" width="80" height="5" rx="1.5" fill="#e0e0e0" />
          <rect x="-90" y="-30" width="60" height="4" rx="1.5" fill="#eeeeee" />
          <rect x="-90" y="-18" width="40" height="4" rx="1.5" fill="#eeeeee" />

          {/* Green dots */}
          <circle cx="-90" cy="0" r="4" fill="#4caf50" />
          <rect x="-80" y="-2" width="50" height="4" rx="1.5" fill="#e0e0e0" />

          {/* Table lines */}
          <line x1="-90" y1="14" x2="90" y2="14" stroke="#eeeeee" strokeWidth="0.5" />
          <line x1="-90" y1="24" x2="90" y2="24" stroke="#eeeeee" strokeWidth="0.5" />
          <line x1="-90" y1="34" x2="90" y2="34" stroke="#eeeeee" strokeWidth="0.5" />
          <rect x="60" y="40" width="30" height="6" rx="2" fill="#4caf50" />

          {/* Laptop base */}
          <rect x="-130" y="68" width="260" height="8" rx="2" fill="#e8e8e8" />
        </g>
      </svg>
    </motion.div>
  );
}

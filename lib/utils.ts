import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/* tailwind-merge doesn't know the custom OFM type scale, so by default it
   misclassifies `text-ofm-*` as colors — a size + a color class in the same
   list would cancel each other out. Registering them as font-size classes
   makes cn() merge them correctly everywhere. */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "ofm-micro",
            "ofm-caption",
            "ofm-label",
            "ofm-body",
            "ofm-title",
            "ofm-display",
            "ofm-hero",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

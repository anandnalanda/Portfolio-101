import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/* A native <select> styled to match the Kibo Input, with a chevron affordance.
   Dependency-free (the project doesn't ship @radix-ui/react-select), fills its
   container so it aligns cleanly with Input in form grids. */
const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-9 w-full cursor-pointer appearance-none rounded-md border border-input bg-transparent pl-3 pr-8 text-ofm-body text-foreground shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
        strokeWidth={2}
      />
    </div>
  )
)
Select.displayName = "Select"

export { Select }

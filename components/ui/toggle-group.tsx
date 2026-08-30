"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* Dependency-free single-select toggle group in the shadcn idiom (the project
   doesn't ship @radix-ui/react-toggle-group). Renders as a segmented control. */

type ToggleGroupContextValue = {
  value?: string
  onValueChange?: (value: string) => void
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({})

export interface ToggleGroupProps
  extends Omit<React.ComponentProps<"div">, "onChange"> {
  value?: string
  onValueChange?: (value: string) => void
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => (
    <ToggleGroupContext.Provider value={{ value, onValueChange }}>
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex w-fit items-center rounded-lg border border-border bg-muted/40 p-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  )
)
ToggleGroup.displayName = "ToggleGroup"

export interface ToggleGroupItemProps
  extends React.ComponentProps<"button"> {
  value: string
}

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const ctx = React.useContext(ToggleGroupContext)
    const on = ctx.value === value
    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={on}
        data-state={on ? "on" : "off"}
        onClick={() => ctx.onValueChange?.(value)}
        className={cn(
          "whitespace-nowrap rounded-md px-3.5 py-1.5 text-ofm-label font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
          on
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
ToggleGroupItem.displayName = "ToggleGroupItem"

export { ToggleGroup, ToggleGroupItem }

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:focus:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          // Light → dark text | Dark → white text
          "border-transparent bg-slate-900 text-white hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80",

        secondary:
          // Light → dark text | Dark → white text with better contrast
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-800/80",

        destructive:
          // Red badge improved for dark mode
          "border-transparent bg-red-500 text-white hover:bg-red-500/80 dark:bg-red-700 dark:text-white dark:hover:bg-red-700/80",

        outline:
          // Better readability for outline mode
          "border-slate-300 text-slate-900 dark:border-slate-700 dark:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants }

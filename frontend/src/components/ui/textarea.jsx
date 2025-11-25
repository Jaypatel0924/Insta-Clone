import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm",
        "bg-white text-slate-900 border-slate-300 placeholder:text-slate-500",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ring-offset-white",

        // 🌙 Improved Dark Mode
        "dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700",
        "dark:placeholder:text-slate-400",
        "dark:focus-visible:ring-slate-300 dark:ring-offset-slate-900",

        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",

        className
      )}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }

import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border px-3 py-2 text-sm",
        "bg-white text-slate-900 border-slate-300 placeholder:text-slate-500",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ring-offset-white",

        // 🌙 Dark Mode Improvements
        "dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700",
        "dark:placeholder:text-slate-400",
        "dark:focus-visible:ring-slate-300 dark:ring-offset-slate-900",

        // Disabled Styles
        "disabled:cursor-not-allowed disabled:opacity-50",

        className
      )}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }

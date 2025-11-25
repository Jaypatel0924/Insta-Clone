import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { cn } from "@/lib/utils"   // <-- FIXED

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: cn(
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-300 group-[.toaster]:shadow-lg",
            "dark:group-[.toaster]:bg-slate-900 dark:group-[.toaster]:text-slate-100 dark:group-[.toaster]:border-slate-700"
          ),
          description:
            "group-[.toast]:text-slate-600 dark:group-[.toast]:text-slate-300",
          actionButton: cn(
            "group-[.toast]:bg-slate-900 group-[.toast]:text-white",
            "dark:group-[.toast]:bg-slate-100 dark:group-[.toast]:text-slate-900"
          ),
          cancelButton: cn(
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-600",
            "dark:group-[.toast]:bg-slate-800 dark:group-[.toast]:text-slate-300"
          ),
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

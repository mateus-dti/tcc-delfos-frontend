import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuContent = DropdownMenuPrimitive.Content
const DropdownMenuItem = DropdownMenuPrimitive.Item

const DropdownMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string
    value?: string
  }
>(({ className, label, value, ...props }, ref) => (
  <DropdownMenuTrigger asChild>
    <button
      ref={ref}
      className={cn(
        "flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
        className
      )}
      {...props}
    >
      <span className="text-slate-800 dark:text-slate-300 text-sm font-medium leading-normal">
        {label}
      </span>
      <span className="material-symbols-outlined text-xl text-slate-500 dark:text-slate-400">
        arrow_drop_down
      </span>
    </button>
  </DropdownMenuTrigger>
))
DropdownMenuButton.displayName = "DropdownMenuButton"

const DropdownMenuContentWrapper = React.forwardRef<
  React.ElementRef<typeof DropdownMenuContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuContent>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white dark:bg-slate-800 p-1 text-slate-950 dark:text-slate-50 shadow-md",
      className
    )}
    {...props}
  >
    {children}
  </DropdownMenuContent>
))
DropdownMenuContentWrapper.displayName = DropdownMenuContent.displayName

const DropdownMenuItemWrapper = React.forwardRef<
  React.ElementRef<typeof DropdownMenuItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuItem> & {
    selected?: boolean
  }
>(({ className, selected, children, ...props }, ref) => (
  <DropdownMenuItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 dark:focus:bg-slate-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    {selected && <Check className="mr-2 h-4 w-4" />}
    {children}
  </DropdownMenuItem>
))
DropdownMenuItemWrapper.displayName = DropdownMenuItem.displayName

export {
  DropdownMenu,
  DropdownMenuButton,
  DropdownMenuContentWrapper as DropdownMenuContent,
  DropdownMenuItemWrapper as DropdownMenuItem,
}


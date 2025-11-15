import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
      variants: {
        variant: {
          default: "bg-primary/10 text-primary dark:bg-primary/20",
          success: "bg-green-500/10 text-green-400 dark:bg-green-500/20",
          warning: "bg-yellow-500/10 text-yellow-400 dark:bg-yellow-500/20",
          destructive: "bg-red-500/10 text-red-400 dark:bg-red-500/20",
        },
      },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <div
          className={cn(
            "h-2 w-2 rounded-full mr-1.5",
            variant === "success" && "bg-green-500",
            variant === "warning" && "bg-yellow-500",
            variant === "destructive" && "bg-red-500",
            variant === "default" && "bg-gray-500"
          )}
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }


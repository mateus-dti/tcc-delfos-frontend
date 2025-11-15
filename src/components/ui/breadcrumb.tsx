import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex flex-wrap gap-2 mb-4", className)} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        
        return (
          <React.Fragment key={index}>
            {isLast ? (
              <span className="text-slate-600 dark:text-[#9db0b9] text-base font-medium leading-normal">
                {item.label}
              </span>
            ) : (
              <>
                <Link
                  to={item.href || '#'}
                  className="text-slate-600 dark:text-[#9db0b9] text-base font-medium leading-normal hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
                <ChevronRight className="h-4 w-4 text-slate-600 dark:text-[#9db0b9]" />
              </>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}


import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: string
  active?: boolean
}

export function Sidebar() {
  const location = useLocation()

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { label: 'Data Collections', href: '/collections', icon: 'folder' },
    { label: 'Data Sources', href: '/data-sources', icon: 'database' },
    { label: 'Query', href: '/query', icon: 'code' },
    { label: 'Settings', href: '/settings', icon: 'settings' },
  ]

  return (
    <aside className="flex w-64 flex-col bg-white/5 dark:bg-background-dark/30 p-4 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-full bg-primary/10">
            <span className="material-symbols-outlined text-primary text-2xl">database</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal">
              Delfos
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
              Data Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = item.active || location.pathname === item.href
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <span 
                className="material-symbols-outlined text-2xl"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <p className={cn(
                "text-sm leading-normal",
                isActive ? "font-bold" : "font-medium"
              )}>
                {item.label}
              </p>
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="flex flex-col gap-2">
        <Button className="w-full h-10 bg-primary hover:bg-primary/90 text-white text-sm font-bold">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Query
        </Button>
        <Link
          to="/profile"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">account_circle</span>
          <p className="text-sm font-medium leading-normal">Profile</p>
        </Link>
      </div>
    </aside>
  )
}


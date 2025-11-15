import { Moon, Sun } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="flex items-center gap-3">
      <Sun className={`h-4 w-4 transition-colors ${isDark ? 'text-slate-400' : 'text-yellow-500'}`} />
      <Switch
        checked={isDark}
        onCheckedChange={() => toggleTheme()}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      />
      <Moon className={`h-4 w-4 transition-colors ${isDark ? 'text-blue-400' : 'text-slate-400'}`} />
    </div>
  )
}


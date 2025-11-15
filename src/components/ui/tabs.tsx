import * as React from "react"
import { cn } from "@/lib/utils"

export interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

export interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
}>({
  value: '',
  onValueChange: () => {},
})

export function Tabs({ defaultValue = '', value: controlledValue, onValueChange, children, className }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const value = controlledValue !== undefined ? controlledValue : internalValue
  
  const handleValueChange = React.useCallback((newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }, [controlledValue, onValueChange])

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn("flex flex-col", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={cn("border-b border-slate-200 dark:border-[#374151]", className)}>
      <nav aria-label="Tabs" className="flex gap-6 -mb-px">
        {children}
      </nav>
    </div>
  )
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext)
  const isActive = selectedValue === value

  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={cn(
        "shrink-0 border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
        isActive
          ? "border-primary text-primary font-semibold"
          : "border-transparent text-slate-600 dark:text-[#9db0b9] hover:border-gray-300 dark:hover:border-gray-500 hover:text-slate-900 dark:hover:text-[#E0E0E0]",
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { value: selectedValue } = React.useContext(TabsContext)
  
  if (selectedValue !== value) {
    return null
  }

  return (
    <div className={cn("pt-8", className)}>
      {children}
    </div>
  )
}


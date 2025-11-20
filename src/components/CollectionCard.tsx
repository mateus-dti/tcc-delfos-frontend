import { Collection, CollectionStatus } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Database, User, Clock, Eye, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollectionCardProps {
  collection: Collection
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const statusConfig: Record<CollectionStatus, { variant: 'success' | 'warning' | 'destructive', label: string }> = {
  active: { variant: 'success', label: 'Active' },
  indexing: { variant: 'warning', label: 'Indexing' },
  error: { variant: 'destructive', label: 'Error' },
}

export function CollectionCard({ collection, onView, onEdit, onDelete }: CollectionCardProps) {
  const status = statusConfig[collection.status || 'active']
  const owner = typeof collection.owner === 'string' 
    ? collection.owner 
    : collection.owner?.username || 'Unknown'

  return (
    <div className="flex flex-col bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <div className="p-5">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">
            {collection.name}
          </h3>
          <Badge variant={status.variant} dot>
            {status.label}
          </Badge>
        </div>
        {collection.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {collection.description}
          </p>
        )}
      </div>

      <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700/50 flex flex-col gap-3 text-sm">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <Database className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          <span>
            <span className="font-semibold">{collection.dataSourcesCount || 0}</span> Data Sources
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          <span>Owner: {owner}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <Clock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          <span>Last Scan: {collection.lastScan || 'Never'}</span>
        </div>
      </div>

      <div className="p-3 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView?.(collection.id)}
          className="h-9 w-9 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <Eye className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit?.(collection.id)}
          className="h-9 w-9 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <Pencil className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete?.(collection.id)}
          className="h-9 w-9 text-red-500/80 hover:bg-red-500/10"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}


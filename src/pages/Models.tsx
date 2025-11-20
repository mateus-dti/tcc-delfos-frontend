import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { modelService, Model, ModelsResponse, ModelOrigin } from '@/services/modelService'
import { 
  Search, 
  RefreshCw, 
  Filter, 
  Database,
  AlertCircle,
  Info,
  Cloud,
  Server
} from 'lucide-react'

/**
 * Página para listar modelos de IA
 * RF04.1 - Listar Modelos Públicos
 */
export default function Models() {
  const [models, setModels] = useState<Model[]>([])
  const [filteredModels, setFilteredModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all')
  const [response, setResponse] = useState<ModelsResponse | null>(null)

  useEffect(() => {
    loadModels()
  }, [])

  useEffect(() => {
    filterModels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [models, searchTerm, selectedOrigin])

  const loadModels = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await modelService.getModels()
      
      setModels(response.models)
      setResponse(response)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar modelos'
      setError(errorMessage)
      console.error('Erro ao carregar modelos:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterModels = () => {
    let filtered = [...models]

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por origem
    if (selectedOrigin !== 'all') {
      filtered = filtered.filter(model => model.origin === selectedOrigin)
    }

    // Ordenar por nome
    filtered = modelService.sortByName(filtered, true)

    setFilteredModels(filtered)
  }

  const handleRefresh = () => {
    loadModels()
  }

  const getOriginBadgeVariant = (origin: ModelOrigin): "default" | "destructive" | "success" | "warning" => {
    return origin === 'OpenRouter' ? 'default' : 'warning'
  }

  const getOriginIcon = (origin: ModelOrigin) => {
    return origin === 'OpenRouter' ? (
      <Cloud className="mr-1 h-3 w-3" />
    ) : (
      <Server className="mr-1 h-3 w-3" />
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-[#0d1b21]">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
              AI Models
            </h1>
            {response && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Database className="h-4 w-4" />
                <span>{response.total} models</span>
              </div>
            )}
          </div>
          <ThemeToggle />
        </header>

        {/* Filters & Actions */}
        <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-[#0d1b21]">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search models by name, identifier or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Origin Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-[#1a2831] dark:text-slate-300"
            >
              <option value="all">All Origins</option>
              <option value="OpenRouter">OpenRouter</option>
              <option value="Internal">Internal</option>
            </select>
          </div>

          {/* Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {loading && !models.length ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                  Loading models...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center max-w-md">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-white">
                  Error Loading Models
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {error}
                </p>
                <Button onClick={() => loadModels()} className="mt-4">
                  Try Again
                </Button>
              </div>
            </div>
          ) : filteredModels.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Info className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-white">
                  No Models Found
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Try adjusting your filters or search term
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0d1b21]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Identifier</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModels.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 dark:text-white">
                            {model.name}
                          </span>
                          {model.description && (
                            <span className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                              {model.description}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                          {model.identifier}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getOriginBadgeVariant(model.origin)} className="capitalize">
                          {getOriginIcon(model.origin)}
                          {model.origin}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {model.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-xs text-slate-600 dark:text-slate-400">
                        {new Date(model.updatedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { Pagination } from '@/components/ui/pagination'
import {
  DropdownMenu,
  DropdownMenuButton,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { dataSourceService } from '@/services/dataSourceService'
import { DataSource, DataSourceStatus, DataSourceType } from '@/types'
import { Search, Plus, Eye, Pencil, Trash2, MoreVertical } from 'lucide-react'

const statusConfig: Record<DataSourceStatus, { variant: 'success' | 'warning' | 'destructive' | 'default', label: string, dotColor?: string }> = {
  active: { variant: 'success', label: 'Active' },
  error: { variant: 'destructive', label: 'Error' },
  disabled: { variant: 'default', label: 'Disabled', dotColor: 'bg-gray-500' },
  pending: { variant: 'warning', label: 'Pending' },
}

export default function DataSources() {
  const navigate = useNavigate()
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [filteredDataSources, setFilteredDataSources] = useState<DataSource[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [collectionFilter, setCollectionFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  useEffect(() => {
    loadDataSources()
  }, [currentPage])

  useEffect(() => {
    filterDataSources()
  }, [dataSources, searchQuery, typeFilter, collectionFilter, statusFilter])

  const loadDataSources = async () => {
    try {
      setLoading(true)
      const result = await dataSourceService.getAll(currentPage, itemsPerPage)
      setDataSources(result.data)
      setTotalItems(result.total)
    } catch (error) {
      console.error('Error loading data sources:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterDataSources = () => {
    let filtered = [...dataSources]

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(ds =>
        ds.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(ds => ds.type === typeFilter)
    }

    // Filtro por collection
    if (collectionFilter !== 'all') {
      filtered = filtered.filter(ds => ds.collection === collectionFilter)
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ds => ds.status === statusFilter)
    }

    setFilteredDataSources(filtered)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setTypeFilter('all')
    setCollectionFilter('all')
    setStatusFilter('all')
  }

  const handleView = (id: string) => {
    navigate(`/data-sources/${id}`)
  }

  const handleEdit = (id: string) => {
    navigate(`/data-sources/${id}/edit`)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this data source?')) {
      try {
        await dataSourceService.delete(id)
        await loadDataSources()
      } catch (error) {
        console.error('Error deleting data source:', error)
      }
    }
  }

  const handleCreateDataSource = () => {
    navigate('/data-sources/new')
  }

  // Obter listas únicas para filtros
  const types = Array.from(new Set(dataSources.map(ds => ds.type)))
  const collections = Array.from(new Set(dataSources.map(ds => ds.collection)))

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <header className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Data Sources
              </h1>
              <p className="text-slate-500 dark:text-gray-400 mt-1 max-w-xl">
                This is a global overview of all data sources available. To add a new data source to a specific collection, please navigate to that collection's details page.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <Button
                onClick={handleCreateDataSource}
                className="h-10 px-4 bg-primary hover:bg-primary/90 text-white border-0 gap-2"
              >
                <Plus className="h-5 w-5" />
                <span className="truncate">New Data Source</span>
              </Button>
            </div>
          </header>

          {/* Search and Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4 p-4 bg-white dark:bg-white/5 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/10">
            {/* Search */}
            <div className="flex-1">
              <div className="flex w-full items-stretch rounded-lg h-12 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus-within:ring-2 focus-within:ring-primary/50">
                <div className="text-slate-400 dark:text-gray-400 flex items-center justify-center pl-4">
                  <Search className="h-5 w-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Search by source name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-r-lg border-0 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-400 focus-visible:ring-0 h-full"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 overflow-x-auto">
              <DropdownMenu>
                <DropdownMenuButton label={`Type${typeFilter !== 'all' ? `: ${typeFilter}` : ''}`} />
                <DropdownMenuContent>
                  <DropdownMenuItem
                    selected={typeFilter === 'all'}
                    onClick={() => setTypeFilter('all')}
                  >
                    All Types
                  </DropdownMenuItem>
                  {types.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      selected={typeFilter === type}
                      onClick={() => setTypeFilter(type)}
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuButton label={`Collection${collectionFilter !== 'all' ? `: ${collectionFilter}` : ''}`} />
                <DropdownMenuContent>
                  <DropdownMenuItem
                    selected={collectionFilter === 'all'}
                    onClick={() => setCollectionFilter('all')}
                  >
                    All Collections
                  </DropdownMenuItem>
                  {collections.map((collection) => (
                    <DropdownMenuItem
                      key={collection}
                      selected={collectionFilter === collection}
                      onClick={() => setCollectionFilter(collection)}
                    >
                      {collection}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuButton label={`Status${statusFilter !== 'all' ? `: ${statusFilter}` : ''}`} />
                <DropdownMenuContent>
                  <DropdownMenuItem
                    selected={statusFilter === 'all'}
                    onClick={() => setStatusFilter('all')}
                  >
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    selected={statusFilter === 'active'}
                    onClick={() => setStatusFilter('active')}
                  >
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    selected={statusFilter === 'error'}
                    onClick={() => setStatusFilter('error')}
                  >
                    Error
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    selected={statusFilter === 'disabled'}
                    onClick={() => setStatusFilter('disabled')}
                  >
                    Disabled
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    selected={statusFilter === 'pending'}
                    onClick={() => setStatusFilter('pending')}
                  >
                    Pending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="h-12 px-4 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:bg-black/20">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-slate-500 dark:text-gray-400">Loading data sources...</p>
                </div>
              ) : filteredDataSources.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-slate-500 dark:text-gray-400">No data sources found</p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Collection</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Scan</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDataSources.map((dataSource) => {
                        const status = statusConfig[dataSource.status]
                        return (
                          <TableRow key={dataSource.id}>
                            <TableCell className="font-medium text-slate-900 dark:text-white">
                              {dataSource.name}
                            </TableCell>
                            <TableCell className="text-slate-600 dark:text-gray-300">
                              {dataSource.type}
                            </TableCell>
                            <TableCell className="text-slate-600 dark:text-gray-300">
                              {dataSource.collection}
                            </TableCell>
                            <TableCell>
                              <Badge variant={status.variant} dot>
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-600 dark:text-gray-300">
                              {dataSource.lastScan}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleView(dataSource.id)}
                                  className="h-8 w-8 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                                  title="View"
                                >
                                  <Eye className="h-5 w-5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(dataSource.id)}
                                  className="h-8 w-8 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                                  title="Edit"
                                >
                                  <Pencil className="h-5 w-5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(dataSource.id)}
                                  className="h-8 w-8 text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10"
                                  title="Delete"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                                  title="More"
                                >
                                  <MoreVertical className="h-5 w-5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { collectionService } from '@/services/collectionService'
import { dataSourceService } from '@/services/dataSourceService'
import { Collection, DataSource } from '@/types'
import { Plus, Edit, Trash2, Sparkles, TableRows } from 'lucide-react'

type TabValue = 'general' | 'data-sources' | 'relationships' | 'model-preferences'

const dataSourceStatusConfig: Record<string, { variant: 'success' | 'warning' | 'destructive', label: string }> = {
  'active': { variant: 'success', label: 'Connected' },
  'connected': { variant: 'success', label: 'Connected' },
  'syncing': { variant: 'warning', label: 'Syncing...' },
  'pending': { variant: 'warning', label: 'Syncing...' },
  'error': { variant: 'destructive', label: 'Error' },
}

export default function CollectionDetails() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<TabValue>('data-sources')
  const [collection, setCollection] = useState<Collection | null>(null)
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadCollection(id)
      loadDataSources(id)
    }
  }, [id])

  const loadCollection = async (collectionId: string) => {
    try {
      const data = await collectionService.getById(collectionId)
      if (data) {
        setCollection(data)
      } else {
        navigate('/collections')
      }
    } catch (error) {
      console.error('Error loading collection:', error)
      navigate('/collections')
    } finally {
      setLoading(false)
    }
  }

  const loadDataSources = async (collectionId: string) => {
    try {
      const result = await dataSourceService.getAll(1, 1000)
      // Filtrar data sources desta coleção
      const filtered = result.data.filter(ds => ds.collectionId === collectionId)
      setDataSources(filtered)
    } catch (error) {
      console.error('Error loading data sources:', error)
    }
  }

  const handleEdit = () => {
    if (id) {
      navigate(`/collections/${id}/edit`)
    }
  }

  const handleDelete = async () => {
    if (!id || !collection) return
    
    if (window.confirm(`Are you sure you want to delete "${collection.name}"? This action cannot be undone.`)) {
      try {
        await collectionService.delete(id)
        navigate('/collections')
      } catch (error) {
        console.error('Error deleting collection:', error)
      }
    }
  }

  const handleDiscoverRelationships = () => {
    // Implementar funcionalidade de descobrir relacionamentos
    console.log('Discover relationships')
  }

  const handleAddDataSource = () => {
    if (id) {
      navigate(`/data-sources/new?collectionId=${id}`)
    } else {
      navigate('/data-sources/new')
    }
  }

  const handleManageDataSource = (dataSourceId: string) => {
    navigate(`/data-sources/${dataSourceId}/edit`)
  }

  if (loading || !collection) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-600 dark:text-slate-400">Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Data Collections', href: '/collections' },
    { label: collection.name },
  ]

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <header className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div className="flex min-w-72 flex-col gap-2">
              <h1 className="text-slate-900 dark:text-[#E0E0E0] text-4xl font-black leading-tight tracking-[-0.033em]">
                {collection.name}
              </h1>
              <p className="text-slate-600 dark:text-[#9db0b9] text-base font-normal leading-normal">
                {collection.description || 'View and manage the details of this data collection.'}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap items-center">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="h-10 px-4 border border-slate-200 dark:border-[#374151] hover:bg-gray-100 dark:hover:bg-white/10"
              >
                Edit Collection
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="h-10 px-4 text-red-500 border border-red-500/50 hover:bg-red-500/10"
              >
                Delete Collection
              </Button>
              <Button
                onClick={handleDiscoverRelationships}
                className="h-10 px-4 bg-[#50E3C2] text-black hover:opacity-90 gap-2"
              >
                <Sparkles className="h-5 w-5" />
                Discover Relationships
              </Button>
            </div>
          </header>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
            <TabsList>
              <TabsTrigger value="general">General Info</TabsTrigger>
              <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
              <TabsTrigger value="model-preferences">Model Preferences</TabsTrigger>
            </TabsList>

            {/* General Info Tab */}
            <TabsContent value="general">
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#1a2831] rounded-lg border border-slate-200 dark:border-[#374151] p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#E0E0E0] mb-4">Collection Information</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-slate-600 dark:text-[#9db0b9]">Name</dt>
                      <dd className="mt-1 text-sm text-slate-900 dark:text-[#E0E0E0]">{collection.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-600 dark:text-[#9db0b9]">Status</dt>
                      <dd className="mt-1">
                        <Badge variant={collection.status === 'active' ? 'success' : collection.status === 'error' ? 'destructive' : 'warning'}>
                          {collection.status}
                        </Badge>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-600 dark:text-[#9db0b9]">Owner</dt>
                      <dd className="mt-1 text-sm text-slate-900 dark:text-[#E0E0E0]">{collection.owner}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-600 dark:text-[#9db0b9]">Data Sources</dt>
                      <dd className="mt-1 text-sm text-slate-900 dark:text-[#E0E0E0]">{collection.dataSourcesCount}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-sm font-medium text-slate-600 dark:text-[#9db0b9]">Description</dt>
                      <dd className="mt-1 text-sm text-slate-900 dark:text-[#E0E0E0]">
                        {collection.description || 'No description provided.'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-600 dark:text-[#9db0b9]">Last Scan</dt>
                      <dd className="mt-1 text-sm text-slate-900 dark:text-[#E0E0E0]">{collection.lastScan}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </TabsContent>

            {/* Data Sources Tab */}
            <TabsContent value="data-sources">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-[#E0E0E0]">Associated Data Sources</h3>
                    <p className="text-sm text-slate-600 dark:text-[#9db0b9] mt-1">
                      Manage the data sources linked to this collection.
                    </p>
                  </div>
                  <Button
                    onClick={handleAddDataSource}
                    className="h-10 px-4 bg-[#4A90E2] hover:opacity-90 text-white gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add Data Source
                  </Button>
                </div>

                <div className="bg-white dark:bg-[#1a2831] rounded-lg border border-slate-200 dark:border-[#374151] overflow-hidden">
                  {dataSources.length === 0 ? (
                    <div className="p-12 text-center">
                      <p className="text-slate-600 dark:text-[#9db0b9]">No data sources associated with this collection.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-white/5">
                          <TableHead className="text-xs font-semibold text-slate-600 dark:text-[#9db0b9] uppercase tracking-wider">
                            Name
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-slate-600 dark:text-[#9db0b9] uppercase tracking-wider">
                            Type
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-slate-600 dark:text-[#9db0b9] uppercase tracking-wider">
                            Status
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-slate-600 dark:text-[#9db0b9] uppercase tracking-wider">
                            Last Synced
                          </TableHead>
                          <TableHead className="relative">
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dataSources.map((dataSource) => {
                          const statusConfig = dataSourceStatusConfig[dataSource.status.toLowerCase()] || 
                            { variant: 'default' as const, label: dataSource.status }
                          
                          return (
                            <TableRow key={dataSource.id}>
                              <TableCell className="whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <TableRows className="h-6 w-6 text-[#50E3C2]" />
                                  <div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-[#E0E0E0]">
                                      {dataSource.name}
                                    </div>
                                    {dataSource.fullPath && (
                                      <div className="text-sm text-slate-600 dark:text-[#9db0b9]">
                                        {dataSource.fullPath}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-sm text-slate-900 dark:text-[#E0E0E0]">
                                {dataSource.type}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <Badge variant={statusConfig.variant} dot>
                                  {statusConfig.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-sm text-slate-900 dark:text-[#E0E0E0]">
                                {dataSource.lastSynced || dataSource.lastScan || 'Never'}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleManageDataSource(dataSource.id)}
                                  className="text-[#4A90E2] hover:underline"
                                >
                                  Manage
                                </button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Relationships Tab */}
            <TabsContent value="relationships">
              <div className="bg-white dark:bg-[#1a2831] rounded-lg border border-slate-200 dark:border-[#374151] p-6">
                <p className="text-slate-600 dark:text-[#9db0b9]">Relationships will be displayed here.</p>
              </div>
            </TabsContent>

            {/* Model Preferences Tab */}
            <TabsContent value="model-preferences">
              <div className="bg-white dark:bg-[#1a2831] rounded-lg border border-slate-200 dark:border-[#374151] p-6">
                <p className="text-slate-600 dark:text-[#9db0b9]">Model preferences will be displayed here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}


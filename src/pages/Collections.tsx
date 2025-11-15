import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { CollectionCard } from '@/components/CollectionCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu, 
  DropdownMenuButton, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu'
import { collectionService } from '@/services/collectionService'
import { Collection, CollectionStatus } from '@/types'
import { Search, PlusCircle } from 'lucide-react'

export default function Collections() {
  const navigate = useNavigate()
  const [collections, setCollections] = useState<Collection[]>([])
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [ownerFilter, setOwnerFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCollections()
  }, [])

  useEffect(() => {
    filterCollections()
  }, [collections, searchQuery, statusFilter, ownerFilter])

  const loadCollections = async () => {
    try {
      setLoading(true)
      const data = await collectionService.getAll()
      setCollections(data)
    } catch (error) {
      console.error('Error loading collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterCollections = () => {
    let filtered = [...collections]

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(collection =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(collection => collection.status === statusFilter)
    }

    // Filtro por owner
    if (ownerFilter !== 'all') {
      filtered = filtered.filter(collection => collection.owner === ownerFilter)
    }

    setFilteredCollections(filtered)
  }

  const handleView = (id: string) => {
    navigate(`/collections/${id}`)
  }

  const handleCreateCollection = () => {
    navigate('/collections/new')
  }

  const handleEdit = (id: string) => {
    navigate(`/collections/${id}/edit`)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await collectionService.delete(id)
        await loadCollections()
      } catch (error) {
        console.error('Error deleting collection:', error)
      }
    }
  }

  const handleCreateCollection = () => {
    navigate('/collections/new')
  }

  // Obter lista única de owners
  const owners = Array.from(new Set(collections.map(c => c.owner)))

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-slate-900 dark:text-white text-3xl font-extrabold leading-tight tracking-tight">
                Data Collections
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                Manage, monitor, and query your data collections.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <Button
                onClick={handleCreateCollection}
                className="h-10 px-5 bg-primary hover:bg-primary/90 text-white text-sm font-bold gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="truncate">Create New Collection</span>
              </Button>
            </div>
          </header>

          {/* Action Bar - Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-grow">
              <div className="flex w-full items-stretch rounded-lg h-10 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/50">
                <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-3">
                  <Search className="h-5 w-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Search collections by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 h-full px-2 text-sm"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuButton label={`Status: ${statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}`} />
                <DropdownMenuContent>
                  <DropdownMenuItem
                    selected={statusFilter === 'all'}
                    onClick={() => setStatusFilter('all')}
                  >
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    selected={statusFilter === 'active'}
                    onClick={() => setStatusFilter('active')}
                  >
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    selected={statusFilter === 'indexing'}
                    onClick={() => setStatusFilter('indexing')}
                  >
                    Indexing
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    selected={statusFilter === 'error'}
                    onClick={() => setStatusFilter('error')}
                  >
                    Error
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuButton label={`Owner: ${ownerFilter === 'all' ? 'All' : ownerFilter}`} />
                <DropdownMenuContent>
                  <DropdownMenuItem
                    selected={ownerFilter === 'all'}
                    onClick={() => setOwnerFilter('all')}
                  >
                    All
                  </DropdownMenuItem>
                  {owners.map((owner) => (
                    <DropdownMenuItem
                      key={owner}
                      selected={ownerFilter === owner}
                      onClick={() => setOwnerFilter(owner)}
                    >
                      {owner}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Collections Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-500 dark:text-slate-400">Loading collections...</p>
            </div>
          ) : filteredCollections.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
              <span className="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-600">
                folder_off
              </span>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                No data collections found
              </h3>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                {searchQuery || statusFilter !== 'all' || ownerFilter !== 'all'
                  ? 'Try adjusting your filters.'
                  : 'Get started by creating a new collection.'}
              </p>
              {!searchQuery && statusFilter === 'all' && ownerFilter === 'all' && (
                <Button
                  onClick={handleCreateCollection}
                  className="mt-6 h-10 px-5 bg-primary hover:bg-primary/90 text-white text-sm font-bold gap-2"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span className="truncate">Create New Collection</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { dataSourceService } from '@/services/dataSourceService'
import { collectionService } from '@/services/collectionService'
import { DataSourceType, Collection } from '@/types'
import { CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'

const DATA_SOURCE_TYPES: DataSourceType[] = [
  'PostgreSQL',
  'MongoDB',
]

export default function CreateDataSource() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const isEditMode = !!id
  const collectionIdFromQuery = searchParams.get('collectionId')

  const [formData, setFormData] = useState({
    name: '',
    type: '' as DataSourceType | '',
    connectionUri: '',
    credentials: '',
    collectionId: '',
  })
  const [collections, setCollections] = useState<Collection[]>([])
  const [errors, setErrors] = useState<{
    name?: string
    type?: string
    connectionUri?: string
  }>({})
  const [loading, setLoading] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    loadCollections()
    if (isEditMode && id) {
      loadDataSource(id)
    }
    // Se houver collectionId na query, pré-selecionar
    if (collectionIdFromQuery && !isEditMode) {
      setFormData(prev => ({ ...prev, collectionId: collectionIdFromQuery }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode, collectionIdFromQuery])

  const loadCollections = async () => {
    try {
      const result = await collectionService.getAll()
      setCollections(result.items)
    } catch (error) {
      console.error('Error loading collections:', error)
    }
  }

  const loadDataSource = async (dataSourceId: string) => {
    try {
      const dataSource = await dataSourceService.getById(dataSourceId)
      if (dataSource) {
        setFormData({
          name: dataSource.name,
          type: dataSource.type,
          connectionUri: dataSource.connectionUri || '',
          credentials: '', // Não retornamos credenciais por segurança
          collectionId: dataSource.collectionId || '',
        })
      }
    } catch (error) {
      console.error('Error loading data source:', error)
      navigate('/data-sources')
    }
  }

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.'
    }

    if (!formData.type) {
      newErrors.type = 'Type is required.'
    }

    if (!formData.connectionUri.trim()) {
      newErrors.connectionUri = 'Connection URI is required.'
    } else {
      // Validação básica de URI
      try {
        new URL(formData.connectionUri)
      } catch {
        newErrors.connectionUri = 'Invalid URI format.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleTestConnection = async () => {
    if (!formData.connectionUri.trim()) {
      setErrors({ ...errors, connectionUri: 'Connection URI is required.' })
      return
    }

    setTestingConnection(true)
    setConnectionResult(null)

    try {
      // Por enquanto, apenas valida o formato da URI
      // O backend pode não ter endpoint de teste ainda
      try {
        new URL(formData.connectionUri)
        setConnectionResult({
          success: true,
          message: 'URI format is valid',
        })
      } catch {
        setConnectionResult({
          success: false,
          message: 'Invalid URI format',
        })
      }
    } catch (error) {
      setConnectionResult({
        success: false,
        message: 'Failed to test connection',
      })
    } finally {
      setTestingConnection(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const collection = collections.find(c => c.id === formData.collectionId)

      if (isEditMode && id) {
        await dataSourceService.update(id, {
          name: formData.name.trim(),
          type: formData.type as 'PostgreSQL' | 'MongoDB',
          connectionUri: formData.connectionUri.trim(),
        })
      } else {
        if (!formData.collectionId) {
          throw new Error('Collection is required')
        }
        await dataSourceService.create({
          name: formData.name.trim(),
          type: formData.type as 'PostgreSQL' | 'MongoDB',
          collectionId: formData.collectionId,
          connectionUri: formData.connectionUri.trim(),
        })
      }
      if (formData.collectionId) {
        navigate(`/collections/${formData.collectionId}`)
      } else {
        navigate('/data-sources')
      }
    } catch (error) {
      console.error('Error saving data source:', error)
      // Aqui você pode adicionar uma notificação de erro
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (collectionIdFromQuery) {
      navigate(`/collections/${collectionIdFromQuery}`)
    } else {
      navigate('/data-sources')
    }
  }

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap justify-between gap-3 mb-8">
              <div>
                <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">
                  {isEditMode ? 'Edit Data Source' : 'Create New Data Source'}
                </h1>
                <p className="text-slate-500 dark:text-[#9db0b9] text-base font-normal leading-normal mt-1">
                  Configure the details for your new data source connection.
                </p>
              </div>
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
            </div>

            {/* Form Card */}
            <Card className="bg-white dark:bg-[#111618] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Type - Grid 2 colunas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <Label htmlFor="name" className="flex flex-col">
                      <p className="text-slate-800 dark:text-white text-sm font-medium leading-normal pb-2">
                        Name
                      </p>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Production PostgreSQL DB"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value })
                          if (errors.name) {
                            setErrors({ ...errors, name: undefined })
                          }
                        }}
                        className={`h-11 bg-white dark:bg-[#1c2327] border-slate-300 dark:border-[#3b4b54] placeholder:text-slate-400 dark:placeholder:text-[#9db0b9] ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''
                          }`}
                      />
                      {errors.name && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </Label>
                  </div>

                  <div className="flex flex-col">
                    <Label htmlFor="type" className="flex flex-col">
                      <p className="text-slate-800 dark:text-white text-sm font-medium leading-normal pb-2">
                        Type
                      </p>
                      <Select
                        value={formData.type || undefined}
                        onValueChange={(value) => {
                          setFormData({ ...formData, type: value as DataSourceType })
                          if (errors.type) {
                            setErrors({ ...errors, type: undefined })
                          }
                        }}
                      >
                        <SelectTrigger
                          id="type"
                          className={`bg-white dark:bg-[#1c2327] border-slate-300 dark:border-[#3b4b54] text-slate-900 dark:text-white ${errors.type ? 'border-red-500 focus-visible:ring-red-500' : ''
                            }`}
                        >
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          {DATA_SOURCE_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.type && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                          {errors.type}
                        </p>
                      )}
                    </Label>
                  </div>
                </div>

                {/* Connection URI - Full width */}
                <div className="flex flex-col">
                  <Label htmlFor="connectionUri" className="flex flex-col">
                    <p className="text-slate-800 dark:text-white text-sm font-medium leading-normal pb-2">
                      Connection URI
                    </p>
                    <Input
                      id="connectionUri"
                      type="text"
                      placeholder="postgresql://user:password@host:port/dbname"
                      value={formData.connectionUri}
                      onChange={(e) => {
                        setFormData({ ...formData, connectionUri: e.target.value })
                        if (errors.connectionUri) {
                          setErrors({ ...errors, connectionUri: undefined })
                        }
                        setConnectionResult(null)
                      }}
                      className={`h-11 bg-white dark:bg-[#1c2327] border-slate-300 dark:border-[#3b4b54] placeholder:text-slate-400 dark:placeholder:text-[#9db0b9] ${errors.connectionUri ? 'border-red-500 focus-visible:ring-red-500' : ''
                        }`}
                    />
                    {errors.connectionUri && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.connectionUri}
                      </p>
                    )}
                  </Label>
                </div>

                {/* Credentials - Full width com toggle */}
                <div className="flex flex-col">
                  <Label htmlFor="credentials" className="flex flex-col">
                    <p className="text-slate-800 dark:text-white text-sm font-medium leading-normal pb-2">
                      Credentials
                    </p>
                    <div className="relative">
                      <Input
                        id="credentials"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password or access token"
                        value={formData.credentials}
                        onChange={(e) => {
                          setFormData({ ...formData, credentials: e.target.value })
                        }}
                        className="h-11 bg-white dark:bg-[#1c2327] border-slate-300 dark:border-[#3b4b54] placeholder:text-slate-400 dark:placeholder:text-[#9db0b9] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </Label>
                </div>

                {/* Associated Collection - Full width */}
                <div className="flex flex-col">
                  <Label htmlFor="collection" className="flex flex-col">
                    <p className="text-slate-800 dark:text-white text-sm font-medium leading-normal pb-2">
                      Associated Collection
                    </p>
                    <Select
                      value={formData.collectionId || undefined}
                      onValueChange={(value) => {
                        setFormData({ ...formData, collectionId: value })
                      }}
                    >
                      <SelectTrigger
                        id="collection"
                        className="bg-white dark:bg-[#1c2327] border-slate-300 dark:border-[#3b4b54] text-slate-900 dark:text-white"
                      >
                        <SelectValue placeholder="Select a collection" />
                      </SelectTrigger>
                      <SelectContent>
                        {collections.map((collection) => (
                          <SelectItem key={collection.id} value={collection.id}>
                            {collection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Label>
                </div>

                {/* Connection Feedback */}
                {connectionResult && (
                  <div
                    className={`flex items-center gap-2 ${connectionResult.success
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                      }`}
                  >
                    {connectionResult.success ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                    <p className="text-sm font-medium">{connectionResult.message}</p>
                  </div>
                )}

                {/* Button Group */}
                <div className="flex items-center justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={testingConnection || !formData.connectionUri.trim()}
                    className="px-4 py-2 text-sm font-semibold text-primary border border-primary/50 hover:bg-primary/10"
                  >
                    {testingConnection ? 'Testing...' : 'Test Connection'}
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


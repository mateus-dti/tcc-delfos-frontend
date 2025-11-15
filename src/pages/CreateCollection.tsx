import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { collectionService } from '@/services/collectionService'

export default function CreateCollection() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [errors, setErrors] = useState<{
    name?: string
  }>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEditMode && id) {
      loadCollection(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode])

  const loadCollection = async (collectionId: string) => {
    try {
      const collection = await collectionService.getById(collectionId)
      if (collection) {
        setFormData({
          name: collection.name,
          description: collection.description || '',
        })
      }
    } catch (error) {
      console.error('Error loading collection:', error)
      navigate('/collections')
    }
  }

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Collection name is required.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      if (isEditMode && id) {
        await collectionService.update(id, {
          name: formData.name.trim(),
          description: formData.description.trim(),
        })
      } else {
        await collectionService.create({
          name: formData.name.trim(),
          description: formData.description.trim(),
        })
      }
      navigate('/collections')
    } catch (error) {
      console.error('Error saving collection:', error)
      // Aqui você pode adicionar uma notificação de erro
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/collections')
  }

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap justify-between gap-3 mb-8">
              <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                {isEditMode ? 'Edit Collection' : 'Create New Collection'}
              </h1>
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
            </div>

            {/* Form Card */}
            <Card className="bg-white dark:bg-[#111618] rounded-xl border border-slate-200 dark:border-slate-800 p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Collection Name Field */}
                <div className="flex flex-col">
                  <Label htmlFor="name" className="flex flex-col min-w-40 flex-1">
                    <p className="text-slate-800 dark:text-white text-base font-medium leading-normal pb-2">
                      Collection Name
                    </p>
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g., Q3 Marketing Campaign Analytics"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value })
                        if (errors.name) {
                          setErrors({ ...errors, name: undefined })
                        }
                      }}
                      className={`h-14 bg-slate-50 dark:bg-[#1c2327] border-slate-300 dark:border-[#3b4b54] placeholder:text-slate-400 dark:placeholder:text-[#9db0b9] ${
                        errors.name
                          ? 'border-red-500 focus-visible:ring-red-500'
                          : ''
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-600 dark:text-red-500 text-sm mt-2">
                        {errors.name}
                      </p>
                    )}
                  </Label>
                </div>

                {/* Description Field */}
                <div className="flex flex-col">
                  <Label htmlFor="description" className="flex flex-col min-w-40 flex-1">
                    <p className="text-slate-800 dark:text-white text-base font-medium leading-normal pb-2">
                      Description
                    </p>
                    <Textarea
                      id="description"
                      placeholder="A brief summary of the data this collection represents."
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({ ...formData, description: e.target.value })
                      }}
                      className="min-h-36 bg-slate-50 dark:bg-[#1c2327] border-slate-300 dark:border-[#3b4b54] placeholder:text-slate-400 dark:placeholder:text-[#9db0b9]"
                    />
                  </Label>
                </div>

                {/* Divider */}
                <hr className="border-slate-200 dark:border-slate-800 my-2" />

                {/* Button Group */}
                <div className="flex justify-end gap-3 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="h-10 px-4 bg-transparent text-slate-700 dark:text-white border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-10 px-4 bg-primary hover:bg-primary/90 text-white"
                  >
                    {loading ? 'Saving...' : 'Save Collection'}
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


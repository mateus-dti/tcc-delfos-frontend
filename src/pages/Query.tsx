import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { QueryResultsViewer } from '@/components/QueryResultsViewer'
import { apiClient as api } from '@/lib/api'

interface Collection {
  id: string;
  name: string;
}

interface Model {
  id: string;
  name: string;
}

export default function Query() {
  const [query, setQuery] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('')
  const [showSql, setShowSql] = useState(false)
  const [status, setStatus] = useState<'idle' | 'generating' | 'executing' | 'completed' | 'error'>('idle')
  const [results, setResults] = useState<any[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoadingCollections, setIsLoadingCollections] = useState(true)
  const [isLoadingModels, setIsLoadingModels] = useState(true)

  useEffect(() => {
    fetchCollections();
    fetchModels();
  }, []);

  const fetchCollections = async () => {
    setIsLoadingCollections(true);
    try {
      const response = await api.get<{ items: Collection[] }>('/api/collections');
      setCollections(response.items);
      if (response.items.length > 0) {
        setSelectedCollection(response.items[0].id);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setIsLoadingCollections(false);
    }
  };

  const fetchModels = async () => {
    setIsLoadingModels(true);
    try {
      const response = await api.get<{ models: Model[] }>('/api/models');
      setModels(response.models);
      if (response.models.length > 0) {
        setSelectedModel(response.models[0].id);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleGenerate = async () => {
    if (!query || !selectedCollection || !selectedModel) return;

    setStatus('generating');
    setErrorMessage('');
    setResults([]);

    try {
      // In a real streaming implementation, we would have separate steps.
      // For now, the backend does everything in one go.
      setStatus('executing');

      const response = await api.post<any[]>('/api/queries/execute', {
        collectionId: selectedCollection,
        modelId: selectedModel,
        query: query
      });

      setResults(response);
      setStatus('completed');
    } catch (error: any) {
      console.error('Error executing query:', error);
      setStatus('error');
      setErrorMessage(error.response?.data?.error || 'An error occurred while processing your query.');
    }
  }

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          {/* Page Heading */}
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Natural Language Query
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
              Transform your questions into data insights. Select a collection and model, then type your query.
            </p>
          </div>

          {/* Query Input Card */}
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111618]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Collection Selector */}
              <div className="md:col-span-1">
                <Label className="flex flex-col gap-2">
                  <span className="text-slate-800 dark:text-white text-sm font-medium leading-normal">
                    Select Collection
                  </span>
                  {isLoadingCollections ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                      <SelectTrigger className="h-12 bg-slate-50 dark:bg-[#1c2327] border-slate-300 dark:border-[#3b4b54]">
                        <SelectValue placeholder="Select collection" />
                      </SelectTrigger>
                      <SelectContent>
                        {collections.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Label>
              </div>

              {/* Model Selector */}
              <div className="md:col-span-1">
                <Label className="flex flex-col gap-2">
                  <span className="text-slate-800 dark:text-white text-sm font-medium leading-normal">
                    Select AI Model
                  </span>
                  {isLoadingModels ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="h-12 bg-slate-50 dark:bg-[#1c2327] border-slate-300 dark:border-[#3b4b54]">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map(m => (
                          <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Label>
              </div>

              <div className="md:col-span-1"></div>

              {/* Text Area */}
              <div className="md:col-span-3">
                <Label className="flex flex-col gap-2">
                  <span className="text-slate-800 dark:text-white text-sm font-medium leading-normal">
                    Ask a question about your data...
                  </span>
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="min-h-36 resize-none text-base p-4 bg-slate-50 dark:bg-[#1c2327] border-slate-300 dark:border-[#3b4b54] focus-visible:ring-primary/50"
                    placeholder="e.g., 'What were the total sales by product category last quarter?'"
                  />
                </Label>
              </div>

              {/* SQL Preview Toggle */}
              <div className="md:col-span-2 flex items-end">
                <div className="flex items-center gap-4 justify-between w-full border border-slate-300 dark:border-[#3b4b54] rounded-lg p-3 h-12 bg-slate-50 dark:bg-[#1c2327]">
                  <span className="text-slate-800 dark:text-white text-sm font-normal leading-normal truncate">
                    Show SQL before executing (Coming Soon)
                  </span>
                  <Switch
                    checked={showSql}
                    onCheckedChange={setShowSql}
                    disabled={true}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <Button
                onClick={handleGenerate}
                disabled={status === 'generating' || status === 'executing' || !query || !selectedCollection || !selectedModel}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-6 px-6 h-auto text-base"
              >
                {status === 'generating' || status === 'executing' ? 'Processing...' : 'Generate & Execute'}
              </Button>
            </div>
          </Card>

          {/* Error Message */}
          {status === 'error' && (
            <div className="mt-8">
              <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Error</h3>
                <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
              </Card>
            </div>
          )}

          {/* Progress Indicator Section */}
          {(status === 'generating' || status === 'executing') && (
            <div className="mt-8">
              <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111618]">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Query Status
                </h3>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className={`flex items-center gap-3 text-primary`}>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    <span className="font-medium">Processing Query...</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Results Area */}
          {status === 'completed' && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Results</h3>
              <QueryResultsViewer results={results} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

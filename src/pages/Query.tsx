import { useState } from 'react'
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

export default function Query() {
  const [query, setQuery] = useState('')
  const [model, setModel] = useState('gpt-4-turbo')
  const [showSql, setShowSql] = useState(false)
  const [status, setStatus] = useState<'idle' | 'generating' | 'confirming' | 'executing' | 'fetching'>('idle')

  const handleGenerate = () => {
    // Mock interaction for now
    setStatus('generating')
    setTimeout(() => setStatus('confirming'), 1500)
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
              Transform your questions into data insights. Select a model and type your query below.
            </p>
          </div>

          {/* Query Input Card */}
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111618]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              {/* Model Selector */}
              <div className="md:col-span-1">
                <Label className="flex flex-col gap-2">
                  <span className="text-slate-800 dark:text-white text-sm font-medium leading-normal">
                    Select AI Model
                  </span>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="h-12 bg-slate-50 dark:bg-[#1c2327] border-slate-300 dark:border-[#3b4b54]">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="llama-3-70b">Llama 3 70B</SelectItem>
                      <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    </SelectContent>
                  </Select>
                </Label>
              </div>

              {/* SQL Preview Toggle */}
              <div className="md:col-span-2 flex items-end">
                <div className="flex items-center gap-4 justify-between w-full border border-slate-300 dark:border-[#3b4b54] rounded-lg p-3 h-12 bg-slate-50 dark:bg-[#1c2327]">
                  <span className="text-slate-800 dark:text-white text-sm font-normal leading-normal truncate">
                    Show SQL before executing
                  </span>
                  <Switch
                    checked={showSql}
                    onCheckedChange={setShowSql}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <Button
                onClick={handleGenerate}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-6 px-6 h-auto text-base"
              >
                Generate & Execute
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-transparent hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold py-6 px-6 h-auto text-base border-slate-300 dark:border-slate-700"
              >
                View Query History
              </Button>
            </div>
          </Card>

          {/* Progress Indicator Section */}
          {status !== 'idle' && (
            <div className="mt-8">
              <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111618]">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Query Status
                </h3>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className={`flex items-center gap-3 ${status === 'generating' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
                    <span className="material-symbols-outlined">sync</span>
                    <span className="font-medium">Generating SQL...</span>
                  </div>
                  <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 hidden md:block mx-2" />

                  <div className={`flex items-center gap-3 ${status === 'confirming' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
                    <span className="material-symbols-outlined">help_center</span>
                    <span className="font-medium">Awaiting Confirmation</span>
                  </div>
                  <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 hidden md:block mx-2" />

                  <div className={`flex items-center gap-3 ${status === 'executing' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
                    <span className="material-symbols-outlined">play_circle</span>
                    <span className="font-medium">Executing on Trino</span>
                  </div>
                  <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 hidden md:block mx-2" />

                  <div className={`flex items-center gap-3 ${status === 'fetching' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
                    <span className="material-symbols-outlined">table</span>
                    <span className="font-medium">Fetching Results</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Results Area */}
          <div className="mt-8">
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111618] min-h-[200px] flex items-center justify-center">
              <p className="text-slate-500 dark:text-slate-400">
                Your query results will appear here.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

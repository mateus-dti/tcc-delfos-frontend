// Serviço para gerenciar data sources

import { DataSource, PagedResult } from '@/types'
import { apiClient } from '@/lib/api'

// Função auxiliar para formatar data relativa
function formatRelativeTime(date: string | Date | undefined): string {
  if (!date) return 'Never'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

// Função auxiliar para transformar DataSource do backend para formato da UI
function transformDataSource(dataSource: any, collectionName?: string): DataSource {
  return {
    ...dataSource,
    status: dataSource.isActive ? 'active' : 'disabled',
    collection: collectionName || 'Unknown',
    lastScan: dataSource.lastScannedAt ? formatRelativeTime(dataSource.lastScannedAt) : 'Never',
    lastSynced: dataSource.lastScannedAt ? formatRelativeTime(dataSource.lastScannedAt) : 'Never',
  }
}

export const dataSourceService = {
  async getAll(page: number = 1, pageSize: number = 10): Promise<PagedResult<DataSource>> {
    const result = await apiClient.get<PagedResult<any>>('/api/data-sources', {
      page,
      pageSize,
    })

    // Buscar todas as coleções para mapear os nomes
    const collectionsResponse = await apiClient.get<PagedResult<any>>('/api/collections', {})
    const collectionsMap = new Map(
      collectionsResponse.items.map((c: any) => [c.id, c.name])
    )

    return {
      ...result,
      items: result.items.map((ds) => {
        const collectionName = collectionsMap.get(ds.collectionId) || 'Unknown'
        return transformDataSource(ds, collectionName)
      }),
    }
  },

  async getById(id: string): Promise<DataSource | null> {
    try {
      const dataSource = await apiClient.get<any>(`/api/data-sources/${id}`)
      return transformDataSource(dataSource)
    } catch (error) {
      console.error('Error fetching data source:', error)
      return null
    }
  },

  async create(dataSource: {
    name: string
    type: 'PostgreSQL' | 'MongoDB'
    collectionId: string
    connectionUri: string
    metadata?: Record<string, any>
  }): Promise<DataSource> {
    const created = await apiClient.post<any>('/api/data-sources', {
      name: dataSource.name,
      type: dataSource.type,
      collectionId: dataSource.collectionId,
      connectionUri: dataSource.connectionUri,
      metadata: dataSource.metadata,
    })
    return transformDataSource(created)
  },

  async update(id: string, dataSource: {
    name?: string
    type?: 'PostgreSQL' | 'MongoDB'
    connectionUri?: string
    metadata?: Record<string, any>
  }): Promise<DataSource> {
    const updated = await apiClient.put<any>(`/api/data-sources/${id}`, {
      name: dataSource.name,
      type: dataSource.type,
      connectionUri: dataSource.connectionUri,
      metadata: dataSource.metadata,
    })
    return transformDataSource(updated)
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/data-sources/${id}`)
  },

  async extractSchema(id: string): Promise<any> {
    return apiClient.post(`/api/data-sources/${id}/extract-schema`)
  },

  async getSchema(id: string): Promise<any> {
    return apiClient.get(`/api/data-sources/${id}/schema`)
  },

  async rescanSchema(id: string): Promise<any> {
    return apiClient.post(`/api/data-sources/${id}/rescan`)
  },

  async getSnapshots(id: string): Promise<any[]> {
    return apiClient.get(`/api/data-sources/${id}/snapshots`)
  },
}


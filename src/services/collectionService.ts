// Serviço para gerenciar coleções

import { Collection, PagedResult } from '@/types'
import { apiClient } from '@/lib/api'

// Função auxiliar para formatar data relativa
function formatRelativeTime(date: string | Date): string {
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

// Função auxiliar para transformar Collection do backend para formato da UI
function transformCollection(collection: any): Collection {
  return {
    ...collection,
    status: collection.isActive ? 'active' : 'error',
    owner: collection.owner?.username || 'Unknown',
    lastScan: collection.updatedAt ? formatRelativeTime(collection.updatedAt) : 'Never',
  }
}

export const collectionService = {
  async getAll(page?: number, pageSize?: number, search?: string): Promise<PagedResult<Collection>> {
    const result = await apiClient.get<PagedResult<any>>('/api/collections', {
      page,
      pageSize,
      search,
    })

    return {
      ...result,
      items: result.items.map(transformCollection),
    }
  },

  async getById(id: string): Promise<Collection | null> {
    try {
      const collection = await apiClient.get<any>(`/api/collections/${id}`)
      return transformCollection(collection)
    } catch (error) {
      console.error('Error fetching collection:', error)
      return null
    }
  },

  async create(collection: { name: string; description?: string }): Promise<Collection> {
    const created = await apiClient.post<any>('/api/collections', {
      name: collection.name,
      description: collection.description,
    })
    return transformCollection(created)
  },

  async update(id: string, collection: { name?: string; description?: string }): Promise<Collection> {
    const updated = await apiClient.put<any>(`/api/collections/${id}`, {
      name: collection.name,
      description: collection.description,
    })
    return transformCollection(updated)
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/collections/${id}`)
  },

  async getDataSources(collectionId: string): Promise<any[]> {
    return apiClient.get<any[]>(`/api/collections/${collectionId}/datasources`)
  },

  async associateDataSource(collectionId: string, dataSourceId: string): Promise<void> {
    await apiClient.post(`/api/collections/${collectionId}/datasources`, {
      dataSourceId,
    })
  },

  async disassociateDataSource(collectionId: string, dataSourceId: string): Promise<void> {
    await apiClient.delete(`/api/collections/${collectionId}/datasources/${dataSourceId}`)
  },

  async getRelationships(collectionId: string): Promise<any[]> {
    return apiClient.get<any[]>(`/api/collections/${collectionId}/relationships`)
  },

  async discoverRelationships(collectionId: string): Promise<any[]> {
    return apiClient.post<any[]>(`/api/collections/${collectionId}/discover-relationships`)
  },
}


// Serviço para gerenciar coleções

import { Collection } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const collectionService = {
  async getAll(): Promise<Collection[]> {
    // Por enquanto, retorna dados mockados
    // Quando a API estiver pronta, substituir por:
    // const response = await fetch(`${API_BASE_URL}/api/collections`)
    // return response.json()

    return [
      {
        id: '1',
        name: 'Marketing Analytics Q3',
        description: 'Tracks customer engagement and campaign performance.',
        status: 'active',
        dataSourcesCount: 5,
        owner: 'Alex Chen',
        lastScan: '2 hours ago',
      },
      {
        id: '2',
        name: 'Production Server Logs',
        description: 'Real-time logs from production environment servers.',
        status: 'indexing',
        dataSourcesCount: 12,
        owner: 'Maria Garcia',
        lastScan: '15 minutes ago',
      },
      {
        id: '3',
        name: 'User Behavior Tracking',
        description: 'Aggregated user interaction data from web app.',
        status: 'error',
        dataSourcesCount: 3,
        owner: 'Alex Chen',
        lastScan: '1 day ago',
      },
    ]
  },

  async getById(id: string): Promise<Collection | null> {
    const collections = await this.getAll()
    return collections.find(c => c.id === id) || null
  },

  async create(collection: Omit<Collection, 'id' | 'status' | 'dataSourcesCount' | 'owner' | 'lastScan'>): Promise<Collection> {
    // Implementar chamada à API quando disponível
    // const response = await fetch(`${API_BASE_URL}/api/collections`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(collection),
    // })
    // return response.json()

    // Mock para desenvolvimento
    const newCollection: Collection = {
      id: Date.now().toString(),
      ...collection,
      status: 'active',
      dataSourcesCount: 0,
      owner: 'Current User', // Será substituído pelo backend
      lastScan: 'Just now',
    }
    return newCollection
  },

  async update(id: string, collection: Partial<Omit<Collection, 'id'>>): Promise<Collection> {
    // Implementar chamada à API quando disponível
    // const response = await fetch(`${API_BASE_URL}/api/collections/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(collection),
    // })
    // return response.json()

    // Mock para desenvolvimento
    const existing = await this.getById(id)
    if (!existing) {
      throw new Error('Collection not found')
    }
    return { ...existing, ...collection }
  },

  async delete(id: string): Promise<void> {
    // Implementar chamada à API quando disponível
    // await fetch(`${API_BASE_URL}/api/collections/${id}`, { method: 'DELETE' })
  },
}


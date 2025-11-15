// Serviço para gerenciar data sources

import { DataSource } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const dataSourceService = {
  async getAll(page: number = 1, limit: number = 10): Promise<{ data: DataSource[], total: number }> {
    // Por enquanto, retorna dados mockados
    // Quando a API estiver pronta, substituir por:
    // const response = await fetch(`${API_BASE_URL}/api/data-sources?page=${page}&limit=${limit}`)
    // return response.json()

    const mockData: DataSource[] = [
      {
        id: '1',
        name: 'Production PostgreSQL DB',
        type: 'PostgreSQL',
        collection: 'Core Services',
        status: 'active',
        lastScan: '2 hours ago',
      },
      {
        id: '2',
        name: 'Analytics MySQL',
        type: 'MySQL',
        collection: 'Marketing Analytics Q3',
        status: 'active',
        lastScan: '1 hour ago',
      },
      {
        id: '3',
        name: 'S3 Bucket - Logs',
        type: 'S3',
        collection: 'Production Server Logs',
        status: 'pending',
        lastScan: '5 minutes ago',
      },
      {
        id: '4',
        name: 'Kafka Stream - Events',
        type: 'Kafka',
        collection: 'User Behavior Tracking',
        status: 'error',
        lastScan: '1 day ago',
      },
      {
        id: '5',
        name: 'MongoDB - User Data',
        type: 'MongoDB',
        collection: 'Core Services',
        status: 'disabled',
        lastScan: '3 days ago',
      },
      {
        id: '6',
        name: 'Redis Cache',
        type: 'Redis',
        collection: 'Core Services',
        status: 'active',
        lastScan: '30 minutes ago',
      },
      {
        id: '7',
        name: 'PostgreSQL - Analytics',
        type: 'PostgreSQL',
        collection: 'Marketing Analytics Q3',
        status: 'active',
        lastScan: '45 minutes ago',
      },
      {
        id: '8',
        name: 'S3 Bucket - Backups',
        type: 'S3',
        collection: 'Production Server Logs',
        status: 'active',
        lastScan: '6 hours ago',
      },
    ]

    const start = (page - 1) * limit
    const end = start + limit
    const paginatedData = mockData.slice(start, end)

    return {
      data: paginatedData,
      total: mockData.length,
    }
  },

  async getById(id: string): Promise<DataSource | null> {
    const { data } = await this.getAll(1, 1000)
    return data.find(ds => ds.id === id) || null
  },

  async create(dataSource: Omit<DataSource, 'id' | 'status' | 'lastScan'>): Promise<DataSource> {
    // Implementar chamada à API quando disponível
    // const response = await fetch(`${API_BASE_URL}/api/data-sources`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dataSource),
    // })
    // return response.json()

    // Mock para desenvolvimento
    const newDataSource: DataSource = {
      id: Date.now().toString(),
      ...dataSource,
      status: 'pending',
      lastScan: 'Just now',
    }
    return newDataSource
  },

  async update(id: string, dataSource: Partial<Omit<DataSource, 'id'>>): Promise<DataSource> {
    // Implementar chamada à API quando disponível
    // const response = await fetch(`${API_BASE_URL}/api/data-sources/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dataSource),
    // })
    // return response.json()

    // Mock para desenvolvimento
    const existing = await this.getById(id)
    if (!existing) {
      throw new Error('Data source not found')
    }
    return { ...existing, ...dataSource }
  },

  async testConnection(connectionUri: string, credentials?: string): Promise<{ success: boolean; message: string }> {
    // Implementar chamada à API quando disponível
    // const response = await fetch(`${API_BASE_URL}/api/data-sources/test`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ connectionUri, credentials }),
    // })
    // return response.json()

    // Mock para desenvolvimento - validação básica de URI
    try {
      const uri = new URL(connectionUri)
      // Simula teste de conexão
      return {
        success: true,
        message: 'Connection successful',
      }
    } catch (error) {
      return {
        success: false,
        message: 'Invalid URI format',
      }
    }
  },

  async delete(id: string): Promise<void> {
    // Implementar chamada à API quando disponível
    // await fetch(`${API_BASE_URL}/api/data-sources/${id}`, { method: 'DELETE' })
  },
}


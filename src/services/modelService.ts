import { apiClient } from '@/lib/api'

/**
 * Tipos de origem dos modelos
 */
export type ModelOrigin = 'OpenRouter' | 'Internal'

/**
 * Interface para modelo de IA
 */
export interface Model {
  id: string
  name: string
  identifier: string
  description?: string
  origin: ModelOrigin
  isActive: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

/**
 * Interface para resposta de listagem de modelos
 */
export interface ModelsResponse {
  models: Model[]
  total: number
}

/**
 * Interface para criação de modelo
 */
export interface CreateModelRequest {
  name: string
  identifier: string
  description?: string
  origin: ModelOrigin
}

/**
 * Interface para atualização de modelo
 */
export interface UpdateModelRequest {
  name?: string
  description?: string
  isActive?: boolean
}

/**
 * Serviço para gerenciar modelos de IA
 * RF04.1 - Listar Modelos Públicos
 */
export const modelService = {
  /**
   * Lista todos os modelos disponíveis
   */
  async getModels(params?: {
    origin?: ModelOrigin
    search?: string
  }): Promise<ModelsResponse> {
    const queryParams = new URLSearchParams()
    
    if (params?.origin) {
      queryParams.append('origin', params.origin)
    }
    if (params?.search) {
      queryParams.append('search', params.search)
    }

    const url = `/api/models${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiClient.get<ModelsResponse>(url)
  },

  /**
   * Busca um modelo específico por ID
   */
  async getModelById(modelId: string): Promise<Model> {
    return apiClient.get<Model>(`/api/models/${modelId}`)
  },

  /**
   * Cria um novo modelo
   */
  async createModel(data: CreateModelRequest): Promise<Model> {
    return apiClient.post<Model>('/api/models', data)
  },

  /**
   * Atualiza um modelo existente
   */
  async updateModel(modelId: string, data: UpdateModelRequest): Promise<Model> {
    return apiClient.put<Model>(`/api/models/${modelId}`, data)
  },

  /**
   * Remove um modelo (soft delete)
   */
  async deleteModel(modelId: string): Promise<void> {
    return apiClient.delete<void>(`/api/models/${modelId}`)
  },

  /**
   * Extrai provedor do identificador (ex: "openai/gpt-4" -> "openai")
   */
  getProviderFromIdentifier(identifier: string): string {
    const match = identifier.match(/^([^/]+)\//)
    return match ? match[1] : 'unknown'
  },

  /**
   * Agrupa modelos por provedor
   */
  groupByProvider(models: Model[]): Record<string, Model[]> {
    return models.reduce((acc, model) => {
      const provider = this.getProviderFromIdentifier(model.identifier)
      if (!acc[provider]) {
        acc[provider] = []
      }
      acc[provider].push(model)
      return acc
    }, {} as Record<string, Model[]>)
  },

  /**
   * Filtra modelos por origem
   */
  filterByOrigin(models: Model[], origin: ModelOrigin): Model[] {
    return models.filter(model => model.origin === origin)
  },

  /**
   * Filtra apenas modelos ativos
   */
  filterActive(models: Model[]): Model[] {
    return models.filter(model => model.isActive)
  },

  /**
   * Ordena modelos por nome
   */
  sortByName(models: Model[], ascending: boolean = true): Model[] {
    return [...models].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name)
      return ascending ? comparison : -comparison
    })
  },
}

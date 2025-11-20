// Definições de tipos TypeScript para o projeto Delfos

export interface User {
  id: string
  username: string
  email: string
}

export type CollectionStatus = 'active' | 'indexing' | 'error'

export interface Collection {
  id: string
  name: string
  description?: string
  ownerId: string
  owner?: {
    id: string
    username: string
    email: string
  }
  dataSourcesCount?: number
  dataSources?: DataSource[]
  isActive: boolean
  createdAt: string | Date
  updatedAt: string | Date
  // Campos calculados para compatibilidade com UI
  status?: CollectionStatus
  owner?: string
  lastScan?: string
}

export type DataSourceType = 'PostgreSQL' | 'MongoDB'
export type DataSourceStatus = 'active' | 'error' | 'disabled' | 'pending'

export interface DataSource {
  id: string
  collectionId: string
  name: string
  type: DataSourceType
  connectionUriEncrypted?: string
  metadata?: Record<string, any>
  lastScannedAt?: string | Date
  isActive: boolean
  createdAt: string | Date
  updatedAt: string | Date
  // Campos calculados para compatibilidade com UI
  collection?: string
  connectionUri?: string
  credentials?: string
  fullPath?: string
  status?: DataSourceStatus
  lastScan?: string
  lastSynced?: string
}

export interface PagedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface Relationship {
  id: string
  collectionId: string
  sourceTable: string
  sourceColumn: string
  targetTable: string
  targetColumn: string
  relationshipType: string
  createdAt: string | Date
  updatedAt: string | Date
}

// RF04.1 - Modelos de IA
export type ModelOrigin = 'OpenRouter' | 'Internal'

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

export interface ModelsResponse {
  models: Model[]
  total: number
}

export interface CreateModelRequest {
  name: string
  identifier: string
  description?: string
  origin: ModelOrigin
}

export interface UpdateModelRequest {
  name?: string
  description?: string
  isActive?: boolean
}

// Definições de tipos TypeScript para o projeto Delfos

export interface User {
  id: string
  name: string
  email: string
}

export type CollectionStatus = 'active' | 'indexing' | 'error'

export interface Collection {
  id: string
  name: string
  description?: string
  schema?: Record<string, unknown>
  status: CollectionStatus
  dataSourcesCount: number
  owner: string
  lastScan: string
}

export type DataSourceType = 'PostgreSQL' | 'MySQL' | 'S3' | 'Kafka' | 'MongoDB' | 'Redis'
export type DataSourceStatus = 'active' | 'error' | 'disabled' | 'pending'

export interface DataSource {
  id: string
  name: string
  type: DataSourceType
  collection: string
  collectionId?: string
  connectionUri?: string
  credentials?: string
  fullPath?: string
  status: DataSourceStatus
  lastScan: string
  lastSynced?: string
}


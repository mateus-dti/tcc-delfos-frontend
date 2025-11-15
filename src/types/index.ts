// Definições de tipos TypeScript para o projeto Delfos

export interface User {
  id: string
  name: string
  email: string
}

export interface Collection {
  id: string
  name: string
  description?: string
  schema?: Record<string, unknown>
}


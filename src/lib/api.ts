// Serviço base para fazer requisições HTTP autenticadas

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export interface ApiError {
  error: {
    code: string
    message: string
    details?: any
  }
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token')
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `Erro ${response.status}: ${response.statusText || 'Erro desconhecido'}`
      
      try {
        const errorData: ApiError = await response.json()
        if (errorData.error?.message) {
          errorMessage = errorData.error.message
        } else if (typeof errorData === 'string') {
          errorMessage = errorData
        }
      } catch (e) {
        // Se não conseguir fazer parse do erro, usa a mensagem padrão
      }

      throw new Error(errorMessage)
    }

    // Se a resposta estiver vazia (status 204), retorna null
    if (response.status === 204) {
      return null as T
    }

    return response.json()
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getAuthHeaders(),
      credentials: 'include',
    })

    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      credentials: 'include',
    })

    return this.handleResponse<T>(response)
  }
}

export const apiClient = new ApiClient()


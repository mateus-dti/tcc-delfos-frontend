// Serviço de autenticação para integração com o backend

import { apiClient } from '@/lib/api'
import { User } from '@/types'

export interface LoginCredentials {
  usernameOrEmail: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    username: string
    email: string
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Login não usa o apiClient porque ainda não temos token
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: credentials.usernameOrEmail,
        password: credentials.password,
      }),
    })

    if (!response.ok) {
      let errorMessage = 'Login failed'
      try {
        const errorData = await response.json()
        if (errorData.error?.message) {
          errorMessage = errorData.error.message
        } else if (errorData.message) {
          errorMessage = errorData.message
        }
        console.error('Login error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        })
      } catch (e) {
        console.error('Failed to parse error response:', e)
        errorMessage = `Erro ${response.status}: ${response.statusText || 'Erro desconhecido'}`
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    
    // Salva o token e usuário no localStorage
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    return data
  },

  async logout(): Promise<void> {
    try {
      // Tenta fazer logout no backend
      await apiClient.post('/api/auth/logout')
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Sempre limpa o localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await apiClient.get<User>('/api/auth/me')
      localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (error) {
      console.error('Error fetching current user:', error)
      return null
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}


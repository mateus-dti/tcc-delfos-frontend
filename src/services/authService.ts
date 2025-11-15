// Serviço de autenticação para integração com o backend

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.usernameOrEmail,
        email: credentials.usernameOrEmail,
        password: credentials.password,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Invalid credentials',
      }))
      throw new Error(error.message || 'Login failed')
    }

    return response.json()
  },

  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}


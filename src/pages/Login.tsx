import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ThemeToggle'
import { AlertCircle, X } from 'lucide-react'

interface LoginFormValues {
  usernameOrEmail: string
  password: string
}

function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<LoginFormValues>({
    usernameOrEmail: '',
    password: '',
  })
  const [fieldErrors, setFieldErrors] = useState<{
    usernameOrEmail?: string
    password?: string
  }>({})

  const validateEmail = (value: string): string | undefined => {
    if (!value) {
      return 'Username or email is required'
    }
    if (value.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
    }
    return undefined
  }

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {}
    
    const emailError = validateEmail(formData.usernameOrEmail)
    if (emailError) {
      errors.usernameOrEmail = emailError
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const data = await authService.login(formData)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4">
      {/* Botão de Tema - Canto Superior Direito */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex h-full grow flex-col items-center justify-center w-full">
        <div className="flex flex-col w-full max-w-md flex-1 items-center justify-center">
          <Card className="flex flex-col items-center p-8 sm:p-10 w-full bg-white dark:bg-[#1a2831] rounded-xl shadow-sm dark:shadow-none border-slate-200 dark:border-slate-800">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-4xl">database</span>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Delfos</h1>
            </div>

            {/* Título e Subtítulo */}
            <div className="text-center mb-8 pt-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white pt-6">
                Sign In
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal pb-6 pt-1">
                Sign in to access your data assistant.
              </p>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <button
                    onClick={() => setError(null)}
                    className="ml-4 hover:opacity-70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </AlertDescription>
              </Alert>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <div className="flex w-full flex-wrap items-end gap-2">
                <Label htmlFor="usernameOrEmail" className="flex flex-col w-full flex-1">
                  <p className="text-slate-800 dark:text-white text-sm font-medium leading-normal pb-2">
                    Username or Email
                  </p>
                  <Input
                    id="usernameOrEmail"
                    type="email"
                    placeholder="Enter your username or email"
                    value={formData.usernameOrEmail}
                    onChange={(e) => {
                      setFormData({ ...formData, usernameOrEmail: e.target.value })
                      if (fieldErrors.usernameOrEmail) {
                        setFieldErrors({ ...fieldErrors, usernameOrEmail: undefined })
                      }
                    }}
                    className={`${
                      fieldErrors.usernameOrEmail
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                    }`}
                  />
                  {fieldErrors.usernameOrEmail && (
                    <p className="text-red-600 dark:text-red-500 text-sm mt-2">
                      {fieldErrors.usernameOrEmail}
                    </p>
                  )}
                </Label>
              </div>

              <div className="flex w-full flex-wrap items-end gap-2">
                <Label htmlFor="password" className="flex flex-col w-full flex-1">
                  <p className="text-slate-800 dark:text-white text-sm font-medium leading-normal pb-2">
                    Password
                  </p>
                  <PasswordInput
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      if (fieldErrors.password) {
                        setFieldErrors({ ...fieldErrors, password: undefined })
                      }
                    }}
                    className={`${
                      fieldErrors.password
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                    }`}
                  />
                  {fieldErrors.password && (
                    <p className="text-red-600 dark:text-red-500 text-sm mt-2">
                      {fieldErrors.password}
                    </p>
                  )}
                </Label>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white"
              >
                {loading ? 'Loading...' : 'Login'}
              </Button>
            </form>

            {/* Link de Ajuda no Rodapé */}
            <CardFooter className="w-full text-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                © 2024 Delfos. All Rights Reserved.{' '}
                <a href="#" className="text-primary hover:underline">
                  Help
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login

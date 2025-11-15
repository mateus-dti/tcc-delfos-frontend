import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ThemeToggle'

function ForgotPassword() {
  const navigate = useNavigate()

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4">
      {/* Botão de Tema - Canto Superior Direito */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex h-full grow flex-col items-center justify-center w-full">
        <div className="flex flex-col w-full max-w-md flex-1 items-center justify-center">
          <Card className="flex flex-col items-center p-8 sm:p-10 w-full bg-white dark:bg-[#1a2831] rounded-xl shadow-sm dark:shadow-none border-slate-200 dark:border-slate-800">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                Forgot Password
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal pt-1">
                This page will be implemented soon
              </p>
            </div>
            <Button
              onClick={() => navigate('/login')}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white"
            >
              Back to Login
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

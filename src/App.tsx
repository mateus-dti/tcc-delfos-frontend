import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Collections from './pages/Collections'
import DataSources from './pages/DataSources'
import CreateCollection from './pages/CreateCollection'
import CreateDataSource from './pages/CreateDataSource'
import CollectionDetails from './pages/CollectionDetails'
import { authService } from './services/authService'
import { ThemeToggle } from './components/ThemeToggle'

// Componente de rota protegida
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

// Página Dashboard temporária
function Dashboard() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
      {/* Botão de Tema - Canto Superior Direito */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-7xl mx-auto pt-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Bem-vindo ao Delfos!
        </p>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections"
          element={
            <ProtectedRoute>
              <Collections />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections/new"
          element={
            <ProtectedRoute>
              <CreateCollection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections/:id"
          element={
            <ProtectedRoute>
              <CollectionDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections/:id/edit"
          element={
            <ProtectedRoute>
              <CreateCollection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/data-sources"
          element={
            <ProtectedRoute>
              <DataSources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/data-sources/new"
          element={
            <ProtectedRoute>
              <CreateDataSource />
            </ProtectedRoute>
          }
        />
        <Route
          path="/data-sources/:id/edit"
          element={
            <ProtectedRoute>
              <CreateDataSource />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App


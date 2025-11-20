import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Collections from './pages/Collections'
import DataSources from './pages/DataSources'
import CreateCollection from './pages/CreateCollection'
import CreateDataSource from './pages/CreateDataSource'
import CollectionDetails from './pages/CollectionDetails'
import Query from './pages/Query'
import Models from './pages/Models'
import { authService } from './services/authService'

// Componente de rota protegida
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/query"
          element={
            <ProtectedRoute>
              <Query />
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/models"
          element={
            <ProtectedRoute>
              <Models />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App


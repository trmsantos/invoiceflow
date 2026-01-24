import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Toaster } from 'sonner'

// Pages
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import InvoiceList from '@/pages/InvoiceList'
import InvoiceCreate from '@/pages/InvoiceCreate'
import InvoiceDetail from '@/pages/InvoiceDetail'
import NotFound from '@/pages/NotFound'
import Billing from '@/pages/Billing'

// Layout
import MainLayout from '@/layouts/MainLayout'

const ProtectedRoute = () => {
  const { isAuthenticated, initialized } = useAuth();
  if (!initialized) return null;
  // true evita que o login fique no histórico atrás do dashboard
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// 2. Componente que impede utilizadores logados de verem o login
const PublicRoute = () => {
  const { isAuthenticated, initialized } = useAuth()
  
  if (!initialized) return null

  // Se já estiver logado e tentar ir ao login, manda para o dashboard
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

function App() {
  const { initialized } = useAuth()

  // Opcional: Spinner global enquanto a app arranca a primeira vez
  if (!initialized) {
     return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/invoices" element={<InvoiceList />} />
              <Route path="/invoices/new" element={<InvoiceCreate />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/billing" element={<Billing />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
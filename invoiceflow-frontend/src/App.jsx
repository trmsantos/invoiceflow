import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Toaster } from 'sonner'

// Pages
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import InvoiceList from '@/pages/InvoiceList'
import InvoiceCreate from '@/pages/InvoiceCreate'
import NotFound from '@/pages/NotFound'

// Layout
import MainLayout from '@/layouts/MainLayout'

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/invoices" element={<InvoiceList />} />
                <Route path="/invoices/new" element={<InvoiceCreate />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
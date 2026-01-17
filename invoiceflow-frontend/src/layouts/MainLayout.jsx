import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/common/Button'

export default function MainLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-blue-600">InvoiceFlow</h1>
            <div className="flex gap-6">
              <a href="/invoices" className="text-gray-600 hover:text-gray-900">
                Invoices
              </a>
              <a href="/billing" className="text-gray-600 hover:text-gray-900">
                Billing
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Sidebar + Main */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Content */}
        <Outlet />
      </div>
    </div>
  )
}
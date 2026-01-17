import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const store = useAuthStore()
  
  useEffect(() => {
    console.log('useAuth: Calling init()')
    store.init()
  }, []) // ← Dependency array vazio

  return {
    user: store.user,
    loading: store.loading,
    error: store.error,
    isAuthenticated: !!store.user, // ← True se user existe
    login: store.login,
    register: store.register,
    logout: store.logout,
  }
}

export const useRequireAuth = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, loading, navigate])
}
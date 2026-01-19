// useAuth.js
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const store = useAuthStore()
  
  useEffect(() => {
    // Só chama o init se ainda não tiver sido inicializado
    if (!store.initialized) {
        console.log('useAuth: Calling init()')
        store.init()
    }
  }, [store.initialized]) // Adicionado dependência

  return {
    user: store.user,
    loading: store.loading,
    error: store.error,
    isAuthenticated: !!store.user,
    login: store.login,
    register: store.register,
    logout: store.logout,
    initialized: store.initialized // Útil para saber se o check inicial já acabou
  }
}
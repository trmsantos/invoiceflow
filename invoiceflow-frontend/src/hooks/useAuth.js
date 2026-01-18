import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const store = useAuthStore()
  
  useEffect(() => {
    console.log('useAuth: Calling init() once')
    store.init()
  }, []) 

  return {
    user: store.user,
    loading: store.loading,
    error: store.error,
    isAuthenticated: !!store.user,
    login: store.login,
    register: store.register,
    logout: store.logout,
  }
}
import { create } from 'zustand'
import api from '@/services/api'

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,  

  init: async () => {
    const token = localStorage.getItem('access_token')
    
    if (token) {
      try {
        const response = await api.get('/auth/me/')
        set({ user: response.data, initialized: true }) 
      } catch (error) {
        console.error('authStore init error:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        // ERRO: Define user como null MAS initialized como true (já acabou de verificar)
        set({ user: null, initialized: true }) 
      }
    } else {
      set({ initialized: true }) 
    }
  },

  register: async (email, password, firstName, lastName) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post('/auth/register/', {
        email,
        password,
        password2: password,
        first_name: firstName,
        last_name: lastName,
      })

      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)

      set({ user: response.data.user, loading: false })
      return true
    } catch (error) {
      set({
        error: error.response?.data?.detail || error.response?.data?.password2?.[0] || 'Registration failed',
        loading: false
      })
      return false
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post('/auth/login/', { email, password })

      console.log('Login response:', response.data)

      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)

      set({ 
        user: response.data.user, 
        loading: false 
      })
      
      console.log('User set to:', response.data.user)
      
      return true
    } catch (error) {
      console.error('Login error:', error) 
      set({
        error: error.response?.data?.detail || 'Login failed',
        loading: false
      })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ user: null, initialized: false })
  },
}))


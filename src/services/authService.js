import { api } from './api'

export const authService = {
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    return data
  },
  
  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },
  
  getUsers: async () => {
    const { data } = await api.get('/auth/users')
    return data
  },
  
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData)
    return data
  },
  
  deleteUser: async (userId) => {
    const { data } = await api.delete(`/auth/users/${userId}`)
    return data
  }
}

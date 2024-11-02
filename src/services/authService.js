import { api } from './api'

export const authService = {
  login: async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials)
      return data
    } catch (error) {
      throw error
    }
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
  },
  
  adminChangePassword: async ({ userId, newPassword }) => {
    const response = await api.put('/auth/admin/change-password', {
      userId,
      newPassword
    })
    return response.data
  },
  
  changePassword: async ({ currentPassword, newPassword }) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    })
    return response.data
  }
}

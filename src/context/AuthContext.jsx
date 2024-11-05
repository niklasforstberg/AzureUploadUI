import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const login = useCallback((userData) => {
    setUser(userData)
    localStorage.setItem('token', userData.token)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.clear()
    queryClient.clear()
    navigate('/login')
  }, [navigate, queryClient])

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
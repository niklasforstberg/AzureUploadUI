import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Box, CircularProgress } from '@mui/material'

export function ProtectedRoute() {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  console.log('ProtectedRoute check:', { isAuthenticated, location })

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
} 
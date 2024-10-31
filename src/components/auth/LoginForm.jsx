import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { 
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'

export function LoginForm() {
  const { login, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data)
    }
  })

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    loginMutation.mutate(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper 
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            textAlign="center"
          >
            Login
          </Typography>

          {loginMutation.error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
            >
              {loginMutation.error.response?.data?.message || 'Login failed'}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              error={loginMutation.error && !formData.username}
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              error={loginMutation.error && !formData.password}
            />

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              loading={loginMutation.isPending}
              sx={{ mt: 3 }}
            >
              Login
            </LoadingButton>
          </form>
        </Paper>
      </Box>
    </Container>
  )
} 
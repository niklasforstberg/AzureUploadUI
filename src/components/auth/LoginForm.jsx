import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loginError, setLoginError] = useState(null)
  
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setLoginError(null)
      login(data)
    },
    onError: (error) => {
      setLoginError(error.response?.data?.message || 'Login failed')
    },
    retry: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!loginMutation.isPending) {
      setLoginError(null)
      loginMutation.mutate(formData)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            textAlign="center"
          >
            Login
          </Typography>

          {loginError && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
            >
              {loginError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                [e.target.name]: e.target.value
              }))}
              margin="normal"
              required
              disabled={loginMutation.isPending}
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                [e.target.name]: e.target.value
              }))}
              margin="normal"
              required
              disabled={loginMutation.isPending}
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
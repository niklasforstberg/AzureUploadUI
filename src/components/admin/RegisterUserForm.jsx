import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  TextField,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { authService } from '../../services/authService'

export function RegisterUserForm({ onSuccess }) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'USER'
  })

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      onSuccess()
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    registerMutation.mutate(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>Register New User</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {registerMutation.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {registerMutation.error.message}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
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
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSuccess}>
          Cancel
        </Button>
        <LoadingButton 
          loading={registerMutation.isPending}
          type="submit" 
          variant="contained"
        >
          Register
        </LoadingButton>
      </DialogActions>
    </form>
  )
}

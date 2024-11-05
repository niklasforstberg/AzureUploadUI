import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Stack
} from '@mui/material'

export function ChangePasswordDialog({ open, onClose, userId, mutation }) {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [validationError, setValidationError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear validation error when user types
    setValidationError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }

    mutation.mutate({ userId, newPassword: formData.newPassword })
  }

  const handleClose = () => {
    setFormData({ newPassword: '', confirmPassword: '' })
    setValidationError('')
    mutation.reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Change User Password</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              label="New Password"
              type="password"
              fullWidth
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              error={Boolean(validationError)}
              helperText={validationError}
            />
            {mutation.error && (
              <Alert severity="error">
                {mutation.error.response?.data || 'Failed to change password'}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

import { useState } from 'react'
import { 
  Box, 
  TextField, 
  Button, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link 
} from '@mui/material'
import { authService } from '../../services/authService'

export function ChangePasswordForm() {
  const [open, setOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    try {
      await authService.changePassword({
        currentPassword,
        newPassword
      })
      setSuccess(true)
      setTimeout(handleClose, 1500) // Close dialog after showing success message
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password')
    }
  }

  return (
    <>
      <Link
        component="button"
        variant="body2"
        onClick={handleOpen}
        sx={{ cursor: 'pointer' }}
      >
        Change Password
      </Link>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>Password successfully changed</Alert>}
            
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

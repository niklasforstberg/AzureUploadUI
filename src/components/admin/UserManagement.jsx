import { useState } from 'react'
import { 
  Box, 
  Button, 
  Dialog,
  Typography 
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { UsersList } from './UsersList'
import { RegisterUserForm } from './RegisterUserForm'

export function UserManagement() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsRegisterOpen(true)}
        >
          Add User
        </Button>
      </Box>

      <UsersList />

      <Dialog 
        open={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <RegisterUserForm onSuccess={() => setIsRegisterOpen(false)} />
      </Dialog>
    </Box>
  )
}

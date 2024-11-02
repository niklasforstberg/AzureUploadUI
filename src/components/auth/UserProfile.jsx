import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Divider,
  Chip
} from '@mui/material'
import { Person } from '@mui/icons-material'
import { useUser } from '../../hooks/useUser'
import { ChangePasswordForm } from './ChangePasswordForm'

export function UserProfile() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return null // Layout will show loading state
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              mb: 2
            }}
          >
            <Person sx={{ fontSize: 60 }} />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            {user.username}
          </Typography>
          <Chip
            label={user.role}
            color={user.role === 'ADMIN' ? 'error' : 'primary'}
            sx={{ mt: 1 }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            User ID
          </Typography>
          <Typography variant="body1" gutterBottom>
            {user.id}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
            Role
          </Typography>
          <Typography variant="body1" gutterBottom>
            {user.role === 'ADMIN' ? 'Administrator' : 'Standard User'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Security
          </Typography>
          <ChangePasswordForm />
        </Box>
      </CardContent>
    </Card>
  )
}

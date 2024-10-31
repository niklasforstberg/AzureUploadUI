import { Box, Container, Typography, Paper } from '@mui/material'
import { UserProfile } from '../components/auth/UserProfile'
import { useFiles } from '../hooks/useFiles'

export function ProfilePage() {
  const { files } = useFiles()

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* User Profile Card */}
          <Box sx={{ flex: 1 }}>
            <UserProfile />
          </Box>

          {/* Stats Card */}
          <Paper 
            elevation={3} 
            sx={{ 
              flex: 1, 
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2 
            }}
          >
            <Typography variant="h6" gutterBottom>
              Account Statistics
            </Typography>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Total Files
              </Typography>
              <Typography variant="h4">
                {files?.length || 0}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Total Storage Used
              </Typography>
              <Typography variant="h4">
                {formatStorageSize(files?.reduce((acc, file) => acc + file.size, 0) || 0)}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  )
}

// Helper function to format storage size
function formatStorageSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

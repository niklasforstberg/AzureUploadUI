import { Box, Typography, CircularProgress, Paper } from '@mui/material'
import { useFiles } from '../hooks/useFiles'
import { FilesList } from '../components/files/FilesList'

export function Dashboard() {
  const { files, isLoading, error } = useFiles()

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
        <Typography>Error loading files: {error.message}</Typography>
      </Paper>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Files
      </Typography>
      
      {files.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            wow, such empty
          </Typography>
        </Paper>
      ) : (
        <FilesList files={files} />
      )}
    </Box>
  )
}

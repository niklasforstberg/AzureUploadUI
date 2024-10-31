import { useState } from 'react'
import { 
  Box, 
  Typography, 
  Paper,
  Button,
  CircularProgress
} from '@mui/material'
import { CloudUpload } from '@mui/icons-material'
import { useFiles } from '../hooks/useFiles'
import { FilesList } from '../components/files/FilesList'
import { FileUploader } from '../components/files/FileUploader'

export function FilesPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">
          My Files
        </Typography>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => setIsUploadOpen(true)}
        >
          Upload File
        </Button>
      </Box>

      {files.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No files uploaded yet
          </Typography>
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={() => setIsUploadOpen(true)}
            sx={{ mt: 2 }}
          >
            Upload your first file
          </Button>
        </Paper>
      ) : (
        <FilesList files={files} />
      )}

      <FileUploader 
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </Box>
  )
}

import { useCallback, useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Alert,
  TextField,
  Button,
  Paper
} from '@mui/material'
import { 
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  FileUpload as FileUploadIcon 
} from '@mui/icons-material'
import { useDropzone } from 'react-dropzone'
import { fileService } from '../../services/fileService'

export function FileUploader({ open, onClose }) {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: fileService.uploadFile,
    onSuccess: (data) => {
      setUploadedFile(data)
      setSelectedFile(null)
      queryClient.invalidateQueries(['my-files'])
    },
    onError: (error) => {
      console.error('Upload error:', error)
    }
  })

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      setSelectedFile(acceptedFiles[0])
      uploadMutation.reset()
    }
  }, [uploadMutation])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  })

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData()
      formData.append('file', selectedFile)
      uploadMutation.mutate(formData)
    }
  }

  const handleClose = () => {
    uploadMutation.reset()
    setUploadedFile(null)
    setSelectedFile(null)
    onClose()
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(uploadedFile.uri)
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Upload File
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {uploadMutation.error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              uploadMutation.error.response?.status === 409 && (
                <Button 
                  color="inherit" 
                  size="small"
                  onClick={() => setSelectedFile(null)}
                >
                  Choose Different File
                </Button>
              )
            }
          >
            {uploadMutation.error.response?.status === 409 
              ? 'A file with this name already exists. Please rename the file or choose a different one.'
              : uploadMutation.error.message || 'Failed to upload file. Please try again.'}
          </Alert>
        )}

        {uploadedFile ? (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              File uploaded successfully!
            </Alert>
            
            <Typography variant="subtitle2" gutterBottom>
              File Details:
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">
                Name: {uploadedFile.name}
              </Typography>
              <Typography variant="body2">
                Size: {formatBytes(uploadedFile.size)}
              </Typography>
              <Typography variant="body2">
                Type: {uploadedFile.contentType}
              </Typography>
            </Box>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                File URL:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={uploadedFile.uri}
                  InputProps={{ readOnly: true }}
                />
                <IconButton onClick={handleCopyUrl} color="primary">
                  <CopyIcon />
                </IconButton>
              </Box>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setUploadedFile(null)
                  uploadMutation.reset()
                }}
              >
                Upload Another
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Paper
              {...getRootProps()}
              variant="outlined"
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                borderStyle: 'dashed',
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              <input {...getInputProps()} />
              <FileUploadIcon sx={{ fontSize: 48, color: 'action.active', mb: 1 }} />
              
              <Typography variant="h6" gutterBottom>
                {isDragActive ? 'Drop the file here' : 
                  selectedFile ? `Selected: ${selectedFile.name}` : 
                  'Drag & drop a file here'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                {!selectedFile && 'or click to select a file'}
              </Typography>

              {uploadMutation.isPending && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Uploading...
                  </Typography>
                </Box>
              )}
            </Paper>

            {selectedFile && !uploadMutation.isPending && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={() => {
                  setSelectedFile(null)
                  uploadMutation.reset()
                }}>
                  Clear
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  startIcon={<FileUploadIcon />}
                >
                  Upload
                </Button>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
      </DialogActions>
    </Dialog>
  )
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

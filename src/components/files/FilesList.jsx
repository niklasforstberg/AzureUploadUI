import { useState } from 'react'
import { 
  Typography,
  Tooltip,
  Snackbar,
  Box,
  Collapse,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert
} from '@mui/material'
import { 
  Delete, 
  ContentCopy, 
  ExpandMore, 
  ExpandLess 
} from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fileService } from '../../services/fileService'

export function FilesList({ files }) {
  const [expandedId, setExpandedId] = useState(null)
  const [showCopySuccess, setShowCopySuccess] = useState(false)
  const [deleteFile, setDeleteFile] = useState(null)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: fileService.deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries(['my-files'])
      setDeleteFile(null)
    }
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
  }

  const handleCopyUrl = async (uri) => {
    try {
      await navigator.clipboard.writeText(uri)
      setShowCopySuccess(true)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleDeleteClick = (file) => {
    setDeleteFile(file)
  }

  const handleDeleteConfirm = () => {
    if (deleteFile) {
      deleteMutation.mutate(deleteFile.blobName)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteFile(null)
    deleteMutation.reset()
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {files.map((file) => (
          <Paper 
            key={file.id}
            elevation={1}
            sx={{ overflow: 'hidden' }}
          >
            <Box
              sx={{
                p: 2,
                '&:hover': { bgcolor: 'action.hover' },
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>{file.blobName}</Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => toggleExpand(file.id)}
                  >
                    {expandedId === file.id ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                <IconButton 
                  color="error" 
                  size="small"
                  onClick={() => handleDeleteClick(file)}
                >
                  <Delete />
                </IconButton>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'text.secondary',
                fontSize: '0.875rem',
                wordBreak: 'break-all'
              }}>
                {file.azureUri}
                <Tooltip title="Copy URL">
                  <IconButton 
                    onClick={() => handleCopyUrl(file.azureUri)}
                    color="primary"
                    size="small"
                    sx={{ flexShrink: 0 }}
                  >
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <Collapse in={expandedId === file.id} timeout="auto">
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'action.hover',
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Original Filename: {file.fileName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Size: {formatSize(file.size)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Uploaded: {formatDate(file.uploadDate)}
                </Typography>
              </Box>
            </Collapse>
          </Paper>
        ))}
      </Box>

      <Dialog
        open={Boolean(deleteFile)}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete File</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this file?
          </Typography>
          {deleteFile && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {deleteFile.blobName}
            </Typography>
          )}
          {deleteMutation.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to delete file: {deleteMutation.error.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showCopySuccess}
        autoHideDuration={2000}
        onClose={() => setShowCopySuccess(false)}
        message="URL copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  )
}

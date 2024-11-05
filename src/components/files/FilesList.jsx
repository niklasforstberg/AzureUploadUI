import React from 'react'
import { useState } from 'react'
import { 
  Typography,
  Tooltip,
  Snackbar,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Link
} from '@mui/material'
import { 
  Delete, 
  ContentCopy, 
  KeyboardArrowDown,
  KeyboardArrowUp
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

  const handleCopyUrl = async (uri) => {
    try {
      await navigator.clipboard.writeText(uri)
      setShowCopySuccess(true)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).replace(',', '')
  }

  const formatSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ width: '40px' }} />
              <TableCell sx={{ width: '200px' }}>Name</TableCell>
              <TableCell align="right" sx={{ width: '150px' }}>Uploaded</TableCell>
              <TableCell sx={{ pr: 0, width: 'auto' }}>URL</TableCell>
              <TableCell align="right" sx={{ pl: 1, width: '100px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <React.Fragment key={file.id}>
                <TableRow 
                  sx={{ 
                    '&:hover': { bgcolor: 'action.hover' },
                    cursor: 'pointer'
                  }}
                >
                  <TableCell padding="checkbox">
                    <IconButton
                      size="small"
                      onClick={() => setExpandedId(expandedId === file.id ? null : file.id)}
                    >
                      {expandedId === file.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell 
                    component="th" 
                    scope="row"
                    onClick={() => setExpandedId(expandedId === file.id ? null : file.id)}
                  >
                    {file.blobName}
                  </TableCell>
                  <TableCell 
                    align="right"
                    onClick={() => setExpandedId(expandedId === file.id ? null : file.id)}
                  >
                    {formatDate(file.uploadDate)}
                  </TableCell>
                  <TableCell 
                    sx={{
                      maxWidth: '300px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      pr: 0
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      href={file.azureUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'inherit',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {file.azureUri}
                    </Link>
                  </TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      whiteSpace: 'nowrap',
                      pl: 1
                    }}
                  >
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopyUrl(file.azureUri)}
                      color="primary"
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => setDeleteFile(file)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={expandedId === file.id} timeout="auto" unmountOnExit>
                      <Box sx={{ py: 2, px: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          File Details
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Original Filename: {file.fileName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Size: {formatSize(file.size)}
                        </Typography>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteFile)}
        onClose={() => setDeleteFile(null)}
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
            onClick={() => setDeleteFile(null)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => deleteMutation.mutate(deleteFile.blobName)}
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

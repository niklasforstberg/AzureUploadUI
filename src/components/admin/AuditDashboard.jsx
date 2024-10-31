import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress
} from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'
import { fileService } from '../../services/fileService'

export function AuditDashboard() {
  const [isCleanup, setIsCleanup] = useState(false)

  const { data: audit, isLoading, error, refetch } = useQuery({
    queryKey: ['audit-files', isCleanup],
    queryFn: () => fileService.getAuditFiles(isCleanup)
  })

  const cleanupMutation = useMutation({
    mutationFn: () => fileService.getAuditFiles(true),
    onSuccess: () => {
      refetch()
    }
  })

  if (isLoading) {
    return <CircularProgress />
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading audit data: {error.message}
      </Alert>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">
          Orphaned Files
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setIsCleanup(true)}
            disabled={audit.cleanupPerformed}
          >
            Cleanup Files
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Audit Summary
        </Typography>
        <Typography variant="h4">
          {audit.totalOrphaned} orphaned files
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last checked: {new Date(audit.auditTime).toLocaleString()}
        </Typography>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Last Modified</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {audit.orphanedFiles.map((file) => (
              <TableRow key={file.fileName}>
                <TableCell>{file.fileName}</TableCell>
                <TableCell>{file.location}</TableCell>
                <TableCell>{formatBytes(file.size)}</TableCell>
                <TableCell>
                  {new Date(file.lastModified).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

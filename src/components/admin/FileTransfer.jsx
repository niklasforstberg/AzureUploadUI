import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  IconButton
} from '@mui/material'
import { SwapHoriz as TransferIcon, History as HistoryIcon, DeleteForever as DeletedIcon } from '@mui/icons-material'
import { fileService } from '../../services/fileService'
import { authService } from '../../services/authService'

export function FileTransfer() {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [targetUser, setTargetUser] = useState('')
  const [transferDialogOpen, setTransferDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: inventory, isLoading: isLoadingFiles } = useQuery({
    queryKey: ['file-inventory'],
    queryFn: fileService.getFileInventory
  })

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: authService.getUsers
  })

  const transferMutation = useMutation({
    mutationFn: ({ newUserId, files }) => 
      fileService.transferFileOwnership(newUserId, files),
    onSuccess: () => {
      queryClient.invalidateQueries(['file-inventory'])
      setSelectedFiles([])
      setTargetUser('')
      setTransferDialogOpen(false)
    }
  })

  const handleTransfer = () => {
    transferMutation.mutate({
      newUserId: targetUser,
      files: selectedFiles
    })
  }

  const handleSelectAll = (event) => {
    if (!inventory?.files) return
    
    if (event.target.checked) {
      setSelectedFiles(inventory.files.map(file => file.blobName))
    } else {
      setSelectedFiles([])
    }
  }

  const handleSelectFile = (blobName) => {
    setSelectedFiles(prev => 
      prev.includes(blobName)
        ? prev.filter(name => name !== blobName)
        : [...prev, blobName]
    )
  }

  const canTransfer = selectedFiles.length > 0

  if (isLoadingFiles || isLoadingUsers) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!inventory?.files || !users) {
    return (
      <Alert severity="error">
        Error loading data. Please try again later.
      </Alert>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">
          File Ownership Transfer
        </Typography>
        <Button
          variant="contained"
          startIcon={<TransferIcon />}
          disabled={!canTransfer}
          onClick={() => setTransferDialogOpen(true)}
        >
          Transfer Selected Files
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedFiles.length === inventory.files.length}
                  indeterminate={selectedFiles.length > 0 && selectedFiles.length < inventory.files.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>File Name</TableCell>
              <TableCell>Current Owner</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell>Last Modified</TableCell>
              <TableCell align="center">Versions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.files.map((file) => (
              <TableRow 
                key={file.blobName}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedFiles.includes(file.blobName)}
                    onChange={() => handleSelectFile(file.blobName)}
                  />
                </TableCell>
                <TableCell>{file.blobName}</TableCell>
                <TableCell>{file.owner?.username || 'No Owner'}</TableCell>
                <TableCell>{file.status}</TableCell>
                <TableCell align="right">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </TableCell>
                <TableCell>
                  {new Date(file.lastModifiedInAzure).toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  {file.versionCount > 1 ? (
                    <Tooltip title={`Found deleted versions`}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <HistoryIcon 
                          fontSize="small" 
                          color="info"
                          sx={{ opacity: 0.7 }}
                        />
                        <Typography variant="body2">
                          {file.versionCount}
                        </Typography>
                      </Box>
                    </Tooltip>
                  ) : (
                    '1'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={transferDialogOpen} onClose={() => setTransferDialogOpen(false)}>
        <DialogTitle>Transfer Files</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Transfer to User</InputLabel>
              <Select
                value={targetUser}
                onChange={(e) => setTargetUser(e.target.value)}
                label="Transfer to User"
              >
                {users.map(user => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Typography>
            Selected files to transfer: {selectedFiles.length}
          </Typography>
          
          {transferMutation.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {transferMutation.error.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleTransfer}
            variant="contained"
            disabled={transferMutation.isPending || !targetUser}
          >
            {transferMutation.isPending ? 'Transferring...' : 'Transfer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

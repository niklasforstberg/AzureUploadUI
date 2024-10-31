import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { authService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

export function UsersList() {
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const [deleteUserId, setDeleteUserId] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: authService.getUsers
  })

  const deleteMutation = useMutation({
    mutationFn: authService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      setDeleteUserId(null)
      setDeleteError(null)
    },
    onError: (error) => {
      setDeleteError(error.response?.data || 'Failed to delete user')
    }
  })

  const handleDeleteClick = (userId) => {
    setDeleteUserId(userId)
    setDeleteError(null)
  }

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(deleteUserId)
  }

  const handleDeleteCancel = () => {
    setDeleteUserId(null)
    setDeleteError(null)
  }

  if (isLoading) {
    return <CircularProgress />
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading users: {error.message}
      </Alert>
    )
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>ID</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role}
                    color={user.role === 'ADMIN' ? 'error' : 'primary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="error"
                    onClick={() => handleDeleteClick(user.id)}
                    disabled={user.id === currentUser.id} // Prevent self-deletion
                    title={user.id === currentUser.id ? "Cannot delete your own account" : "Delete user"}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteUserId)}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
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
    </>
  )
}

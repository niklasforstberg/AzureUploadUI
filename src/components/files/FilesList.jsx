import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Typography 
} from '@mui/material'
import { Delete, Download } from '@mui/icons-material'

export function FilesList({ files }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
  }

  return (
    <List>
      {files.map((file) => (
        <ListItem
          key={file.id}
          sx={{
            bgcolor: 'background.paper',
            mb: 1,
            borderRadius: 1,
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <ListItemText
            primary={file.fileName}
            secondary={
              <>
                <Typography component="span" variant="body2" color="text.secondary">
                  Size: {formatSize(file.size)} • Uploaded: {formatDate(file.uploadDate)}
                </Typography>
              </>
            }
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="download" sx={{ mr: 1 }}>
              <Download />
            </IconButton>
            <IconButton edge="end" aria-label="delete" color="error">
              <Delete />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}

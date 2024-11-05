import { useState } from 'react'
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Paper 
} from '@mui/material'
import { UserManagement } from '../components/admin/UserManagement'
import { AuditDashboard } from '../components/admin/AuditDashboard'
import { FileTransfer } from '../components/admin/FileTransfer'

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

export function AdminPage() {
  const [currentTab, setCurrentTab] = useState(0)

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="User Management" />
          <Tab label="File Audit" />
          <Tab label="File Ownership Transfer" />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <UserManagement />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <AuditDashboard />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <FileTransfer />
        </TabPanel>
      </Paper>
    </Box>
  )
}

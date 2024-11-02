import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { LoginForm } from './components/auth/LoginForm'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AdminRoute } from './routes/AdminRoute'
import { Layout } from './components/layout/Layout'
import { FilesPage } from './pages/FilesPage'
import { AdminPage } from './pages/AdminPage'
import { ProfilePage } from './pages/ProfilePage'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from './theme'
import { useAuth } from './context/AuthContext'

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/files" replace /> : <LoginForm key={location.key} />
        } />
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/files" replace />} />
            <Route path="/files" element={<FilesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            } />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/files" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App

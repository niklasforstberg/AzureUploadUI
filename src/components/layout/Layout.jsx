import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Divider
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Dashboard,
  CloudUpload,
  Person,
  AdminPanelSettings,
  Logout as LogoutIcon,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 240;

export const Layout = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleDrawerToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleProfileToggle = () => {
    setProfileOpen(!profileOpen);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const menuItems = [
    { text: 'Files', icon: <CloudUpload />, path: '/files' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
  ];

  if (isAdmin) {
    menuItems.push({ text: 'Admin', icon: <AdminPanelSettings />, path: '/admin' });
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: '100%'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Azure Upload
          </Typography>
          <IconButton
            onClick={handleProfileToggle}
            size="small"
            sx={{ ml: 2 }}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {mounted && (
        <>
          <Drawer
            variant="temporary"
            open={menuOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: false,
            }}
            sx={{
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
              },
            }}
          >
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigate(item.path)}
                  >
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>

          <Drawer
            variant="temporary"
            anchor="right"
            open={profileOpen}
            onClose={handleProfileToggle}
            ModalProps={{
              keepMounted: false,
            }}
            sx={{
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 2 
              }}>
                <Avatar sx={{ width: 40, height: 40 }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">
                    {user?.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.role}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 1 }} />
            </Box>
            
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleNavigate('/profile')}>
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText primary="My Profile" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          </Drawer>
        </>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

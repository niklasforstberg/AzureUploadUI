import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1F2833',
      light: '#2f3b4d',
      dark: '#161d26',
    },
    secondary: {
      main: '#A18654',
      light: '#b29b6d',
      dark: '#816b43',
    },
    background: {
      default: '#F5F6F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2833',
      secondary: '#61594B',
    },
    grey: {
      main: '#41454C',
    },
    neutral: {
      dark: '#7487A1',
      main: '#41454C',
      light: '#61594B',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      color: '#332F28',
      fontWeight: 600,
    },
    h2: {
      color: '#332F28',
      fontWeight: 600,
    },
    h3: {
      color: '#332F28',
      fontWeight: 500,
    },
    body1: {
      color: '#332F28',
    },
    body2: {
      color: '#61594B',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#7487A1',
          borderRadius: '0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#5d6d81',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid #E0E0E0',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#F5F6F7',
          color: '#41454C',
          fontWeight: 600,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#7487A1',
          color: '#FFFFFF',
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
          top: '64px',
          height: 'calc(100% - 64px)',
        },
      },
    },
  },
})

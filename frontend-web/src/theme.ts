import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff', // White background
      contrastText: '#000000',
    },
    secondary: {
      main: '#d32f2f', // Red (header/footer)
      light: '#ff6659',
      dark: '#9a0007',
    },
    success: {
      main: '#2e7d32', // Green for success
    },
    warning: {
      main: '#d32f2f', // Red for warnings
    },
    error: {
      main: '#d32f2f', // Red for errors
    },
    info: {
      main: '#1976d2', // Blue
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#d32f2f', // Red header
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#d32f2f',
          '&:hover': {
            backgroundColor: '#9a0007',
          },
        },
      },
    },
  },
});
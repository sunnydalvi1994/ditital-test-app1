
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0d4689',
      light: '#3a76b9',
      dark: '#082d5a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4fbbc8',
      light: '#7fd4dc',
      dark: '#3a8c96',
      contrastText: '#ffffff',
    },
    success: {
      main: '#28a745',
      light: '#5cb85c',
      dark: '#1e7e34',
    },
    error: {
      main: '#dc3545',
      light: '#f86c6b',
      dark: '#bd2130',
    },
    warning: {
      main: '#ffc107',
      light: '#ffcd38',
      dark: '#d39e00',
    },
    info: {
      main: '#17a2b8',
      light: '#5bc0de',
      dark: '#117a8b',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
      gradient: 'linear-gradient(135deg, #ffffff, #fff8f0)',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#999999',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { 
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h2: { 
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h3: { 
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h4: { 
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.125rem',
      },
    },
    h5: { 
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    h6: { 
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle1: { 
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.75,
    },
    subtitle2: { 
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.57,
    },
    body1: { 
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: { 
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none',
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0, 0, 0, 0.05)',
    '0 4px 8px rgba(0, 0, 0, 0.08)',
    '0 6px 12px rgba(0, 0, 0, 0.1)',
    '0 8px 16px rgba(0, 0, 0, 0.12)',
    '0 12px 24px rgba(0, 0, 0, 0.15)',
    '0 16px 32px rgba(0, 0, 0, 0.18)',
    '0 20px 40px rgba(0, 0, 0, 0.2)',
    '0 24px 48px rgba(0, 0, 0, 0.22)',
    '0 2px 8px rgba(13, 70, 137, 0.1)',
    '0 4px 12px rgba(13, 70, 137, 0.12)',
    '0 6px 16px rgba(13, 70, 137, 0.15)',
    '0 8px 20px rgba(13, 70, 137, 0.18)',
    '0 12px 28px rgba(13, 70, 137, 0.2)',
    '0 16px 36px rgba(13, 70, 137, 0.22)',
    '0 20px 44px rgba(13, 70, 137, 0.24)',
  ],
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(13, 70, 137, 0.2)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 16px rgba(13, 70, 137, 0.25)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.3s ease',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3a76b9',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0d4689',
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
  },
});

export default theme;

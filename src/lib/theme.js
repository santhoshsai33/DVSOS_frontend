import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#12343B', // --bs-primary
      light: '#1F4E5A',
      dark: '#0B252B', // --color-primary-hover
    },
    secondary: {
      main: '#0F766E', // --color-accent
      light: '#14B8A6',
      dark: '#115E59', // --color-accent-hover
    },
    success: {
      main: '#0F766E', // --bs-success
    },
    error: {
      main: '#B42318', // --bs-danger
    },
    warning: {
      main: '#B7791F', // --bs-warning
    },
    info: {
      main: '#2563EB', // --bs-info
    },
    background: {
      default: '#F4F6F9', // --color-bg-base
      paper: '#FFFFFF', // --color-bg-surface
    },
    text: {
      primary: '#152326', // --color-text-primary
      secondary: '#4B5563', // --color-text-secondary
      disabled: '#8A948A', // --color-text-muted
    },
    divider: '#E5E7EB', // --color-border
  },
  typography: {
    fontFamily: '"Poppins", system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 8, // --radius-sm
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // --radius-sm
          padding: '8px 16px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #12343B 0%, #1F4E5A 100%)',
          boxShadow: 'none',
          '&:hover': {
            background: '#0B252B',
            boxShadow: '0 4px 6px -1px rgba(21, 35, 38, 0.1)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
          boxShadow: 'none',
          '&:hover': {
            background: '#115E59',
            boxShadow: '0 4px 6px -1px rgba(15, 118, 110, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14, // --radius-lg
          boxShadow: 'none', // Reset default MUI shadow
          border: '1px solid #E5E7EB', // --color-border
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // --radius-sm
            backgroundColor: '#FFFFFF', // --color-bg-surface
            transition: 'all 0.2s ease',
            '&.Mui-focused fieldset': {
              borderColor: '#0F766E', // --color-accent
              borderWidth: '1px',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(15, 118, 110, 0.1)',
            }
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#FFFFFF',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0F766E',
            borderWidth: '1px',
          },
          '&.Mui-focused': {
            boxShadow: '0 0 0 3px rgba(15, 118, 110, 0.1)',
          }
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          color: '#4B5563', // --color-text-secondary
          fontSize: '0.875rem',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: 0,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F8FAFC',
          '& .MuiTableCell-root': {
            color: '#475569',
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            padding: '16px 24px',
            borderBottom: '1px solid #E2E8F0',
            borderTop: 'none',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: '#F1F5F9 !important',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          borderBottom: '1px solid #E2E8F0',
          color: '#1E293B',
          fontSize: '0.875rem',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          backgroundColor: '#FFFFFF',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #E2E8F0',
            padding: '8px 24px',
            color: '#1E293B',
            fontSize: '0.875rem',
            '&:focus': { outline: 'none' },
            '&:focus-within': { outline: 'none' },
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            color: '#475569',
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
          },
          '& .MuiDataGrid-columnHeader:focus': { outline: 'none' },
          '& .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
          '& .MuiDataGrid-row': {
            transition: 'background-color 0.2s ease',
            '&:hover': { backgroundColor: '#F1F5F9' },
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
          },
        },
      },
    },
  },
});

export default theme;

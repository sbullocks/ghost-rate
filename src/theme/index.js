import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4F8EF7' },
    secondary: { main: '#F75F4F' },
    background: { default: '#0D0D0D', paper: '#1A1A1A' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
  shape: { borderRadius: 10 },
})

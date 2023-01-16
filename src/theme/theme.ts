import { createTheme } from '@mui/material'

export const theme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#483e3e',
        },
        h1: {
          fontSize: '2em',
          fontStyle: 'italic',
        },
      },
    },
  },
})

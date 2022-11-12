import { Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { ReactNode } from 'react'

export const DefaultContent = ({ children }: { children: ReactNode }) => (
  <Box
    display='grid'
    gridTemplateColumns='1fr 10fr 1fr'
    py={2}
    justifyItems='center'
    sx={{ '& svg': { cursor: 'pointer' } }}
  >
    {children}
  </Box>
)

export const Container = ({ children }: { children: ReactNode }) => (
  <Stack border='1px solid #c4c4c4' borderRadius={1}>
    {children}
  </Stack>
)

export const JMTableRow = ({ children }: { children: ReactNode }) => (
  <Box
    display='grid'
    gridTemplateColumns='5fr 6fr 3fr 2fr 2fr 2fr 2fr 1fr '
    p={2}
    borderRadius={1}
    color='#555'
  >
    {children}
  </Box>
)

export const NoContentTableMessage = ({ msg }: { msg: string }) => (
  <Box width={1} textAlign='center' py={4}>
    <Typography color='#9f9f9f' fontWeight={600} letterSpacing={'0.02em'}>
      {msg}
    </Typography>
  </Box>
)

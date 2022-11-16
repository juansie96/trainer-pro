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
    gridTemplateColumns='3fr 7fr 3fr 2fr 2fr 2fr 2fr 2fr '
    p={2}
    borderRadius={1}
    color='#555'
    alignItems='center'
    justifyItems='center'
  >
    {children}
  </Box>
)

export const JMTableCell = ({
  children,
  justifyItems = 'center',
}: {
  children: ReactNode
  justifyItems?: string
}) => (
  <Stack justifyItems={justifyItems} pt={1} direction='row' alignItems='center'>
    {children}
  </Stack>
)

export const NoContentTableMessage = ({ msg }: { msg: string }) => (
  <Box width={1} textAlign='center' py={4}>
    <Typography color='#9f9f9f' fontWeight={600} letterSpacing={'0.02em'}>
      {msg}
    </Typography>
  </Box>
)

export const Separator = () => (
  <Box width={0.95} bgcolor='#ddd' height='1px' alignSelf='center' my={0.5}></Box>
)

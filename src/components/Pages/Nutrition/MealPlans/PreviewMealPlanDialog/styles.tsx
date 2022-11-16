import { Box, Stack } from '@mui/material'
import { ReactNode } from 'react'

export const Separator = () => <Box width={1} bgcolor='#ddd' height='1px' alignSelf='center'></Box>

export const Point = ({ size, color }: { size: number; color: string }) => (
  <Box height={size} width={size} bgcolor={color} borderRadius='50%' ml={0.7}></Box>
)

export const MacrosSectionContainer = ({ children }: { children: ReactNode }) => (
  <Box width={1}>
    <Stack width={0.9} direction='row' alignItems='center' spacing={3}>
      {children}
    </Stack>
  </Box>
)

export const FoodsTableContainer = ({ children }: { children: ReactNode }) => (
  <Box border='1px solid #ccc' borderRadius={2}>
    {children}
  </Box>
)

export const JMTableRow = ({ children }: { children: ReactNode }) => (
  <Box
    display='grid'
    gridTemplateColumns='2fr 7fr 3fr 2fr 2fr 2fr 2fr 2fr '
    p={2}
    borderRadius={1}
    color='#555'
    alignItems='center'
    justifyItems='center'
  >
    {children}
  </Box>
)
export const JMTableRowFooter = ({ children }: { children: ReactNode }) => (
  <Box
    display='grid'
    gridTemplateColumns='9fr 3fr 2fr 2fr 2fr 2fr 2fr '
    p={2}
    borderRadius={1}
    color='#555'
    alignItems='center'
    justifyItems='center'
  >
    {children}
  </Box>
)

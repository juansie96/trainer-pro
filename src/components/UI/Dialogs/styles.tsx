import { Box, DialogActions, DialogTitle } from '@mui/material'
import { ReactNode } from 'react'

export const StyledDialogActions = ({
  children,
  justifyContent = 'end',
}: {
  children: ReactNode
  justifyContent?: string
}) => (
  <DialogActions
    sx={{ px: 3, py: 2, borderTop: '1px solid #e3e3e3', justifyContent: justifyContent }}
  >
    {children}
  </DialogActions>
)

export const StyledDialogHeader = ({ title }: { title: string }) => (
  <Box borderBottom='1px solid #e3e3e3'>
    <DialogTitle>{title}</DialogTitle>
  </Box>
)

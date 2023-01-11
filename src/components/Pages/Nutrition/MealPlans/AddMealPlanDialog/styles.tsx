import { Box, DialogActions, DialogActionsProps, DialogTitle } from '@mui/material'
import { ReactNode } from 'react'

export const StyledDialogActions = ({
  children,
  ...props
}: { children: ReactNode } & DialogActionsProps) => (
  <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e3e3e3', ...props.sx }}>
    {children}
  </DialogActions>
)

export const StyledDialogHeader = ({ title }: { title: string }) => (
  <Box borderBottom='1px solid #e3e3e3'>
    <DialogTitle>{title}</DialogTitle>
  </Box>
)

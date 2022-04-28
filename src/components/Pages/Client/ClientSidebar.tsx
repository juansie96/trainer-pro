import { Box } from '@mui/material'
import React from 'react'

const ClientSidebar = () => {
  return (
    <Box sx={sidebarStyles}>ClientSidebar</Box>
  )
}

const sidebarStyles = {
  flex: 1,
  width: 150,
  background: "#1976d2",
  boxShadow: "0px 3px 6px 4px rgb(0 0 0 / 20%)"
}

export default ClientSidebar
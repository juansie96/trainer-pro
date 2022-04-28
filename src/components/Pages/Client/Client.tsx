import { Box } from '@mui/material'
import React from 'react'
import { Outlet, useParams } from 'react-router-dom'
import ClientSidebar from './ClientSidebar';

const Client = () => {

  const params = useParams();

  console.log('params', params)

  return (
    <Box flex={1} display='flex' flexDirection="column">
      <ClientSidebar />
      <Outlet/>
    </Box>
  )
}

export default Client
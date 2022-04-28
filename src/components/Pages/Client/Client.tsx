import { Box } from '@mui/material'
import React from 'react'
import { Outlet, useParams } from 'react-router-dom'
import ClientSidebar from './ClientSidebar';

const Client = () => {

  const params = useParams();

  console.log('params', params)

  return (
    <Box flex={1} className='client-layout'>
      <ClientSidebar />
      <Box ml="150px" p={3}>
        <Outlet/>
      </Box>
    </Box>
  )
}

export default Client
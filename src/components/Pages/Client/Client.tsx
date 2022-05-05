import { Box } from '@mui/material'
import React from 'react'
import { Outlet, useParams } from 'react-router-dom'
import ClientSidebar from './ClientSidebar';

const Client = () => {

  const params = useParams();

  console.log('params', params)

  return (
    <Box flex={1} className='client-layout' display='flex' flexDirection="column">
      <ClientSidebar />
      <Box ml="110px" p={2} flex={1}>
        <Outlet/>
      </Box>
    </Box>
  )
}

export default Client
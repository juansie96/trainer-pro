import { Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import WorkoutSidebar from './WorkoutSidebar'

const Workouts = () => {
  return (
    <Box flex={1} className='client-layout' display='flex' flexDirection="column">
      <WorkoutSidebar />
      <Box ml="110px" p={2} flex={1}>
        <Outlet/>
      </Box>
    </Box>
  )
}

export default Workouts
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import WorkoutSidebar from './WorkoutSidebar'

const Workouts = () => {
  return (
    <Box flex={1} className='client-layout' display='grid' gridTemplateColumns={'110px 1fr'}>
      <WorkoutSidebar />
      <Box p={4} flex={1}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default Workouts

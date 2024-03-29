import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import NutritionSidebar from './NutritionSidebar'

const Nutrition = () => {
  return (
    <Box flex={1} className='client-layout' display='grid' gridTemplateColumns={'110px 1fr'}>
      <NutritionSidebar />
      <Box p={4} flex={1}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default Nutrition

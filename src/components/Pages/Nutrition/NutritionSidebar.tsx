import { Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar, { MenuItem } from '../../Sidebar'
import { RiRestaurantLine } from 'react-icons/ri'
import { GiChickenOven } from 'react-icons/gi'

const NutritionSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Sidebar>
      <MenuItem
        active={!location.pathname.includes('meals')}
        onClick={() => navigate('/dashboard/nutrition')}
      >
        <RiRestaurantLine size={30} />
        <Typography sx={{ mt: 1 }}>Planes</Typography>
      </MenuItem>
      <MenuItem
        active={location.pathname.includes('meals')}
        onClick={() => navigate('/dashboard/nutrition/meals')}
      >
        <GiChickenOven size={30} />
        <Typography>Comidas</Typography>
      </MenuItem>
    </Sidebar>
  )
}

export default NutritionSidebar

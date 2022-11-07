import { Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar, { MenuItem } from '../../Sidebar'
import { CgGym } from 'react-icons/cg'
import { GiWeightLiftingUp } from 'react-icons/gi'

const WorkoutSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Sidebar>
      <MenuItem
        active={!location.pathname.includes('exercises')}
        onClick={() => navigate('/dashboard/workouts')}
      >
        <CgGym size={30} />
        <Typography sx={{ mt: 0.5 }}>Rutinas</Typography>
      </MenuItem>
      <MenuItem
        active={location.pathname.includes('exercises')}
        onClick={() => navigate('/dashboard/workouts/exercises')}
      >
        <GiWeightLiftingUp size={30} />
        <Typography sx={{ mt: 1 }}>Ejercicios</Typography>
      </MenuItem>
    </Sidebar>
  )
}

export default WorkoutSidebar

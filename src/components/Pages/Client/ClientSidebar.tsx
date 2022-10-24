import { Typography } from '@mui/material'
import EventNoteIcon from '@mui/icons-material/EventNote'
import InfoIcon from '@mui/icons-material/Info'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Sidebar, { MenuItem } from '../../Sidebar'

const validSections = ['information', 'nutrition']

const ClientSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { clientId } = useParams()

  const section = location.pathname.split('/').pop()

  return (
    <Sidebar>
      <MenuItem
        active={!validSections.includes(section as string)}
        onClick={() => navigate(`/dashboard/client/${clientId}`)}
      >
        <EventNoteIcon sx={{ p: 1 }} />
        <Typography>Planificación</Typography>
      </MenuItem>
      <MenuItem
        active={location.pathname.includes('information')}
        onClick={() => navigate(`/dashboard/client/${clientId}/information`)}
      >
        <InfoIcon sx={{ p: 1 }} />
        <Typography>Información</Typography>
      </MenuItem>
      <MenuItem
        active={location.pathname.includes('nutrition')}
        onClick={() => navigate(`/dashboard/client/${clientId}/nutrition`)}
      >
        <RestaurantIcon sx={{ p: 1 }} />
        <Typography>Nutrición</Typography>
      </MenuItem>
    </Sidebar>
  )
}

export default ClientSidebar

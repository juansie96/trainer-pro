import { Box, styled, Typography } from '@mui/material'
import EventNoteIcon from '@mui/icons-material/EventNote'
import InfoIcon from '@mui/icons-material/Info'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Sidebar, { MenuItem } from '../../Sidebar'
import { useAppSelector } from '../../../state/storeHooks'
import { selectClient } from './Client.slice'
import PersonIcon from '@mui/icons-material/Person'

const validSections = ['information', 'nutrition']

const ClientInfo = styled(Box)(() => ({
  position: 'absolute',
  bottom: 15,
  left: 5,
  width: 90,
}))

const ClientSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { clientId } = useParams()
  const client = useAppSelector(selectClient)

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
      <ClientInfo>
        <PersonIcon />
        <Typography fontStyle='italic' fontSize={12}>
          {client?.name} {client?.lastname}
        </Typography>
      </ClientInfo>
    </Sidebar>
  )
}

export default ClientSidebar

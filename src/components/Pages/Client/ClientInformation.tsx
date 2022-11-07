import { Card, Typography } from '@mui/material'
import { Box } from '@mui/system'
import dayjs from 'dayjs'
import { useAppSelector } from '../../../state/storeHooks'
import { CLIENT_OBJECTIVES, TClientObjectives } from '../../../utils/utils'
import { selectClient } from './Client.slice'

const ClientInformation = () => {
  const client = useAppSelector(selectClient)
  if (!client?.email) return null

  const clientGeneralInfo = (
    <Card sx={{ p: 2 }} elevation={3}>
      <Typography variant='h6' fontWeight={500}>
        {client.name} {client.lastname}
      </Typography>
      <hr />
      <Box display='flex' mt={2}>
        <Typography fontWeight={600} variant='body1'>
          Email:
        </Typography>
        <Typography variant='body1' sx={{ ml: 1 }}>
          {client.email}
        </Typography>
      </Box>
      <Box display='flex' mt={1}>
        <Typography fontWeight={600} variant='body1'>
          Género:
        </Typography>
        <Typography variant='body1' sx={{ ml: 1 }}>
          {client.gender === 'male' ? 'Másculino' : 'Femenino'}
        </Typography>
      </Box>
      <Box display='flex' mt={1}>
        <Typography fontWeight={600} variant='body1'>
          Altura:
        </Typography>
        <Typography variant='body1' sx={{ ml: 1 }}>
          {client.height} cm
        </Typography>
      </Box>
      <Box display='flex' mt={1}>
        <Typography fontWeight={600} variant='body1'>
          Peso:
        </Typography>
        <Typography variant='body1' sx={{ ml: 1 }}>
          {client.weight} kg
        </Typography>
      </Box>
      <Box display='flex' mt={1}>
        <Typography fontWeight={600} variant='body1'>
          Fecha de Nacimiento:
        </Typography>
        <Typography variant='body1' sx={{ ml: 1 }}>
          {dayjs(client.birthDate).format('DD/MM/YYYY')}
        </Typography>
      </Box>
      <Box display='flex' mt={1}>
        <Typography fontWeight={600} variant='body1'>
          Objetivo:
        </Typography>
        <Typography variant='body1' sx={{ ml: 1 }}>
          {CLIENT_OBJECTIVES[client.objective as TClientObjectives].long}
        </Typography>
      </Box>
    </Card>
  )

  const healthFormData = (
    <Card sx={{ p: 2, mt: 2 }} elevation={3}>
      <Typography variant='h6' fontWeight={500}>
        Cuestionario de salud
      </Typography>
      <hr />
      {client.healthFormQuestions.map((item) => (
        <Box key={item.question} sx={{ mt: 1.5 }}>
          <Typography variant='body1'>{item.question}</Typography>
          <Typography
            variant='body1'
            sx={{ ml: 1 }}
            fontWeight={600}
            color={item.answer ? 'green' : 'error'}
          >
            {item.answer ? 'Si' : 'No'}
          </Typography>
        </Box>
      ))}
    </Card>
  )

  return (
    <>
      {clientGeneralInfo}
      {healthFormData}
    </>
  )
}

export default ClientInformation

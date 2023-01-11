import { useEffect, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useNavigate } from 'react-router-dom'
import { getClientsByTrainerIdRef } from '../../../firebase/fbRefs'
import { selectTrainer } from '../../../redux/slices/trainerSlice'
import { useAppSelector } from '../../../state/storeHooks'
import { Clients } from '../../../types/client'
import { EmptyCardMessage, HomeRow } from './styles'
import { ClientTask, HomeSectionProps } from './types'
import {
  getClientsWithNoCompletedTasks,
  getClientsWithoutTasks,
  getRecentlyCompletedTasks,
} from './utils'

import * as S from './styles'
import colors from '../../../theme/colors'
import { Divider, Stack, Typography } from '@mui/material'

import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { getFormattedDate } from '../../../utils/dates'

const Home = () => {
  const trainer = useAppSelector(selectTrainer)
  const [clients, loading] = useCollectionData(getClientsByTrainerIdRef(trainer.id as string))
  const [clientsWithoutTasks, setClientsWithoutTasks] = useState<Clients>([])
  const [clientsWithNoCompletedTasks, setClientsWithNoCompletedTasks] = useState<Clients>([]) // In the last 7 days
  const [recentlyCompletedTasks, setRecentlyCompletedTasks] = useState<ClientTask[]>()

  useEffect(() => {
    if (clients) {
      setClientsWithoutTasks(getClientsWithoutTasks(clients))
      setClientsWithNoCompletedTasks(getClientsWithNoCompletedTasks(clients))
      setRecentlyCompletedTasks(getRecentlyCompletedTasks(clients))
    }
  }, [clients])

  return (
    <>
      <HomeRow className='HomeRow'>
        <HomeSection
          clients={clientsWithoutTasks}
          loading={loading}
          title='Clientes sin próximas tareas'
          fallbackMsg='No se encontraron clientes sin próximas tareas'
        />
        <HomeSection
          tasks={recentlyCompletedTasks}
          loading={loading}
          title='Tareas completadas recientemente'
          fallbackMsg='No hubo tareas completadas en la última semana'
        />
      </HomeRow>
      <HomeRow className='HomeRow'>
        <HomeSection
          clients={clientsWithNoCompletedTasks}
          loading={loading}
          title='Clientes con tareas sin completar en los últimos 7 días'
          fallbackMsg='No se encontraron clientes con tareas sin completar en los últimos 7 días'
        />
        <h5>Useful actions</h5>
      </HomeRow>
    </>
  )
}

const HomeSection = ({ clients, tasks, loading, title, fallbackMsg }: HomeSectionProps) => {
  const hasData = (clients && clients.length > 0) || (tasks && tasks.length > 0)
  const navigate = useNavigate()

  return (
    <S.HomeCardSection title={title} spacing={1}>
      <Typography fontWeight={700} color={colors.textGray} letterSpacing={0.5}>
        {title}
      </Typography>
      <S.HomeCard elevation={4}>
        <Stack divider={<Divider orientation='horizontal' flexItem />} position='relative'>
          {loading ? (
            <S.Spinner />
          ) : hasData ? (
            clients ? (
              clients.map((c) => (
                <ClientRow
                  key={c.id as string}
                  fullname={c.name + ' ' + c.lastname}
                  onClick={() => navigate(`/dashboard/client/${c.id}`)}
                />
              ))
            ) : (
              (tasks as ClientTask[]).map((t) => (
                <ClientTaskRow
                  key={t.id}
                  data={t}
                  onClick={() => navigate(`/dashboard/client/${t.clientId}`)}
                />
              ))
            )
          ) : (
            <EmptyCardMessage>{fallbackMsg}</EmptyCardMessage>
          )}
        </Stack>
      </S.HomeCard>
    </S.HomeCardSection>
  )
}

export const ClientRow = ({ fullname, onClick }: { fullname: string; onClick(): void }) => (
  <S.ClientTaskRowContainer direction='row' spacing={1.5} onClick={onClick} className='ClientRow'>
    <img src='images/person-icon.png' height={38} width={38} />
    <S.ClientNameText variant='button'>{fullname}</S.ClientNameText>
  </S.ClientTaskRowContainer>
)

export const ClientTaskRow = ({ data, onClick }: { data: ClientTask; onClick(): void }) => {
  const getTaskIcon = (type: string): JSX.Element => {
    switch (type) {
      case 'workout':
        return <FitnessCenterIcon color='primary' fontSize='small' />
      case 'cardio':
        return <DirectionsRunIcon color='primary' fontSize='small' />
      default:
        return null
    }
  }

  return (
    <S.ClientTaskRowContainer direction='row' spacing={1.5} className='ClientRow' onClick={onClick}>
      <img src='images/person-icon.png' height={38} width={38} />
      <Stack spacing={0.5} flex={1}>
        <Stack direction='row' alignItems='center' justifyContent='space-between' width={1}>
          <S.ClientNameText variant='button'>{data.clientName}</S.ClientNameText>
          <Stack direction='row' color={colors.textGray} spacing={0.5} alignItems='center'>
            <AccessTimeIcon fontSize='small' />
            <Typography fontStyle='italic' fontWeight={700} fontSize={12}>
              {getFormattedDate(data.completed.date)}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction='row' alignItems='center' spacing={1} color={colors.textGray}>
          <Typography fontSize={14}>completó </Typography>{' '}
          <Stack direction='row' spacing={0.5}>
            {getTaskIcon(data.type)}
            <Typography fontStyle='italic' fontWeight={700} fontSize={13} color='primary'>
              {data.title}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </S.ClientTaskRowContainer>
  )
}

export default Home

import { useEffect, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useNavigate } from 'react-router-dom'
import { getClientsByTrainerIdRef } from '../../../firebase/fbRefs'
import { selectTrainer } from '../../../redux/slices/trainerSlice'
import { useAppSelector } from '../../../state/storeHooks'
import { Clients } from '../../../types/client'
import {
  ClientRow,
  ClientTaskRow,
  EmptyCardMessage,
  HomeCardSection,
  HomeContainer,
  HomeRow,
} from './styles'
import { ClientTask, HomeSectionProps } from './types'
import {
  getClientsWithNoCompletedTasks,
  getClientsWithoutTasks,
  getRecentlyCompletedTasks,
} from './utils'

const Home = () => {
  const trainer = useAppSelector(selectTrainer)
  const [clients, loading] = useCollectionData(getClientsByTrainerIdRef(trainer.id as string))
  const [clientsWithoutTasks, setClientsWithoutTasks] = useState<Clients>([])
  const [clientsWithNoCompletedTasks, setClientsWithNoCompletedTasks] = useState<Clients>([]) // In the last 7 days
  const [recentlyCompletedTasks, setRecentlyCompletedTasks] = useState<ClientTask[]>()

  console.log('recentlyCompletedTasks', recentlyCompletedTasks)

  useEffect(() => {
    if (clients) {
      setClientsWithoutTasks(getClientsWithoutTasks(clients))
      setClientsWithNoCompletedTasks(getClientsWithNoCompletedTasks(clients))
      setRecentlyCompletedTasks(getRecentlyCompletedTasks(clients))
    }
  }, [clients])

  return (
    <HomeContainer>
      <HomeRow>
        <HomeSection
          clients={clientsWithoutTasks}
          loading={loading}
          title='Clientes sin próximas tareas'
          fallbackMsg='No se encontraron clientes sin próximas tareas'
        />
        <HomeSection
          tasks={[
            {
              title: 'Full Body Workout Upper A',
              clientName: 'Juan Manuel Sierra',
              clientId: '',
              type: 'workout',
              id: '1',
              date: '',
              completed: { value: true, date: new Date() },
              entityId: '',
            },
            {
              title: 'Full Body Workout Upper A',
              clientName: 'Juan Manuel Sierra',
              clientId: '',
              type: 'workout',
              id: '2',
              date: '',
              completed: { value: true, date: new Date() },
              entityId: '',
            },
            {
              title: 'Full Body Workout Upper A',
              clientName: 'Juan Manuel Sierra',
              clientId: '',
              type: 'workout',
              id: '3',
              date: '',
              completed: { value: true, date: new Date() },
              entityId: '',
            },
          ]}
          loading={loading}
          title='Tareas completadas recientemente'
          fallbackMsg='No hubo tareas completadas en la última semana'
        />
      </HomeRow>
      <HomeRow>
        <HomeSection
          clients={clientsWithNoCompletedTasks}
          loading={loading}
          title='Clientes con tareas sin completar en los últimos 7 días'
          fallbackMsg='No se encontraron clientes con tareas sin completar en los últimos 7 días'
        />
        <h1>Useful actions</h1>
      </HomeRow>
    </HomeContainer>
  )
}

const HomeSection = ({ clients, tasks, loading, title, fallbackMsg }: HomeSectionProps) => {
  const hasData = (clients && clients.length > 0) || (tasks && tasks.length > 0)
  const navigate = useNavigate()

  return (
    <HomeCardSection title={title} showSpinner={loading}>
      {hasData ? (
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
        <EmptyCardMessage msg={fallbackMsg} />
      )}
    </HomeCardSection>
  )
}

export default Home

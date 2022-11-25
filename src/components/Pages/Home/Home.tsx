import { useEffect, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useNavigate } from 'react-router-dom'
import { getClientsByTrainerIdRef } from '../../../firebase/fbRefs'
import { selectTrainer } from '../../../redux/slices/trainerSlice'
import { useAppSelector } from '../../../state/storeHooks'
import { Clients } from '../../../types/client'
import { ClientRow, EmptyCardMessage, HomeCardSection, HomeContainer, HomeRow } from './styles'
import { HomeSectionProps } from './types'
import { getClientsWithoutTasks } from './utils'

const Home = () => {
  const trainer = useAppSelector(selectTrainer)
  const [clients, loading] = useCollectionData(getClientsByTrainerIdRef(trainer.id as string))
  const [clientsWithoutTasks, setClientsWithoutTasks] = useState<Clients>([])

  useEffect(() => {
    if (clients) {
      setClientsWithoutTasks(getClientsWithoutTasks(clients))
    }
  }, [clients])

  return (
    <HomeContainer>
      <HomeRow>
        <HomeSection
          clients={clientsWithoutTasks}
          loading={loading}
          title='Clientes sin actividad'
          fallbackMsg='No se encontraron clientes sin próximas tareas'
        />
        <HomeCardSection title='Tareas completadas recientemente' showSpinner={loading}>
          <EmptyCardMessage msg='No hubo tareas completadas en la última semana' />
        </HomeCardSection>
      </HomeRow>
      <HomeRow>
        <HomeSection
          clients={clientsWithoutTasks}
          loading={loading}
          title='Clientes con tareas sin completar'
          fallbackMsg='No se encontraron clientes con tareas sin completar'
        />
        <h1>Useful actions</h1>
      </HomeRow>
    </HomeContainer>
  )
}

const HomeSection = ({ clients, loading, title, fallbackMsg }: HomeSectionProps) => {
  const hasClients = clients.length > 0
  const navigate = useNavigate()

  return (
    <HomeCardSection title={title} showSpinner={loading}>
      {hasClients ? (
        clients.map((c) => (
          <ClientRow
            key={c.id as string}
            fullname={c.name + ' ' + c.lastname}
            onClick={() => navigate(`/dashboard/client/${c.id}`)}
          />
        ))
      ) : (
        <EmptyCardMessage msg={fallbackMsg} />
      )}
    </HomeCardSection>
  )
}

export default Home

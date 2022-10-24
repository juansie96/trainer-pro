import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { getClientDataDocById } from '../../../firebase/fbRefs'
import { clientDataRetrieved } from './Client.slice'
import ClientSidebar from './ClientSidebar'

const Client = () => {
  const location = useLocation()
  const { clientId } = useParams()
  const state = location.state as any
  const dispatch = useDispatch()

  useEffect(() => {
    if (state) {
      dispatch(clientDataRetrieved(state.client))
    } else {
      getClientDataDocById(clientId as string).then((docSnap) => {
        if (docSnap.exists()) {
          const clientData = docSnap.data()
          dispatch(
            clientDataRetrieved({
              ...clientData,
              birthDate: (clientData.birthDate as Date).toISOString(),
            }),
          )
        } else {
          console.log('No such document!')
        }
      })
    }
  }, [])

  return (
    <Box flex={1} className='client-layout' display='grid' gridTemplateColumns={'110px 1fr'}>
      <ClientSidebar />
      <Box ml='110px' p={2} flex={1} height={1} overflow='scroll'>
        <Outlet />
      </Box>
    </Box>
  )
}

export default Client

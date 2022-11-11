import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
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
  useDocumentData()

  useEffect(() => {
    if (state) {
      dispatch(clientDataRetrieved(state.client))
    } else {
      getClientDataDocById(clientId as string).then((docSnap) => {
        if (docSnap.exists()) {
          dispatch(clientDataRetrieved(docSnap.data()))
        } else {
          throw new Error()
        }
      })
    }
  }, [])

  return (
    <Box flex={1} className='client-layout' display='grid' gridTemplateColumns={'110px 1fr'}>
      <ClientSidebar />
      <Box p={4} flex={1}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default Client

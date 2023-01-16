import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useDispatch } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'
import { getClientDataDocById } from '../../../firebase/fbRefs'
import { clientDataRetrieved } from './Client.slice'
import ClientSidebar from './ClientSidebar'

const Client = () => {
  const { clientId } = useParams()
  const dispatch = useDispatch()
  useDocumentData()

  useEffect(() => {
    getClientDataDocById(clientId as string).then((docSnap) => {
      if (docSnap.exists()) {
        dispatch(clientDataRetrieved(docSnap.data()))
      } else {
        throw new Error()
      }
    })
  }, [])

  return (
    <Box flex={1} className='client-layout' display='grid' gridTemplateColumns={'110px 1fr'}>
      <ClientSidebar />
      <Box p={4} flex={1} maxWidth='85em'>
        <Outlet />
      </Box>
    </Box>
  )
}

export default Client

import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useDispatch } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'
import { getClientDataDocById } from '../../../firebase/fbRefs'
import { clientDataRetrieved } from '../../../redux/slices/Client.slice'
import ClientSidebar from './ClientSidebar'

const Client = () => {
  const { clientId } = useParams()
  const dispatch = useDispatch()
  useDocumentData()

  useEffect(() => {
    getClientDataDocById(clientId as string).then((docSnap) => {
      if (docSnap.exists()) {
        const clientData = (({ ref: _, ...objWithoutRef }) => objWithoutRef)(docSnap.data())
        dispatch(clientDataRetrieved(clientData))
      } else {
        throw new Error()
      }
    })
  }, [])

  return (
    <Box flex={1} className='client-layout' display='grid' gridTemplateColumns={'110px 1fr'}>
      <ClientSidebar />
      <Box p={4} flex={1} maxWidth='95em' position='relative'>
        <Outlet />
      </Box>
    </Box>
  )
}

export default Client

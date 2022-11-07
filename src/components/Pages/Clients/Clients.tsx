import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { AddClientDialog } from './AddClientDialog'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { DocumentData, DocumentReference, Timestamp } from 'firebase/firestore'
import { CenteredLayout } from '../../UI/CenteredLayout'
import { ClientsLayout } from './ClientsLayout'
import { HealthFormQuestion } from '../ClientActivation/types'
import { selectTrainer } from '../../../redux/slices/trainerSlice'
import { useSelector } from 'react-redux'
import { getClientsByTrainerIdRef } from '../../../firebase/fbRefs'
import { Task } from '../../../types/client'

const Clients = () => {
  let content
  const trainer = useSelector(selectTrainer)
  const [clients, loading] = useCollectionData(getClientsByTrainerIdRef(trainer.id as string))

  const [addClientDialogOpen, setAddClientDialogOpen] = useState<boolean>(false)

  const openAddClientDialog = () => {
    setAddClientDialogOpen(true)
  }

  const closeAddClientDialog = () => {
    setAddClientDialogOpen(false)
  }

  if (loading) {
    content = <p>Cargando..</p>
  } else if (clients && clients.length > 0) {
    content = <ClientsLayout openAddClientDialog={openAddClientDialog} />
  } else {
    content = (
      <CenteredLayout>
        <Typography variant='h5'>Todavía no tienes ningún cliente</Typography>
        <Typography
          fontSize={20}
          variant='subtitle1'
          color='primary'
          sx={{ cursor: 'pointer' }}
          onClick={openAddClientDialog}
        >
          Crea uno nuevo
        </Typography>
      </CenteredLayout>
    )
  }

  return (
    <Box height={1}>
      {content}
      {addClientDialogOpen && (
        <AddClientDialog open={addClientDialogOpen} onClose={closeAddClientDialog} />
      )}
    </Box>
  )
}

export default Clients

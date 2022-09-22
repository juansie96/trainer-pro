import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { CenteredLayout } from '../../../UI/CenteredLayout'
import { DocumentData, DocumentReference } from 'firebase/firestore'
import AddWorkoutDialog from './AddWorkoutDialog'
import { workoutsRef } from '../../../../firebase/fbRefs'
import { RoutinesLayout } from './RoutinesLayout'

const Routines = () => {
  let content
  const [workouts, loading, error] = useCollectionData(workoutsRef)

  const [addWorkoutDialogOpen, setAddWorkoutDialogOpen] = useState<boolean>(false)

  const openAddWorkoutDialog = () => {
    setAddWorkoutDialogOpen(true)
  }

  const closeAddWorkoutDialog = () => {
    setAddWorkoutDialogOpen(false)
  }

  if (loading) {
    content = <p>Cargando..</p>
  } else if (workouts && workouts.length > 0) {
    content = <RoutinesLayout openAddWorkoutDialog={openAddWorkoutDialog} />
  } else {
    content = (
      <CenteredLayout>
        <Typography variant='h5'>Todavía no tienes ninguna rutina</Typography>
        <Typography
          fontSize={20}
          variant='subtitle1'
          color='primary'
          sx={{ cursor: 'pointer' }}
          onClick={openAddWorkoutDialog}
        >
          Crea una nueva
        </Typography>
      </CenteredLayout>
    )
  }

  return (
    <Box height={1}>
      {content}
      <AddWorkoutDialog open={addWorkoutDialogOpen} onClose={closeAddWorkoutDialog} />
    </Box>
  )
}

export default Routines

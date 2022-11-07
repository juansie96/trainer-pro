import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { CenteredLayout } from '../../../UI/CenteredLayout'
import { DocumentData, DocumentReference } from 'firebase/firestore'
// import { ExercisesLayout } from './ExercisesLayout'
import AddMealDialog from './AddMealDialog'
import { exercisesRef, workoutsRef } from '../../../../firebase/fbRefs'

const Meals = () => {
  let content
  const [exercises, loading, error] = useCollectionData(exercisesRef)

  const [addExerciseDialogOpen, setAddMealDialogOpen] = useState<boolean>(false)

  const openAddMealDialog = () => {
    setAddMealDialogOpen(true)
  }

  const closeAddMealDialog = () => {
    setAddMealDialogOpen(false)
  }

  if (loading) {
    content = <p>Cargando..</p>
  } else if (exercises && exercises.length > 0) {
    // content = <ExercisesLayout openAddMealDialog={openAddMealDialog} />
    content = null
  } else {
    content = (
      <CenteredLayout>
        <Typography variant='h5'>Todavía no creaste ninguna comida</Typography>
        <Typography
          fontSize={20}
          variant='subtitle1'
          color='primary'
          sx={{ cursor: 'pointer' }}
          onClick={openAddMealDialog}
        >
          Crea uno nuevo
        </Typography>
      </CenteredLayout>
    )
  }

  return (
    <Box height={1}>
      {content}
      {addExerciseDialogOpen && (
        <AddMealDialog open={addExerciseDialogOpen} onClose={closeAddMealDialog} />
      )}
    </Box>
  )
}

export default Meals

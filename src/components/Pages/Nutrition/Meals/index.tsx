import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { CenteredLayout } from '../../../UI/CenteredLayout'
import AddMealDialog from './AddMealDialog'
import { mealsRef } from '../../../../firebase/fbRefs'
import MealsLayout from './MealsLayout'

const Meals = () => {
  let content
  const [meals, loading] = useCollectionData(mealsRef)

  const [addExerciseDialogOpen, setAddMealDialogOpen] = useState<boolean>(false)

  const openAddMealDialog = () => {
    setAddMealDialogOpen(true)
  }

  const closeAddMealDialog = () => {
    setAddMealDialogOpen(false)
  }

  if (loading) {
    content = <p>Cargando..</p>
  } else if (meals && meals.length > 0) {
    content = <MealsLayout openAddMealDialog={openAddMealDialog} />
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
          Crea una nueva
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

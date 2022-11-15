import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { CenteredLayout } from '../../../UI/CenteredLayout'
import AddMealPlanDialog from './AddMealPlanDialog'
import { mealPlansRef } from '../../../../firebase/fbRefs'
import MealPlansLayout from './MealPlansLayout'

const MealPlans = () => {
  const [mealPlans, loading] = useCollectionData(mealPlansRef)
  const [addMealPlanDialogOpen, setAddMealPlanDialogOpen] = useState<boolean>(false)

  const openAddMealPlanDialog = () => {
    setAddMealPlanDialogOpen(true)
  }
  const closeAddMealPlanDialog = () => {
    setAddMealPlanDialogOpen(false)
  }

  let content

  if (loading) {
    content = <p>Cargando..</p>
  } else if (mealPlans && mealPlans.length > 0) {
    content = <MealPlansLayout openAddMealPlanDialog={openAddMealPlanDialog} />
  } else {
    content = (
      <CenteredLayout>
        <Typography variant='h5'>Todavía no tienes ningún plan nutricional</Typography>
        <Typography
          fontSize={20}
          variant='subtitle1'
          color='primary'
          sx={{ cursor: 'pointer' }}
          onClick={openAddMealPlanDialog}
        >
          Crea uno nuevo
        </Typography>
      </CenteredLayout>
    )
  }

  return (
    <Box height={1}>
      {content}
      {addMealPlanDialogOpen && (
        <AddMealPlanDialog open={addMealPlanDialogOpen} onClose={closeAddMealPlanDialog} />
      )}
    </Box>
  )
}

export default MealPlans

import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useAppSelector } from '../../../../state/storeHooks'
import { CenteredLayout } from '../../../UI/CenteredLayout'
import { selectClient } from '../Client.slice'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import AddMealPlanDialog from '../../Nutrition/MealPlans/AddMealPlanDialog'
import MealPlansTable from '../../Nutrition/MealPlans/MealPlansTable'

const ClientNutrition = () => {
  const client = useAppSelector(selectClient)
  // const [clients, loading] = useCollectionData(getClientsByTrainerIdRef(trainer.id as string))

  const [status, setStatus] = useState<'initial' | 'assigning'>('initial')

  // const clientNutritionalPlans = [1, 2]
  const clientNutritionalPlans = null

  let content
  const loading = false

  const [addNewPlanDialogOpen, setAddNewplanDialogOpen] = useState<boolean>(false)

  const openAddNewPlanDialog = () => {
    setAddNewplanDialogOpen(true)
  }

  const closeAddNewPlanDialog = () => {
    setAddNewplanDialogOpen(false)
  }

  const initialContent = loading ? (
    <p>Cargando..</p>
  ) : clientNutritionalPlans && clientNutritionalPlans.length > 0 ? (
    <MealPlansTable mealPlans={[]} />
  ) : (
    <CenteredLayout>
      <Typography variant='h5'>
        {client?.name} {client?.lastname} todavía no tiene ningún plan asignado
      </Typography>
      <Typography
        fontSize={20}
        variant='subtitle1'
        color='primary'
        sx={{ cursor: 'pointer' }}
        onClick={() => setStatus('assigning')}
      >
        Asignar nuevo plan
      </Typography>
    </CenteredLayout>
  )

  return (
    <Box height={1}>
      {status === 'initial' && initialContent}
      {status === 'assigning' && (
        <AssignMealPlanContent
          onBackClick={() => setStatus('initial')}
          onAddNewPlan={openAddNewPlanDialog}
        />
      )}
      {addNewPlanDialogOpen && (
        <AddMealPlanDialog
          open={addNewPlanDialogOpen}
          onClose={closeAddNewPlanDialog}
          clientId={client.id}
        />
      )}
    </Box>
  )
}

const AssignMealPlanContent = ({
  onBackClick,
  onAddNewPlan,
}: {
  onBackClick(): void
  onAddNewPlan(): void
}) => (
  <div>
    <Button onClick={onBackClick}>
      <ChevronLeftIcon />
      Back
    </Button>
    <Button variant='contained' color='primary' sx={{ ml: 2 }} onClick={onAddNewPlan}>
      Añadir plan desde cero
    </Button>
  </div>
)

export default ClientNutrition

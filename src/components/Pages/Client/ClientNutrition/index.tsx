import { Button, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useAppSelector } from '../../../../state/storeHooks'
import { CenteredLayout } from '../../../UI/CenteredLayout'
import { selectClient } from '../Client.slice'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import AddMealPlanDialog from '../../Nutrition/MealPlans/AddMealPlanDialog'
import MealPlansLayout from '../../Nutrition/MealPlans/MealPlansLayout'
import MealPlansTable from '../../Nutrition/MealPlans/MealPlansTable'
import { getMealPlansByClientIdRef } from '../../../../firebase/fbRefs'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const ClientNutrition = () => {
  const client = useAppSelector(selectClient)
  const [mealPlans, loading] = useCollectionData(getMealPlansByClientIdRef(client.id))

  console.log('mealPlans', mealPlans)

  const [status, setStatus] = useState<'initial' | 'assigning'>('initial')

  const [addNewPlanDialogOpen, setAddNewplanDialogOpen] = useState<boolean>(false)

  const openAddNewPlanDialog = () => {
    setAddNewplanDialogOpen(true)
  }

  const closeAddNewPlanDialog = () => {
    setAddNewplanDialogOpen(false)
    setStatus('initial')
  }

  const initialContent = loading ? (
    <p>Cargando..</p>
  ) : mealPlans && mealPlans.length > 0 ? (
    <>
      <Stack direction='row' justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant='h1'>Planes asignados</Typography>
        <Button onClick={() => setStatus('assigning')} variant='contained' sx={{ mt: 2 }}>
          Asignar nuevo plan
        </Button>
      </Stack>
      <MealPlansTable mealPlans={mealPlans} />
    </>
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
    <Stack direction='row' alignItems={'center'} justifyContent='space-between'>
      <Button onClick={onBackClick}>
        <ChevronLeftIcon />
        Atrás
      </Button>
      <Button variant='contained' color='primary' sx={{ ml: 2 }} onClick={onAddNewPlan}>
        Añadir plan desde cero
      </Button>
    </Stack>
    <MealPlansLayout isClientAssignation={true} />
  </div>
)

export default ClientNutrition

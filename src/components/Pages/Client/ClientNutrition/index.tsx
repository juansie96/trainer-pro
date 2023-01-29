import { Button, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useAppSelector } from '../../../../state/storeHooks'
import { CenteredLayout } from '../../../UI/CenteredLayout'
import { selectClient } from '../../../../redux/slices/Client.slice'
import AddMealPlanDialog from '../../Nutrition/MealPlans/AddMealPlanDialog'
import MealPlansLayout from '../../Nutrition/MealPlans/MealPlansLayout'
import MealPlansTable from '../../Nutrition/MealPlans/MealPlansTable'
import { getMealPlansByClientIdRef } from '../../../../firebase/fbRefs'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const ClientNutrition = () => {
  const client = useAppSelector(selectClient)
  const [mealPlans, loading] = useCollectionData(getMealPlansByClientIdRef(client.id))
  const [status, setStatus] = useState<'initial' | 'assigning'>('initial')
  const [addNewPlanDialogOpen, setAddNewplanDialogOpen] = useState<boolean>(false)

  const closeAddNewPlanDialog = () => {
    setAddNewplanDialogOpen(false)
    setStatus('initial')
  }

  const initialContent = loading ? (
    <p>Cargando..</p>
  ) : mealPlans && mealPlans.length > 0 ? (
    <>
      <Stack direction='row' justifyContent={'space-between'} alignItems={'center'} mb={2}>
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
        <MealPlansLayout isClientAssignation={true} onAssignMealPlan={() => setStatus('initial')} />
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

export default ClientNutrition

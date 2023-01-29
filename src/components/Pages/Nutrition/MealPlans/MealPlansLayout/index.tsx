import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getMealPlansByTrainerIdRef } from '../../../../../firebase/fbRefs'
import MealPlansTable from '../MealPlansTable'
import { useAppSelector } from '../../../../../state/storeHooks'
import { selectTrainer } from '../../../../../redux/slices/trainerSlice'
import AddMealPlanDialog from '../AddMealPlanDialog'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

const MealPlansLayout = ({
  isClientAssignation,
  onAssignMealPlan,
}: {
  isClientAssignation?: boolean
  onAssignMealPlan?(): void
}) => {
  const trainer = useAppSelector(selectTrainer)
  const [mealPlans, isLoading] = useCollectionData(getMealPlansByTrainerIdRef(trainer.id as string))
  const [query, setQuery] = useState('')
  const [addMealPlanDialogOpen, setAddMealPlanDialogOpen] = useState<boolean>(false)

  let filteredMealPlans = mealPlans
    ?.slice(0)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0))

  if (query && mealPlans) {
    filteredMealPlans = mealPlans.filter((meal) =>
      meal.name.toUpperCase().includes(query.toUpperCase()),
    )
  }
  return (
    <Stack className='workouts-layout' maxWidth='95em' spacing={4}>
      <Typography variant='h1'>Planes nutricionales</Typography>
      <Stack direction='row' spacing={2}>
        <div>
          {isClientAssignation && (
            <Button onClick={onAssignMealPlan} sx={{ mr: 2 }}>
              <ChevronLeftIcon />
              Atrás
            </Button>
          )}
          <SearchMealInput
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          />
        </div>
        <Button
          variant='contained'
          disabled={isLoading}
          onClick={() => setAddMealPlanDialogOpen(true)}
        >
          Agregar plan
        </Button>
      </Stack>
      {isLoading ? (
        <Box>
          <Skeleton
            variant='rounded'
            sx={{ width: '100%', maxWidth: 'calc(100vw - 6.875em - 4em)' }}
            height={60}
          />
          <Skeleton
            variant='rectangular'
            sx={{ width: '100%', maxWidth: 'calc(100vw - 6.875em - 4em)', mt: 0.5 }}
            height={200}
          />
        </Box>
      ) : (
        <MealPlansTable
          mealPlans={filteredMealPlans}
          isClientAssignation={isClientAssignation}
          onAssignMealPlan={onAssignMealPlan}
        />
      )}
      {addMealPlanDialogOpen && (
        <AddMealPlanDialog
          open={addMealPlanDialogOpen}
          onClose={() => setAddMealPlanDialogOpen(false)}
        />
      )}
    </Stack>
  )
}

const SearchMealInput = ({
  value,
  onChange,
}: {
  value: string
  onChange(e: React.ChangeEvent<HTMLInputElement>): void
}): JSX.Element => (
  <TextField
    sx={{ width: 500 }}
    type='text'
    size='small'
    label='Buscar un plan nutricional'
    value={value}
    onChange={onChange}
    InputProps={{
      endAdornment: (
        <InputAdornment position='end'>
          <IconButton aria-label='toggle password visibility'>
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
)

export default MealPlansLayout

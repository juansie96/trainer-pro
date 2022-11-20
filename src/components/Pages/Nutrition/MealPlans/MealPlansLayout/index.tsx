import { Button, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getMealPlansByTrainerIdRef } from '../../../../../firebase/fbRefs'
import { CenteredLayout } from '../../../../UI/CenteredLayout'
import MealPlansTable from '../MealPlansTable'
import { useAppSelector } from '../../../../../state/storeHooks'
import { selectTrainer } from '../../../../../redux/slices/trainerSlice'

const MealPlansLayout = ({ openAddMealPlanDialog }: { openAddMealPlanDialog(): void }) => {
  const trainer = useAppSelector(selectTrainer)
  const [mealPlans, loading] = useCollectionData(getMealPlansByTrainerIdRef(trainer.id as string))
  const [query, setQuery] = useState('')

  let filteredMealPlans = mealPlans?.slice(0)

  if (query && mealPlans) {
    filteredMealPlans = mealPlans.filter((meal) =>
      meal.name.toUpperCase().includes(query.toUpperCase()),
    )
  }
  return (
    <Stack mt={5} spacing={1.5}>
      <Stack direction='row' spacing={2}>
        <SearchClientInput
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        />
        <Button variant='contained' disabled={loading} onClick={openAddMealPlanDialog}>
          Agregar plan
        </Button>
      </Stack>

      {filteredMealPlans && filteredMealPlans.length > 0 ? (
        <MealPlansTable mealPlans={filteredMealPlans} />
      ) : (
        <CenteredLayout>
          <Typography variant='h5' my={3}>
            No se encontró ningun plan nutricional
          </Typography>
        </CenteredLayout>
      )}
    </Stack>
  )
}

const SearchClientInput = ({
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
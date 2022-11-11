import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getMealsByTrainerIdRef } from '../../../../../firebase/fbRefs'
import { CenteredLayout } from '../../../../UI/CenteredLayout'
import MealsGrid from '../MealsGrid'
import { useAppSelector } from '../../../../../state/storeHooks'
import { selectTrainer } from '../../../../../redux/slices/trainerSlice'
import { CreatedByTypes } from './types'

const MealsLayout = ({ openAddMealDialog }: { openAddMealDialog(): void }) => {
  const trainer = useAppSelector(selectTrainer)
  const [meals, loading] = useCollectionData(getMealsByTrainerIdRef(trainer.id as string))
  const [query, setQuery] = useState('')
  const [createdBy, setCreatedBy] = useState<CreatedByTypes>('all')

  let filteredMeals = meals?.slice(0)

  if (query && meals) {
    filteredMeals = meals.filter((meal) => meal.name.toUpperCase().includes(query.toUpperCase()))
  }

  if (createdBy === 'custom') {
    filteredMeals = filteredMeals?.filter((m) => m.creatorId === trainer.id)
  } else if (createdBy === 'default') {
    filteredMeals = filteredMeals?.filter((m) => m.creatorId === '')
  }

  return (
    <Stack mt={5} spacing={1.5}>
      <Stack direction='row' spacing={2}>
        <SearchClientInput
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        />
        <Button variant='contained' disabled={loading} onClick={openAddMealDialog}>
          Agregar alimento
        </Button>
      </Stack>

      <Stack direction='row' alignItems='center' mt={3} spacing={3}>
        <FormLabel>Alimentos creados por:</FormLabel>
        <RadioGroup
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value as CreatedByTypes)}
          name='radio-buttons-group'
        >
          <Stack direction='row'>
            <FormControlLabel value='all' control={<Radio />} label='Todos' />
            <FormControlLabel value='default' control={<Radio />} label='Trainer Pro' />
            <FormControlLabel value='custom' control={<Radio />} label='Propios' />
          </Stack>
        </RadioGroup>
      </Stack>

      {filteredMeals && filteredMeals.length > 0 ? (
        <MealsGrid meals={filteredMeals} />
      ) : (
        <CenteredLayout>
          <Typography variant='h5' my={3}>
            No se encontró ningun alimento
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
    label='Buscar un alimento'
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

export default MealsLayout

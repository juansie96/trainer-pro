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
import { getExercisesByTrainerIdRef } from '../../../../firebase/fbRefs'
import { CenteredLayout } from '../../../UI/CenteredLayout'
import ExercisesGrid from './ExercisesGrid'
import { useAppSelector } from '../../../../state/storeHooks'
import { selectTrainer } from '../../../../redux/slices/Trainer.slice'
import { CreatedByTypes } from '../../Nutrition/Foods/FoodsLayout/types'

export const ExercisesLayout = ({ openAddExerciseDialog }: { openAddExerciseDialog(): void }) => {
  const trainer = useAppSelector(selectTrainer)
  const [exercises, loading] = useCollectionData(getExercisesByTrainerIdRef(trainer.id))
  const [createdBy, setCreatedBy] = useState<CreatedByTypes>('all')
  console.log('createdBy', createdBy)

  const [query, setQuery] = useState('')

  let filteredExercises = exercises?.slice(0).sort((a, b) => a.name.localeCompare(b.name))

  if (query && exercises) {
    filteredExercises = exercises.filter((workout) =>
      workout.name.toUpperCase().includes(query.toUpperCase()),
    )
  }

  if (createdBy === 'custom') {
    console.log(filteredExercises)
    filteredExercises = filteredExercises?.filter((e) => e.creatorId === trainer.id)
    console.log(filteredExercises)
  } else if (createdBy === 'default') {
    filteredExercises = filteredExercises?.filter((e) => e.creatorId === '')
  }

  return (
    <Box className='exercises-layout'>
      <Stack spacing={3}>
        <Typography variant='h1'>Ejercicios</Typography>
        <Box>
          <SearchClientInput
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          />
          <Button variant='contained' disabled={loading} onClick={openAddExerciseDialog}>
            Agregar ejercicio
          </Button>
        </Box>
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

        {filteredExercises && filteredExercises.length > 0 ? (
          <ExercisesGrid exercises={filteredExercises} />
        ) : (
          <Typography variant='h5' my={3}>
            No se encontró ningun ejercicio
          </Typography>
        )}
      </Stack>
    </Box>
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
    sx={{ width: 600, mr: 2 }}
    type='text'
    size='small'
    label='Buscar un ejercicio'
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

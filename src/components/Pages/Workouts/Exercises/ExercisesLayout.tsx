import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { exercisesRef } from '../../../../firebase/fbRefs'
import { CenteredLayout } from '../../../UI/CenteredLayout'
import ExercisesGrid from './ExercisesGrid'

export const ExercisesLayout = ({ openAddExerciseDialog }: { openAddExerciseDialog(): void }) => {
  const [exercises, loading] = useCollectionData(exercisesRef)

  const [query, setQuery] = useState('')

  let filteredExercises = exercises?.slice(0).sort((a, b) => a.name.localeCompare(b.name))

  if (query && exercises) {
    filteredExercises = exercises.filter((workout) =>
      workout.name.toUpperCase().includes(query.toUpperCase()),
    )
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

        {filteredExercises && filteredExercises.length > 0 ? (
          <ExercisesGrid exercises={filteredExercises} />
        ) : (
          <CenteredLayout>
            <Typography variant='h5' my={3}>
              No se encontró ningun ejercicio
            </Typography>
          </CenteredLayout>
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

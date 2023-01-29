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
import { getWorkoutsByTrainerIdRef } from '../../../../firebase/fbRefs'
import RoutinesTable from './RoutinesTable'
import { Workout } from '../../../../types/workout'
import { selectTrainer } from '../../../../redux/slices/trainerSlice'
import { useAppSelector } from '../../../../state/storeHooks'
import AddWorkoutDialog from './AddWorkoutDialog'

export const RoutinesLayout = () => {
  const trainer = useAppSelector(selectTrainer)
  const [workouts, isLoading] = useCollectionData(getWorkoutsByTrainerIdRef(trainer.id as string))
  const [query, setQuery] = useState('')
  const [addWorkoutDialogOpen, setAddWorkoutDialogOpen] = useState<boolean>(false)

  let filteredWorkouts = workouts
    ?.slice(0)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0))

  if (query && workouts) {
    filteredWorkouts = workouts.filter((workout) =>
      workout.name.toUpperCase().includes(query.toUpperCase()),
    )
  }

  return (
    <Stack className='workouts-layout' maxWidth='95em' spacing={2.5}>
      <Typography variant='h1'>Rutinas</Typography>
      <Box display='flex'>
        <SearchClientInput
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        />
        <Button
          variant='contained'
          disabled={isLoading}
          onClick={() => setAddWorkoutDialogOpen(true)}
        >
          Agregar rutina
        </Button>
      </Box>

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
        <RoutinesTable workouts={filteredWorkouts as Workout[]} />
      )}

      {addWorkoutDialogOpen && (
        <AddWorkoutDialog
          open={addWorkoutDialogOpen}
          onClose={() => setAddWorkoutDialogOpen(false)}
        />
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
    sx={{ width: 600, mr: 2 }}
    type='text'
    size='small'
    label='Buscar una rutina'
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

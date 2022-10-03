import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { exercisesRef, workoutsRef } from '../../../../../firebase/fbRefs'
import { getExerciseImgUrl } from '../../../../../utils/utils'
import EditWorkoutDialog from '../EditWorkoutDialog'
import { restDropdownItems } from '../WorkoutExercisesTable/data'
import { IProps } from './types'

const PreviewWorkoutDialog = ({ onClose, workout }: IProps) => {
  const [exercises] = useCollectionData(exercisesRef)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const openEditDialog = () => setEditDialogOpen(true)
  const closeEditDialog = () => setEditDialogOpen(false)

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth='md'>
      <Box
        borderBottom='1px solid #e3e3e3'
        display={'flex'}
        justifyContent='space-between'
        alignItems={'center'}
        pr={3}
      >
        <DialogTitle>{workout.name}</DialogTitle>
        <Button variant='contained' sx={{ height: 38 }} onClick={openEditDialog}>
          Editar
        </Button>
      </Box>
      <DialogContent sx={{ pt: 3, pb: 4 }}>
        <DialogContentText>{workout.description} asdasdaasd</DialogContentText>
        <Box margin='auto' mt={2} width='fit-content'>
          {workout.workoutExercises.map((exercise) => {
            const exerciseData = exercises?.find((e) => e.id === exercise.exerciseId)
            if (!exerciseData) return null
            return (
              <Box
                key={exercise.id}
                display='flex'
                p={2}
                borderBottom='1px solid #ccc'
                alignItems='center'
              >
                <img
                  src={getExerciseImgUrl(exerciseData)}
                  alt={exerciseData?.name}
                  width={170}
                  height='100%'
                  style={{ borderRadius: '10px 10px 0 0' }}
                />
                <Box ml={3}>
                  <Typography variant='h5' fontSize='1.2em'>
                    Deadlift
                  </Typography>
                  {exercise.sets && (
                    <Typography variant='body1' fontSize='0.9rem' color='#5a5a5a'>
                      {exercise.sets} {exercise.sets > 1 ? 'Series' : 'Serie'}
                    </Typography>
                  )}
                  <Typography variant='body1' fontSize='0.9rem' color='#5a5a5a'>
                    Descanso:{' '}
                    {restDropdownItems.find((time) => time.value === exercise.rest)?.label}
                  </Typography>
                </Box>
                {exercise.objective && (
                  <Box ml={3}>
                    <Typography variant='body1' fontSize='0.9rem' color='#5a5a5a'>
                      {exercise.objective}
                    </Typography>
                  </Box>
                )}
              </Box>
            )
          })}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e3e3e3' }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type='submit' variant='contained'>
          Aceptar
        </Button>
      </DialogActions>
      {editDialogOpen && <EditWorkoutDialog onClose={closeEditDialog} workout={workout} />}
    </Dialog>
  )
}

export default PreviewWorkoutDialog

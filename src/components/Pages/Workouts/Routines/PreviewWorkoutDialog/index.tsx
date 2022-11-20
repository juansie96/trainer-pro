import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Typography,
} from '@mui/material'
import { getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { exercisesRef, getDocumentRef } from '../../../../../firebase/fbRefs'
import { Workout } from '../../../../../types/workout'
import { getExerciseImgUrl } from '../../../../../utils/utils'
import EditWorkoutDialog from '../EditWorkoutDialog'
import { restDropdownItems } from '../WorkoutExercisesTable/data'
import { IProps } from './types'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { Stack } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import EventIcon from '@mui/icons-material/Event'
import { ClientState, selectClient } from '../../../Client/Client.slice'
import { useAppSelector } from '../../../../../state/storeHooks'
import { Client } from '../../../../../types/client'
import Swal from 'sweetalert2'

const PreviewWorkoutDialog = ({ onClose, data, workoutId }: IProps) => {
  const [exercises] = useCollectionData(exercisesRef)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [workout, setWorkout] = useState<Workout | undefined>(data)
  const client = useAppSelector(selectClient)

  const openEditDialog = () => setEditDialogOpen(true)
  const closeEditDialog = () => setEditDialogOpen(false)

  useEffect(() => {
    if (!data && workoutId) {
      getDoc(getDocumentRef('workouts', workoutId as string)).then((res) => {
        setWorkout(res.data())
      })
    }
  }, [])

  const handleClose = (e: any) => {
    e.stopPropagation()
    onClose()
  }

  const handleDeleteEvent = async () => {
    const docRef = getDocumentRef('clients', client!.id as string)
    const newTasks = (client as ClientState).tasks.filter(
      (t) => t.type === 'workout' && t.workoutId === (data as Workout).id,
    )

    try {
      await updateDoc<Client>(docRef, { tasks: newTasks })
      Swal.fire('¡Éxito!', 'El evento se eliminó correctamente', 'success')
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  if (!workout) return null

  return (
    <Dialog open={true} onClose={handleClose} fullWidth maxWidth='md'>
      <Box
        borderBottom='1px solid #e3e3e3'
        display={'flex'}
        justifyContent='space-between'
        alignItems={'center'}
        pr={3}
      >
        <DialogTitle>{workout.name}</DialogTitle>
        <Tooltip title='cerrar ventana'>
          <CloseIcon fontSize='medium' cursor='pointer' onClick={handleClose} />
        </Tooltip>
      </Box>
      <DialogContent sx={{ pt: 3, pb: 4 }}>
        <DialogContentText>{workout.description} asdasdaasd</DialogContentText>
        <Box margin='auto' mt={2} width='fit-content'>
          {workout.workoutExercises.map((exercise) => {
            const exerciseData = exercises?.find((e) => e.id === exercise.exerciseId)
            if (!exerciseData) return <React.Fragment key={exercise.id}></React.Fragment>
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
      <DialogActions
        sx={{ px: 3, py: 2, borderTop: '1px solid #e3e3e3', justifyContent: 'space-between' }}
      >
        <Stack direction='row' spacing={2}>
          <Tooltip title='editar rutina' onClick={openEditDialog}>
            <EditIcon color='primary' fontSize='large' sx={{ cursor: 'pointer' }} />
          </Tooltip>
        </Stack>
        <Box>
          {data ? (
            <>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type='submit' variant='contained'>
                Aceptar
              </Button>
            </>
          ) : (
            <>
              <Button variant='contained' color='error' sx={{ height: 38 }}>
                <DeleteForeverIcon
                  fontSize='large'
                  sx={{ cursor: 'pointer', color: 'white', mr: 1 }}
                  onClick={handleDeleteEvent}
                />
                Borrar evento
              </Button>
              <Button variant='contained' color='primary' sx={{ height: 38, ml: 2 }}>
                <EventIcon fontSize='large' sx={{ cursor: 'pointer', color: 'white', mr: 1 }} />
                Cambiar fecha
              </Button>
            </>
          )}
        </Box>
      </DialogActions>
      {editDialogOpen && <EditWorkoutDialog onClose={closeEditDialog} workout={workout} />}
    </Dialog>
  )
}

export default PreviewWorkoutDialog

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
import { deleteDoc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { exercisesRef, getDocumentRef } from '../../../../../firebase/fbRefs'
import { Workout } from '../../../../../types/workout'
import { getExerciseImgUrl } from '../../../../../utils'
import EditWorkoutDialog from '../EditWorkoutDialog'
import { restDropdownItems } from '../WorkoutExercisesTable/data'
import { IProps } from './types'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { Stack } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import { selectClient, tasksChanged } from '../../../../../redux/slices/Client.slice'
import { useAppDispatch, useAppSelector } from '../../../../../state/storeHooks'
import Swal from 'sweetalert2'
import CheckIcon from '@mui/icons-material/Check'
import type { Client } from '../../../../../types/client'

const PreviewWorkoutDialog = ({ onClose, data, eventData }: IProps) => {
  const client = useAppSelector(selectClient) as Client
  const dispatch = useAppDispatch()
  const [exercises] = useCollectionData(exercisesRef)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [workout, setWorkout] = useState<Workout | undefined>(data)

  useEffect(() => {
    if (eventData) {
      getDoc(getDocumentRef('workouts', eventData.entityId)).then((res) => {
        setWorkout(res.data())
      })
    }
  }, [])

  const openEditDialog = () => setEditDialogOpen(true)
  const closeEditDialog = () => setEditDialogOpen(false)

  const handleClose = (e: any) => {
    e.stopPropagation()
    onClose()
  }

  const handleDeleteEvent = async () => {
    const docRef = getDocumentRef('clients', client.id as string)
    const newTasks = client.tasks.filter((t) => !(t.id === eventData?.id))
    try {
      await updateDoc<Client>(docRef, { tasks: newTasks })
      dispatch(tasksChanged(newTasks))
      Swal.fire('¡Éxito!', 'El evento se eliminó correctamente', 'success')
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  const handleCompleteEvent = async () => {
    const docRef = getDocumentRef('clients', client.id as string)
    const newTasks = client.tasks.map((t) =>
      t.id === eventData?.id
        ? { ...t, completed: { value: true, date: new Date().toISOString() } }
        : t,
    )
    try {
      await updateDoc<Client>(docRef, { tasks: newTasks })
      dispatch(tasksChanged(newTasks))
    } catch (error) {
      console.error(error)
    }
  }

  const handleWorkoutEdit = (newWorkout: Workout) => {
    setWorkout({ ...workout, ...newWorkout })
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
            if (!exerciseData) return <React.Fragment key={exercise.exerciseId}></React.Fragment>
            return (
              <Box
                key={exercise.exerciseId}
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
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #e3e3e3',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction='row' spacing={2}>
          <Tooltip title='editar rutina' onClick={openEditDialog}>
            <EditIcon color='primary' fontSize='large' sx={{ cursor: 'pointer' }} />
          </Tooltip>
        </Stack>
        <Stack direction='row' spacing={2} alignItems='center'>
          {!eventData ? (
            <Button onClick={handleClose} variant='contained'>
              Aceptar
            </Button>
          ) : (
            <>
              <Button
                variant='contained'
                sx={{ height: 38 }}
                onClick={() => (eventData.completed.value ? null : handleCompleteEvent())}
                color={eventData.completed.value ? 'success' : 'primary'}
              >
                <CheckIcon sx={{ mr: 1 }} />
                {eventData.completed.value ? 'Tarea completada' : 'Completar tarea'}
              </Button>
              <Button
                variant='contained'
                color='error'
                sx={{ height: 38 }}
                onClick={handleDeleteEvent}
              >
                <DeleteForeverIcon
                  fontSize='large'
                  sx={{ cursor: 'pointer', color: 'white', mr: 1 }}
                />
                Borrar tarea
              </Button>
              {/* {showDateInput ? (
                <Button variant='contained' color='primary' sx={{ height: 38, ml: 2 }}>
                  <EventIcon fontSize='large' sx={{ cursor: 'pointer', color: 'white', mr: 1 }} />
                  Cambiar fecha
                </Button>
              ) : (
                <Box ml={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      label='Fecha de nacimiento'
                      inputFormat='DD/MM/YYYY'
                      renderInput={(params) => <TextField {...params} sx={{ width: 250 }} />}
                      value={selectedDate}
                      onChange={setSelectedDate}
                    />
                  </LocalizationProvider>
                </Box>
              )} */}
            </>
          )}
        </Stack>
      </DialogActions>
      {editDialogOpen && (
        <EditWorkoutDialog
          onClose={closeEditDialog}
          workout={workout}
          onSubmit={handleWorkoutEdit}
        />
      )}
    </Dialog>
  )
}

export default PreviewWorkoutDialog

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { addDoc, Timestamp, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { FieldArrayWithId, useFieldArray, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { exercisesRef, workoutsRef } from '../../../../../firebase/fbRefs'

import { Exercise, Workout } from '../../../../../types/workout'
import { getExerciseImgUrl } from '../../../../../utils'
import FormContainer from '../../../../Form/FormContainer'
import TextFieldElement from '../../../../Form/TextFieldElement'
import WorkoutExercisesTable from '../WorkoutExercisesTable'
import { EditWorkoutDialogProps } from './types'

const EditWorkoutDialog = ({
  onClose,
  workout,
  onSubmit: onEditSuccess,
  clientId,
}: EditWorkoutDialogProps) => {
  const [exercises] = useCollectionData(exercisesRef)
  const formContext = useForm<Workout>({
    defaultValues: workout,
  })

  const { fields, append, remove } = useFieldArray({
    control: formContext.control,
    name: 'workoutExercises', // unique name for your Field Array
  })

  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [saveOnLibrary, setSaveOnLibrary] = useState(false)

  const filteredExercises =
    exercises && searchTerm.length
      ? exercises.filter((e) => e.name.toLowerCase().includes(searchTerm))
      : exercises

  const deleteSelectedExercises = (selected: readonly string[]) => {
    const idxs = selected.map((id) => fields.findIndex((f) => f.id === id))
    remove(idxs)
  }

  const onSubmit = async (newWorkout: Workout) => {
    setIsAdding(true)
    try {
      if (clientId) {
        const finalData = {
          ...newWorkout,
          createdAt: Timestamp.fromDate(new Date()),
          clientId,
        }
        delete finalData.id // We are getting a new id autogenerated by Firebase create processing
        const promises = []
        promises.push(addDoc(workoutsRef, finalData))

        if (saveOnLibrary) {
          promises.push(addDoc(workoutsRef, { ...finalData, clientId: '' }))
        }

        const [{ id }] = await Promise.all(promises)

        onEditSuccess({ ...finalData, id })
        return
      } else {
        await updateDoc(workout.ref, {
          ...newWorkout,
          updatedAt: Timestamp.fromDate(new Date()),
        })
      }

      if (onEditSuccess) {
        onEditSuccess(newWorkout as Workout)
      }
      Swal.fire('¡Éxito!', 'La rutina se editó correctamente!', 'success')
      setIsAdding(false)
      onClose()
    } catch (err: unknown) {
      console.error(err)
      setIsAdding(false)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al intentar editar la rutina, por favor intente nuevamente o comuniquese con un administrador.',
      })
    }
  }

  const handleAddExercise = (exercise: Exercise) => {
    append({
      rest: 0,
      exerciseId: exercise.id,
      ...(({ ref, id, creatorId, ...data }) => data)(exercise),
    })
  }

  const handleSearchExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase())
  }

  return (
    <Dialog
      open={true}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 0.95, width: 0.95, height: 0.95 } }}
    >
      <FormContainer
        formContext={formContext}
        handleSubmit={formContext.handleSubmit(onSubmit)}
        FormProps={{
          style: { height: '100%', display: 'flex', flexDirection: 'column' },
        }}
      >
        <Box borderBottom='1px solid #e3e3e3'>
          <DialogTitle>Editar Rutina</DialogTitle>
        </Box>
        <DialogContent sx={{ pt: 3, pb: 4 }}>
          <Stack
            width={1}
            direction='row'
            justifyContent='space-between'
            flexWrap='wrap'
            mt={2}
            position='relative'
          >
            <LeftSideContent
              exercises={exercises}
              fields={fields}
              deleteSelectedExercises={deleteSelectedExercises}
            />
            <UIVerticalSeparator />
            <RightSideContent
              exercises={filteredExercises}
              onExerciseClick={handleAddExercise}
              onSearchExerciseChange={handleSearchExerciseChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid #e3e3e3',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            {clientId && (
              <Stack direction='row' alignItems='center'>
                <Checkbox
                  value={saveOnLibrary}
                  onChange={(e) => setSaveOnLibrary(e.target.checked)}
                />
                <Typography>Guardar plan en mi biblioteca</Typography>
              </Stack>
            )}
          </div>
          <div>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              type='submit'
              variant='contained'
              disabled={isAdding || (!formContext.formState.isDirty && !clientId)}
            >
              {isAdding
                ? clientId
                  ? 'Guardando rutina'
                  : 'Editando Rutina'
                : clientId
                ? 'Guardar rutina'
                : 'Editar Rutina'}
            </Button>
          </div>
        </DialogActions>
      </FormContainer>
    </Dialog>
  )
}

const LeftSideContent = ({
  exercises,
  fields,
  deleteSelectedExercises,
}: {
  exercises: Exercise[] | undefined
  fields: FieldArrayWithId<Workout, 'workoutExercises', 'id'>[]
  deleteSelectedExercises: (selected: readonly string[]) => void
}) => {
  return (
    <Box width={0.55}>
      <TextFieldElement
        name='name'
        label='Nombre'
        validation={{ required: 'El nombre es requerido' }}
        size='small'
        fullWidth
      />
      <TextFieldElement
        name='description'
        label='Descripción'
        validation={{ required: 'La descripción es requerida' }}
        size='small'
        fullWidth
        multiline
        rows={3}
        sx={{ my: 2 }}
      />
      {exercises ? (
        <WorkoutExercisesTable
          fields={fields}
          exercises={exercises}
          onRemoveExercises={deleteSelectedExercises}
        />
      ) : (
        <p>Cargando tabla</p>
      )}
    </Box>
  )
}

const UIVerticalSeparator = () => <Box width={'1px'} bgcolor='#b1aeae71'></Box>

const RightSideContent = ({
  exercises,
  onExerciseClick,
  onSearchExerciseChange,
}: {
  exercises: Exercise[] | undefined
  onExerciseClick: (exercise: Exercise) => void
  onSearchExerciseChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <Box width={0.4}>
    <DialogContentText sx={{ mb: 1 }}>
      Selecciona los ejercicios de tu nueva rutina
    </DialogContentText>
    <TextField
      name=''
      fullWidth
      size='small'
      label='Busca ejercicios por nombre'
      onChange={onSearchExerciseChange}
    />
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        width: 1,
        gridGap: 6,
        marginTop: 3,
      }}
    >
      {exercises?.map((e) => (
        <ExerciseCard exercise={e} onClick={onExerciseClick} key={e.id} />
      ))}
    </Box>
  </Box>
)

const ExerciseCard = ({
  exercise,
  onClick,
}: {
  exercise: Exercise
  onClick: (exercise: Exercise) => void
}) => {
  const Tags = () => (
    <Box pl={1}>
      {exercise.tags?.length > 0 ? (
        exercise.tags.map((tag, idx) => {
          const isLastItem = idx === exercise.tags.length - 1

          return (
            <Typography variant='caption' component='span' key={idx}>
              {tag + (isLastItem ? '' : ', ')}
            </Typography>
          )
        })
      ) : (
        <Typography variant='caption' component='span'>
          Este ejercicio no contiene tags
        </Typography>
      )}
    </Box>
  )

  return (
    <Paper
      elevation={3}
      onClick={() => onClick(exercise)}
      sx={{ cursor: 'pointer', borderRadius: '10px' }}
    >
      <Box position='relative' width={1} height='150px' sx={{ borderRadius: '10px' }}>
        <img
          src={getExerciseImgUrl(exercise)}
          alt={exercise.name}
          width='100%'
          height='100%'
          style={{ borderRadius: '10px 10px 0 0' }}
        />
        <Box
          boxShadow='0px 0px 50px 11px rgba(0,0,0,0.75) inset'
          position='absolute'
          top={0}
          width={1}
          height={1}
          borderRadius={'10px 10px 0 0'}
        ></Box>
        <Box position='absolute' bottom={5} left={5}>
          <Typography variant='caption' color='white' fontWeight={600}>
            {exercise.name}
          </Typography>
        </Box>
      </Box>
      <Tags />
    </Paper>
  )
}

export default EditWorkoutDialog

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Box } from '@mui/system'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import {
  Card,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getWorkoutsByTrainerIdRef } from '../../../firebase/fbRefs'
import { Workout } from '../../../types/workout'
import Swal from 'sweetalert2'
import { doc, updateDoc } from 'firebase/firestore'
import { selectClient, taskAdded } from './Client.slice'
import { useAppDispatch, useAppSelector } from '../../../state/storeHooks'
import { firestoreDB } from '../../../firebase/firebase'
import { Controller, SubmitHandler } from 'react-hook-form'
import TextFieldElement from '../../Form/TextFieldElement'
import FormContainer from '../../Form/FormContainer'
import { useDispatch } from 'react-redux'
import { selectTrainer } from '../../../redux/slices/trainerSlice'
import AddWorkoutDialog from '../Workouts/Routines/AddWorkoutDialog'
import { v4 as uuidv4 } from 'uuid'
import { Client } from '../../../types/client'
import type { CardioTask, CardioTypes, WorkoutTask } from '../../../types/task'

interface AddNewTaskDialogProps {
  onClose(): void
  day: Date
}

type Status = 'initial' | 'workout' | 'cardio' | 'mealPlan'

const AddNewTaskDialog = ({ onClose, day }: AddNewTaskDialogProps) => {
  const [status, setStatus] = useState<Status>('initial')

  return (
    <div>
      <Dialog open={true} onClose={onClose} maxWidth='sm' fullWidth>
        <Box borderBottom='1px solid #e3e3e3'>
          <DialogTitle>Agregar nueva tarea</DialogTitle>
        </Box>
        <DialogContent sx={{ p: 0 }}>
          {status === 'initial' && <InitialContent setStatus={setStatus} />}
          {status === 'workout' && <SelectWorkoutContent onClose={onClose} day={day} />}
          {status === 'cardio' && <AddCardioForm onClose={onClose} day={day} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

const InitialContent = ({
  setStatus,
}: {
  setStatus: React.Dispatch<React.SetStateAction<Status>>
}) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2em', p: 2 }}>
    <WorkoutCard onClick={() => setStatus('workout')} />
    <CardioCard onClick={() => setStatus('cardio')} />
  </Box>
)

const WorkoutCard = ({ onClick }: { onClick(): void }) => {
  return (
    <Card
      onClick={onClick}
      sx={{ py: 4, cursor: 'pointer', '&:hover': { bgcolor: '#e7e7e7' } }}
      elevation={3}
    >
      <Box display={'flex'} flexDirection='column' justifyContent={'center'} alignItems='center'>
        <FitnessCenterIcon fontSize='large' />
        <Typography variant='h6' fontWeight={600} sx={{ mt: 1 }}>
          Rutina
        </Typography>
      </Box>
    </Card>
  )
}

const CardioCard = ({ onClick }: { onClick(): void }) => {
  return (
    <Card
      onClick={onClick}
      sx={{ py: 4, cursor: 'pointer', '&:hover': { bgcolor: '#e7e7e7' } }}
      elevation={3}
    >
      <Box display={'flex'} flexDirection='column' justifyContent={'center'} alignItems='center'>
        <DirectionsRunIcon fontSize='large' />
        <Typography variant='h6' fontWeight={600} sx={{ mt: 1 }}>
          Cardio
        </Typography>
      </Box>
    </Card>
  )
}

const SelectWorkoutContent = ({ onClose, day }: { onClose(): void; day: Date }) => {
  const trainer = useAppSelector(selectTrainer)
  const client = useAppSelector(selectClient) as Client
  const dispatch = useAppDispatch()
  const [addWorkoutDialogOpen, setAddWorkoutDialogOpen] = useState<boolean>(false)

  const openAddWorkoutDialog = () => {
    setAddWorkoutDialogOpen(true)
  }

  const closeAddWorkoutDialog = () => {
    setAddWorkoutDialogOpen(false)
  }
  const [workouts, loading] = useCollectionData(getWorkoutsByTrainerIdRef(trainer.id as string))
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('')
  const hasError = false
  if (loading) {
    return (
      <Box p={3} display='flex' justifyContent={'center'} alignItems='center'>
        <CircularProgress />
      </Box>
    )
  }

  const handleSubmit = () => {
    const docRef = doc(firestoreDB, 'clients', client.id as string)

    const task: WorkoutTask = {
      id: uuidv4(),
      type: 'workout',
      entityId: selectedWorkoutId,
      date: day.toISOString(),
      title: (workouts as Workout[]).find((w) => w.id === selectedWorkoutId)?.name as string,
      completed: { value: false, date: null },
    }

    const newTasks = client.tasks ? [...client.tasks, task] : [task]
    updateDoc(docRef, {
      tasks: newTasks,
    })
    dispatch(taskAdded(task))
    Swal.fire('¡Éxito!', 'La rutina se asignó correctamente!', 'success')
    onClose()
  }

  return (
    <Box>
      <Stack direction='row' alignItems='center' px={3} pt={2} justifyContent='space-between'>
        <Typography fontWeight={700}>Seleccione la rutina</Typography>
        <Button variant='contained' onClick={openAddWorkoutDialog}>
          Crear rutina
        </Button>
      </Stack>
      {workouts && workouts.length > 0 ? (
        <RadioGroup
          sx={{ px: 3, py: 1 }}
          onChange={(e) => setSelectedWorkoutId(e.target.value)}
          defaultChecked={false}
        >
          {hasError && (
            <Typography variant='caption' fontWeight={600} color='error'>
              Debe seleccionar una de las opciones
            </Typography>
          )}
          {(workouts as Workout[]).map((workout) => (
            <FormControlLabel
              key={workout.id}
              value={workout.id}
              control={<Radio />}
              label={workout.name}
            />
          ))}
        </RadioGroup>
      ) : (
        <Typography sx={{ px: 3, py: 2 }}>Todavía no se creó ninguna rutina</Typography>
      )}
      <Box sx={{ borderTop: '1px solid #e3e3e3', p: 2 }} display='flex' justifyContent={'end'}>
        <Button onClick={onClose} sx={{ mr: 1 }}>
          Cancelar
        </Button>
        <Button variant='contained' onClick={handleSubmit}>
          Agregar
        </Button>
      </Box>
      {addWorkoutDialogOpen && (
        <AddWorkoutDialog open={addWorkoutDialogOpen} onClose={closeAddWorkoutDialog} />
      )}
    </Box>
  )
}

const AddCardioForm = ({ onClose, day }: { onClose(): void; day: Date }) => {
  const client = useAppSelector(selectClient) as Client
  const dispatch = useDispatch()

  const cardioTypes = ['correr', 'caminar', 'ciclismo', 'elíptico', 'nadar', 'otro']
  const defaultValues: CardioTask & { cardioType: CardioTypes } = {
    id: uuidv4(),
    cardioType: '',
    distance: '',
    type: 'cardio',
    date: day.toISOString(),
    title: '',
    entityId: '',
    completed: { value: false, date: null },
  }
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit: SubmitHandler<typeof defaultValues> = async (data) => {
    const docRef = doc(firestoreDB, 'clients', client.id as string)
    const finalTask = {
      ...data,
      title: data.cardioType[0].toUpperCase() + data.cardioType.substring(1),
    }
    setIsLoading(true)

    try {
      await updateDoc(docRef, {
        tasks: [...client.tasks, finalTask],
      })
      Swal.fire('¡Éxito!', 'El cardio se asignó correctamente!', 'success')
      dispatch(taskAdded(finalTask))
      onClose()
    } catch (error) {
      onClose()
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se pudo agregar la rutina, intente nuevamente.',
      })
    }
  }

  return (
    <Box>
      <FormContainer onSuccess={handleSubmit} defaultValues={defaultValues}>
        <Box p={3}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Tipo</InputLabel>
            <Controller
              name='cardioType'
              rules={{ required: true }}
              render={({ field, fieldState: { invalid } }) => (
                <>
                  <Select {...field} error={invalid} required placeholder='lala'>
                    {cardioTypes.map((type) => (
                      <MenuItem value={type} key={type} sx={{ py: 0, fontSize: '0.9em' }}>
                        {type[0].toUpperCase() + type.substring(1)}
                      </MenuItem>
                    ))}
                  </Select>
                  {invalid && (
                    <Typography variant='caption' color={'error'} sx={{ m: 1 }}>
                      Este campo es requerido
                    </Typography>
                  )}
                </>
              )}
            />
          </FormControl>
          <TextFieldElement
            name='distance'
            label='Distancia a recorrer'
            required
            fullWidth
            sx={{ mt: 3 }}
          />
        </Box>
        <Box sx={{ borderTop: '1px solid #e3e3e3', p: 2 }} display='flex' justifyContent={'end'}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button variant='contained' type='submit' disabled={isLoading}>
            Agregar
          </Button>
        </Box>
      </FormContainer>
    </Box>
  )
}

export default AddNewTaskDialog

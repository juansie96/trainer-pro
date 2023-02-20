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
import { Dispatch, useEffect, useState } from 'react'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getWorkoutsByTrainerIdRef } from '../../../firebase/fbRefs'
import { Workout } from '../../../types/workout'
import Swal from 'sweetalert2'
import { doc, updateDoc } from 'firebase/firestore'
import { selectClient, taskAdded, tasksAdded } from '../../../redux/slices/Client.slice'
import { useAppDispatch, useAppSelector } from '../../../state/storeHooks'
import { firestoreDB } from '../../../firebase/firebase'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import TextFieldElement from '../../Form/TextFieldElement'
import FormContainer from '../../Form/FormContainer'
import { useDispatch } from 'react-redux'
import { selectTrainer } from '../../../redux/slices/Trainer.slice'
import AddWorkoutDialog from '../Workouts/Routines/AddWorkoutDialog'
import { v4 as uuidv4 } from 'uuid'
import { Client } from '../../../types/client'
import type { CardioTask, CardioTypes, WorkoutTask } from '../../../types/task'
import EditWorkoutDialog from '../Workouts/Routines/EditWorkoutDialog'
import { DayCircle } from './ClientNutrition/SchedulePlanDialog/styles'
import { getDateIncreasedByNDays, getDateIncreasedByNWeeks } from '../../../utils/dates'

interface AddNewTaskDialogProps {
  onClose(): void
  day: Date
}

type Status = 'initial' | 'repeatForm' | 'workout' | 'cardio'

interface RepeatTaskFormData {
  isTaskRepeated: boolean
  numberOfWeeks: number
  repeatDays: IRepeatDay[]
}

interface IRepeatDay {
  label: string
  isActive: boolean
  dayNumber: number
}

const getNumberOfDaysToAdd = (daysDifference: number) => {
  if (daysDifference >= 0) return daysDifference
  return daysDifference === -2 ? 5 : 6
}

const AddNewTaskDialog = ({ onClose, day }: AddNewTaskDialogProps) => {
  const dispatch = useAppDispatch()
  const client = useAppSelector(selectClient)
  const [status, setStatus] = useState<Status>('initial')
  const [repeatTaskData, setRepeatTaskData] = useState<RepeatTaskFormData>({
    isTaskRepeated: undefined,
    numberOfWeeks: undefined,
    repeatDays: [],
  })
  const [isRepeatFormActive, setIsRepeatFormActive] = useState(false)

  const handleWorkoutAssignation = async (workout: Workout) => {
    const { isTaskRepeated, repeatDays, numberOfWeeks } = repeatTaskData
    const tasks: WorkoutTask[] = []
    const todayTask = createWorkoutTask(workout, day)

    if (isTaskRepeated) {
      for (let i = 1; i <= +numberOfWeeks; i++) {
        const minDate = i === 1 ? day : getDateIncreasedByNWeeks(day, i - 1)
        if (i === 1) tasks.push(todayTask)
        repeatDays
          .filter((d) => d.isActive)
          .forEach((day) => {
            const dayDifference = day.dayNumber - minDate.getDay()
            if (dayDifference === 0 && i === 1) return
            const taskDate = getDateIncreasedByNDays(minDate, getNumberOfDaysToAdd(dayDifference))
            tasks.push(createWorkoutTask(workout, taskDate))
          })
      }
    } else {
      tasks.push(todayTask)
    }
    const docRef = doc(firestoreDB, 'clients', client.id as string)
    try {
      dispatch(tasksAdded(tasks))
      await updateDoc(docRef, {
        tasks: [...(client.tasks ? client.tasks : []), ...tasks],
      })
      Swal.fire('¡Éxito!', '¡El plan se asignó correctamente!', 'success')
      onClose()
    } catch (err: unknown) {
      Swal.fire({
        icon: 'error',
        title: 'Error al asignar',
        text: 'Hubo un error al asignar el plan alimenticio, por favor intente nuevamente o comuniquese con un administrador.',
      })
    }
  }

  const handleRepeatTaskFormSubmit = (data: RepeatTaskFormData) => {
    setIsRepeatFormActive(false)
    setRepeatTaskData(data)
  }

  return (
    <div>
      <Dialog open={true} onClose={onClose} maxWidth='sm' fullWidth>
        <Box borderBottom='1px solid #e3e3e3'>
          <DialogTitle>Agregar nueva tarea</DialogTitle>
        </Box>
        <DialogContent sx={{ p: 0 }}>
          {status === 'initial' && (
            <InitialContent setStatus={setStatus} setIsRepeatFormActive={setIsRepeatFormActive} />
          )}
          {isRepeatFormActive && (
            <RepeatTaskForm onSubmit={handleRepeatTaskFormSubmit} onClose={onClose} />
          )}
          {status === 'workout' && !isRepeatFormActive && (
            <SelectWorkoutContent
              onClose={onClose}
              day={day}
              onWorkoutAssignation={handleWorkoutAssignation}
            />
          )}
          {status === 'cardio' && !isRepeatFormActive && (
            <AddCardioForm onClose={onClose} day={day} repeatTaskFormData={repeatTaskData} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

const InitialContent = ({
  setStatus,
  setIsRepeatFormActive,
}: {
  setStatus: Dispatch<Status>
  setIsRepeatFormActive: Dispatch<boolean>
}) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2em', p: 2 }}>
    <WorkoutCard
      onClick={() => {
        setStatus('workout')
        setIsRepeatFormActive(true)
      }}
    />
    <CardioCard
      onClick={() => {
        setStatus('cardio')
        setIsRepeatFormActive(true)
      }}
    />
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

const createWorkoutTask = (workout: Workout, day: Date): WorkoutTask => ({
  id: uuidv4(),
  type: 'workout',
  entityId: workout.id,
  date: day.toISOString(),
  title: workout.name,
  completed: { value: false, date: null },
})

export interface WorkoutDialogState {
  open: boolean
  workoutId: string
}

interface FormValues {
  isTaskRepeated: string
  assignationDate: Date
  numberOfWeeks: string
}

const SelectWorkoutContent = ({
  onClose,
  onWorkoutAssignation,
}: {
  onClose(): void
  day: Date
  onWorkoutAssignation: (workout: Workout) => void
}) => {
  const trainer = useAppSelector(selectTrainer)
  const client = useAppSelector(selectClient)

  const [addWorkoutDialogOpen, setAddWorkoutDialogOpen] = useState<boolean>(false)
  const [editWorkoutDialogOpen, setEditWorkoutDialogOpen] = useState<boolean>(false)
  const [workouts, loading] = useCollectionData(getWorkoutsByTrainerIdRef(trainer.id as string))
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('')

  const openAddWorkoutDialog = () => {
    setAddWorkoutDialogOpen(true)
  }

  const closeAddWorkoutDialog = () => {
    setAddWorkoutDialogOpen(false)
  }

  const hasError = false
  if (loading) {
    return (
      <Box p={3} display='flex' justifyContent={'center'} alignItems='center'>
        <CircularProgress />
      </Box>
    )
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
        <Button
          variant='contained'
          onClick={() => setEditWorkoutDialogOpen(true)}
          disabled={!selectedWorkoutId}
        >
          Usar plantilla
        </Button>
      </Box>
      {addWorkoutDialogOpen && (
        <AddWorkoutDialog
          open={addWorkoutDialogOpen}
          onClose={closeAddWorkoutDialog}
          clientId={client.id}
          onAssign={onWorkoutAssignation}
        />
      )}
      {editWorkoutDialogOpen && (
        <EditWorkoutDialog
          workout={workouts.find((w) => w.id === selectedWorkoutId)}
          onClose={() => setEditWorkoutDialogOpen(false)}
          clientId={client.id}
          onSubmit={onWorkoutAssignation}
        />
      )}
    </Box>
  )
}

const RepeatTaskForm = ({
  onSubmit,
  onClose,
}: {
  onSubmit(data: RepeatTaskFormData): void
  onClose(): void
}) => {
  const fc = useForm<FormValues>({
    defaultValues: {
      isTaskRepeated: 'false',
      numberOfWeeks: undefined,
    },
  })

  const { control, watch } = fc
  const isTaskRepeated = 'true' === watch('isTaskRepeated')

  const [noDaysSelected, setNoDaysSelected] = useState(false)
  const [repeatDays, setRepeatDays] = useState([
    { label: 'L', isActive: false, dayNumber: 1 },
    { label: 'M', isActive: false, dayNumber: 2 },
    { label: 'X', isActive: false, dayNumber: 3 },
    { label: 'J', isActive: false, dayNumber: 4 },
    { label: 'V', isActive: false, dayNumber: 5 },
    { label: 'S', isActive: false, dayNumber: 6 },
    { label: 'D', isActive: false, dayNumber: 7 },
  ])

  useEffect(() => {
    if (noDaysSelected) {
      setNoDaysSelected(repeatDays.every((d) => !d.isActive))
    }
  }, [repeatDays])

  const handleDayClick = (dayLabel: string) => {
    setRepeatDays(
      repeatDays.map((d) => (d.label === dayLabel ? { ...d, isActive: !d.isActive } : d)),
    )
  }

  const handleSubmit: SubmitHandler<RepeatTaskFormData> = ({ numberOfWeeks }) => {
    if (isTaskRepeated && repeatDays.every((d) => !d.isActive)) {
      setNoDaysSelected(repeatDays.every((d) => !d.isActive))
      return
    }
    onSubmit({
      isTaskRepeated,
      numberOfWeeks,
      repeatDays,
    })
  }
  return (
    <FormContainer formContext={fc} onSuccess={handleSubmit}>
      <Box py={2} px={3}>
        <Typography>¿Quieres repetir esta tarea?</Typography>
        <Controller
          control={control}
          name='isTaskRepeated'
          render={({ field }) => (
            <RadioGroup row {...field}>
              <FormControlLabel value={'true'} control={<Radio />} label='Si' />
              <FormControlLabel value={'false'} control={<Radio />} label='No' />
            </RadioGroup>
          )}
        />
        {!!isTaskRepeated && (
          <>
            <Box mt={2}>
              <Typography>
                Repetir los días{' '}
                {noDaysSelected && (
                  <span style={{ fontSize: 11, color: 'red' }}>DEBES SELECCIONAR ALGÚN DÍA</span>
                )}
              </Typography>
              <Stack direction={'row'} spacing={1.5} mt={1}>
                {repeatDays.map(({ label, isActive }) => (
                  <DayCircle key={label} isActive={isActive} onClick={() => handleDayClick(label)}>
                    {label}
                  </DayCircle>
                ))}
              </Stack>
            </Box>
            <Box display='flex' alignItems={'center'} mt={2}>
              <Typography>Durante</Typography>
              <TextFieldElement
                fullWidth
                name='numberOfWeeks'
                type='number'
                variant='outlined'
                sx={{ mx: 1, width: 75 }}
                size='small'
                validation={{
                  required: true,
                  min: 1,
                }}
              />
              <Typography>semanas</Typography>
            </Box>
          </>
        )}
      </Box>
      <Box sx={{ borderTop: '1px solid #e3e3e3', p: 2 }} display='flex' justifyContent={'end'}>
        <Button onClick={onClose} sx={{ mr: 1 }}>
          Cancelar
        </Button>
        <Button variant='contained' type='submit'>
          Siguiente
        </Button>
      </Box>
    </FormContainer>
  )
}

const createCardioTask = (
  data: CardioTask & { cardioType: CardioTypes },
  day: Date,
): CardioTask => ({
  id: uuidv4(),
  type: 'cardio',
  entityId: '',
  date: day.toISOString(),
  title: data.cardioType[0].toUpperCase() + data.cardioType.substring(1),
  cardioType: data.cardioType,
  distance: data.distance,
  completed: { value: false, date: null },
})

const AddCardioForm = ({
  onClose,
  day,
  repeatTaskFormData,
}: {
  onClose(): void
  day: Date
  repeatTaskFormData: RepeatTaskFormData
}) => {
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
    const { isTaskRepeated, repeatDays, numberOfWeeks } = repeatTaskFormData
    const tasks: CardioTask[] = []
    const todayTask = createCardioTask(data, day)

    if (isTaskRepeated) {
      for (let i = 1; i <= +numberOfWeeks; i++) {
        const minDate = i === 1 ? day : getDateIncreasedByNWeeks(day, i - 1)
        if (i === 1) tasks.push(todayTask)
        repeatDays
          .filter((d) => d.isActive)
          .forEach((day) => {
            const dayDifference = day.dayNumber - minDate.getDay()
            if (dayDifference === 0 && i === 1) return
            const taskDate = getDateIncreasedByNDays(minDate, getNumberOfDaysToAdd(dayDifference))
            tasks.push(createCardioTask(data, taskDate))
          })
      }
    } else {
      tasks.push(todayTask)
    }

    const docRef = doc(firestoreDB, 'clients', client.id as string)
    try {
      setIsLoading(true)
      dispatch(tasksAdded(tasks))
      await updateDoc(docRef, {
        tasks: [...(client.tasks ? client.tasks : []), ...tasks],
      })
      Swal.fire('¡Éxito!', '¡El plan se asignó correctamente!', 'success')
      onClose()
    } catch (err: unknown) {
      Swal.fire({
        icon: 'error',
        title: 'Error al asignar',
        text: 'Hubo un error al asignar el plan alimenticio, por favor intente nuevamente o comuniquese con un administrador.',
      })
    } finally {
      setIsLoading(false)
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

import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Stack,
  Input,
} from '@mui/material'
import { StyledDialogActions, StyledDialogHeader } from '../../../../UI/Dialogs/styles'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { doc, updateDoc } from 'firebase/firestore'
import { firestoreDB } from '../../../../../firebase/firebase'
import { selectClient, tasksAdded } from '../../../../../redux/slices/Client.slice'
import { useAppDispatch, useAppSelector } from '../../../../../state/storeHooks'
import { v4 as uuidv4 } from 'uuid'
import { MealPlanTask } from '../../../../../types/task'
import { DayCircle } from './styles'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import FormContainer from '../../../../Form/FormContainer'
import TextFieldElement from '../../../../Form/TextFieldElement'
import { getDateIncreasedByNWeeks, getDateIncreasedByNDays } from '../../../../../utils/dates'
import Swal from 'sweetalert2'

interface FormValues {
  isTaskRepeated: string
  assignationDate: Date
  numberOfWeeks: string
}

const getDate = (date: Date | undefined): Date => (date ? new Date(date) : new Date())

const getTask = (date: Date, entityId: string): MealPlanTask => ({
  id: uuidv4(),
  entityId,
  date: date.toISOString(),
  title: 'Nutrición',
  type: 'mealPlan',
})

const getNumberOfDaysToAdd = (daysDifference: number) => {
  if (daysDifference >= 0) return daysDifference
  return daysDifference === -2 ? 5 : 6
}

const SchedulePlanDialog = ({ onClose, mealPlanId }: { onClose(): void; mealPlanId: string }) => {
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const client = useAppSelector(selectClient)
  const dispatch = useAppDispatch()

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

  const fc = useForm<FormValues>({
    defaultValues: {
      isTaskRepeated: 'false',
      assignationDate: new Date(),
      numberOfWeeks: undefined,
    },
  })

  const { control, watch } = fc

  const isTaskRepeated = 'true' === watch('isTaskRepeated')

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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (isTaskRepeated && repeatDays.every((d) => !d.isActive)) {
      setNoDaysSelected(repeatDays.every((d) => !d.isActive))
      return
    }

    const date = getDate(data.assignationDate)
    const tasks: MealPlanTask[] = []

    if (isTaskRepeated) {
      for (let i = 1; i <= +data.numberOfWeeks; i++) {
        const minDate = i === 1 ? date : getDateIncreasedByNWeeks(date, i - 1)
        if (i === 1) tasks.push(getTask(date, mealPlanId))
        repeatDays
          .filter((d) => d.isActive)
          .forEach((day) => {
            const dayDifference = day.dayNumber - minDate.getDay()
            if (dayDifference === 0 && i === 1) return
            const taskDate = getDateIncreasedByNDays(minDate, getNumberOfDaysToAdd(dayDifference))
            tasks.push(getTask(taskDate, mealPlanId))
          })
      }
    } else {
      tasks.push(getTask(date, mealPlanId))
    }

    setIsAdding(true)
    const docRef = doc(firestoreDB, 'clients', client.id as string)
    try {
      dispatch(tasksAdded(tasks))
      await updateDoc(docRef, {
        tasks: [...(client.tasks ? client.tasks : []), ...tasks],
      })
      Swal.fire('¡Éxito!', '¡El plan se asignó correctamente!', 'success')
      setIsAdding(false)
      onClose()
    } catch (err: unknown) {
      setIsAdding(false)
      Swal.fire({
        icon: 'error',
        title: 'Error al asignar',
        text: 'Hubo un error al asignar el plan alimenticio, por favor intente nuevamente o comuniquese con un administrador.',
      })
    }
  }

  return (
    <Dialog open onClose={onClose}>
      <FormContainer formContext={fc} onSuccess={onSubmit}>
        <StyledDialogHeader title='Agendar plan' />
        <DialogContent sx={{ pt: 3, pb: 4 }}>
          <Typography>Elige la fecha en la que quieres asignar el plan al cliente:</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              control={control}
              name={'assignationDate'}
              render={({ field }) => (
                <DesktopDatePicker
                  label='Fecha de asignación'
                  inputFormat='DD/MM/YYYY'
                  renderInput={(params) => <TextField {...params} fullWidth sx={{ my: 2 }} />}
                  {...field}
                />
              )}
            />
          </LocalizationProvider>
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
                    <DayCircle
                      key={label}
                      isActive={isActive}
                      onClick={() => handleDayClick(label)}
                    >
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
        </DialogContent>
        <StyledDialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type='submit' variant='contained' disabled={isAdding}>
            {isAdding ? 'Asignando' : 'Asignar'}
          </Button>
        </StyledDialogActions>
      </FormContainer>
    </Dialog>
  )
}

export default SchedulePlanDialog

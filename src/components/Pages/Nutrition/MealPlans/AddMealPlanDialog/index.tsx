import { useState } from 'react'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../../../../state/storeHooks'
import { selectTrainer } from '../../../../../redux/slices/trainerSlice'
import { Button, Dialog, DialogContent, Typography, Stack, Box } from '@mui/material'
import FormContainer from '../../../../Form/FormContainer'
import TextFieldElement from '../../../../Form/TextFieldElement'
import MealContent from './MealContent'
import { StyledDialogActions, StyledDialogHeader } from './styles'
import { changeGramsToFloat, getTotalNV } from './utils'
import { totalNVItems } from './data'
import {
  addDoc,
  doc,
  DocumentReference,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { clientsRef, getDocumentRef, mealPlansRef } from '../../../../../firebase/fbRefs'
import Swal from 'sweetalert2'
import type { MealPlan, Meals, NutritionalValueKeys } from '../../../../../types/meals'
import type { IProps } from './types'
import { selectClient, tasksChanged } from '../../../Client/Client.slice'
import { Client } from '../../../../../types/client'
import { firestoreDB } from '../../../../../firebase/firebase'
import { GeneralTask, MealPlanTask } from '../../../../../types/task'

const AddMealPlanDialog = ({
  open,
  onClose,
  mealPlan,
  fromAddTask,
  onSubmit: onEditSuccess,
}: IProps) => {
  const trainer = useAppSelector(selectTrainer)
  const client = useAppSelector(selectClient)
  const dispatch = useAppDispatch()
  const [isAdding, setIsAdding] = useState<boolean>(false)

  const formContext = useForm<MealPlan>({
    defaultValues: mealPlan
      ? mealPlan
      : {
          name: '',
          description: '',
          meals: [{ name: 'Comida 1' }],
          kcal: 0,
        },
  })

  const meals = formContext.watch().meals

  const { fields, append, remove } = useFieldArray({
    control: formContext.control,
    name: 'meals', // unique name for your Field Array
  })

  const onSubmit: SubmitHandler<MealPlan> = async (data) => {
    setIsAdding(true)
    try {
      if (mealPlan) {
        const newMealPlan = changeGramsToFloat({ ...data, createdAt: mealPlan.createdAt! })
        await updateDoc(getDocumentRef('mealPlans', newMealPlan.id!), {
          ...newMealPlan,
          kcal: parseFloat(getTotalNV('kcal' as NutritionalValueKeys, data.meals).toFixed(2)),
        })
        if (formContext.formState.dirtyFields.name) {
          const q = query<Client>(clientsRef, where('trainerId', '==', trainer.id as string))
          const querySnapshot = await getDocs<Client>(q)
          const clientsQuery: Client[] = []
          querySnapshot.forEach((doc) => clientsQuery.push(doc.data()))

          const promises: Promise<void>[] = []

          clientsQuery.forEach((c) => {
            const clientDoc = c as Client
            const containsMealPlanTask = c.tasks.some(
              (t) => t.type === 'mealPlan' && t.entityId == data.id,
            )
            if (containsMealPlanTask) {
              const newTasks = changeTasksTitle(clientDoc.tasks, mealPlan.id as string, data.name)
              const docRef = doc(firestoreDB, 'clients', clientDoc.id as string)
              promises.push(
                updateDoc<Client>(docRef as DocumentReference<Client>, { tasks: newTasks }),
              )
            }
          })

          await Promise.all(promises)

          if (client) {
            const newTasks = changeTasksTitle(client.tasks, mealPlan.id as string, data.name)
            dispatch(tasksChanged(newTasks))
          }
        }
        if (onEditSuccess) {
          onEditSuccess(data as MealPlan)
        }
      } else {
        const newMealPlan = changeGramsToFloat({
          ...data,
          createdAt: Timestamp.fromDate(new Date()),
        })
        await addDoc(mealPlansRef, {
          ...newMealPlan,
          trainerId: trainer.id,
          kcal: parseFloat(getTotalNV('kcal' as NutritionalValueKeys, data.meals).toFixed(2)),
        })
      }
      setIsAdding(false)
      onClose()
      if (!fromAddTask) {
        Swal.fire('¡Éxito!', 'El plan alimenticio se creó correctamente!', 'success')
      }
    } catch (error) {
      console.error(error)
      setIsAdding(false)
      onClose()
      Swal.fire({
        icon: 'error',
        title: 'Error al crear',
        text: 'Hubo un error al intentar crear el plan alimenticio, por favor intente nuevamente o comuniquese con un administrador.',
      })
    }
  }

  const changeTasksTitle = (tasks: GeneralTask[], id: string, name: string) =>
    tasks.map((t) => (t.type === 'mealPlan' && t.entityId === id ? { ...t, title: name } : t))

  const addMeal = () => {
    const mealNumber = fields.length + 1
    const name = `Comida ${mealNumber}`
    append({ name })
  }

  const deleteMeal = (idx: number) => remove(idx)

  return (
    <Dialog open={open} onClose={onClose} maxWidth='lg' fullWidth>
      <FormContainer formContext={formContext} onSuccess={onSubmit}>
        <StyledDialogHeader title='Nuevo plan nutricional' />
        <DialogContent sx={{ py: 3 }}>
          <Stack spacing={3}>
            <TextFieldElement name='name' label='Nombre del plan' required />
            <TextFieldElement
              name='description'
              label='Breve descripción (opcional)'
              multiline
              rows={3}
            />
            {fields.length > 0 && (
              <Box>
                <Typography fontSize={17} fontWeight={700} sx={{ mb: 1 }}>
                  Información nutricional del plan
                </Typography>
                <Stack direction='row' spacing={3}>
                  {totalNVItems.map((i) => (
                    <TotalNutritionalValue
                      meals={meals}
                      nvKey={i.key}
                      pointColor={i.color}
                      label={i.label}
                      key={i.key}
                    />
                  ))}
                </Stack>
              </Box>
            )}
            {fields.map((meal, idx) => (
              <MealContent key={meal.id} idx={idx} onDeleteMeal={() => deleteMeal(idx)} {...meal} />
            ))}
            <AddMealButton onClick={addMeal} />
          </Stack>
        </DialogContent>
        <StyledDialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type='submit' variant='contained' disabled={isAdding}>
            {mealPlan ? (isAdding ? 'Editando' : 'Editar') : isAdding ? 'Creando' : 'Crear'}
          </Button>
        </StyledDialogActions>
      </FormContainer>
    </Dialog>
  )
}

const AddMealButton = ({ onClick }: { onClick(): void }) => (
  <Button
    type='button'
    variant='contained'
    sx={{ width: 'fit-content', alignSelf: 'center' }}
    onClick={onClick}
  >
    Agregar nueva comida
  </Button>
)

const TotalNutritionalValue = ({
  meals,
  label,
  nvKey,
  pointColor,
}: {
  meals: Meals
  label: string
  nvKey: string
  pointColor: string
}) => (
  <Stack direction='row' alignItems='center' spacing={1}>
    <Box height={10} width={10} bgcolor={pointColor} borderRadius='50%' ml={0.7}></Box>
    <Typography fontWeight={700}>{label}:</Typography>
    <Typography>
      {getTotalNV(nvKey as NutritionalValueKeys, meals).toFixed(2)}{' '}
      {nvKey === 'kcal' ? 'kcal' : 'g'}
    </Typography>
  </Stack>
)

export default AddMealPlanDialog

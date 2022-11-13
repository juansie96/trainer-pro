import { useState } from 'react'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
// import { useAppSelector } from '../../../../../state/storeHooks'
// import { selectTrainer } from '../../../../../redux/slices/trainerSlice'

import { Button, Dialog, DialogContent, Typography, Stack } from '@mui/material'
import FormContainer from '../../../../Form/FormContainer'
import TextFieldElement from '../../../../Form/TextFieldElement'
import MealContent from './MealContent'
import { StyledDialogActions, StyledDialogHeader } from './styles'
// import { addDoc, Timestamp, WithFieldValue } from 'firebase/firestore'

import type { MealPlan } from '../../../../../types/meals'
import type { IProps } from './types'

const AddMealPlanDialog = ({ open, onClose }: IProps) => {
  // const trainer = useAppSelector(selectTrainer)
  const [isAdding, setIsAdding] = useState<boolean>(false)

  const formContext = useForm<MealPlan>({
    defaultValues: {
      name: '',
      description: '',
      meals: [{ name: 'Comida 1' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: formContext.control,
    name: 'meals', // unique name for your Field Array
  })

  const onSubmit: SubmitHandler<MealPlan> = async (data) => {
    console.log(data)
  }

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
            {fields.map((meal, idx) => (
              <MealContent key={meal.id} idx={idx} onDeleteMeal={() => deleteMeal(idx)} {...meal} />
            ))}
            <AddMealButton onClick={addMeal} />
          </Stack>
        </DialogContent>
        <StyledDialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type='submit' variant='contained' disabled={isAdding}>
            {isAdding ? 'Creando' : 'Crear'}
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

export default AddMealPlanDialog

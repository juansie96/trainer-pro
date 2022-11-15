import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Box,
} from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import FormContainer from '../../../../Form/FormContainer'
import { Food, NutritionalValueKeys } from '../../../../../types/meals'
import TextFieldElement from '../../../../Form/TextFieldElement'
import { updateDoc } from 'firebase/firestore'
import { getDocumentRef } from '../../../../../firebase/fbRefs'
import type { IProps } from './types'

const EditFoodDialog = ({ onClose, food }: IProps) => {
  const formContext = useForm<Food>({
    defaultValues: food,
  })
  const [isAdding, setIsAdding] = useState<boolean>(false)

  const onSubmit: SubmitHandler<Food> = async (data) => {
    setIsAdding(true)
    try {
      const nutritionalValues: any = {}

      Object.keys(data.nutritionalValues).forEach((nvKey) => {
        const nvv = data.nutritionalValues[nvKey as NutritionalValueKeys].value
        nutritionalValues[nvKey] = {
          value: parseFloat(nvv as any),
          ratio: nvv / 100,
        }
      })

      const foodRef = getDocumentRef('foods', food.id as string)
      await updateDoc(foodRef, { ...data, nutritionalValues })
      setIsAdding(false)
      onClose()
      Swal.fire('¡Éxito!', 'El ejercicio se editó correctamente!', 'success')
    } catch (error) {
      console.error(error)
      setIsAdding(false)
      onClose()
      Swal.fire({
        icon: 'error',
        title: 'Error al editar',
        text: 'Hubo un error al intentar editar el Alimento, por favor intente nuevamente o comuniquese con un administrador.',
      })
    }
  }

  return (
    <div>
      <Dialog open onClose={onClose} maxWidth='sm' fullWidth>
        <FormContainer
          formContext={formContext}
          handleSubmit={formContext.handleSubmit(onSubmit)}
          FormProps={{
            style: { height: '100%', display: 'flex', flexDirection: 'column' },
          }}
        >
          <Box borderBottom='1px solid #e3e3e3'>
            <DialogTitle>Editar alimento</DialogTitle>
          </Box>
          <DialogContent sx={{ pt: 3, pb: 4 }}>
            <DialogContentText>Completa los datos del alimento</DialogContentText>
            <Stack mt={1} spacing={2}>
              <TextFieldElement name='name' type='text' label='Nombre' required />
              <DialogContentText fontWeight={700}>Valor Nutricional/100 g</DialogContentText>
              <Stack direction='row' spacing={2}>
                <TextFieldElement
                  name='nutritionalValues.kcal.value'
                  type='number'
                  label='Calorías'
                  required
                  fullWidth
                />
                <TextFieldElement
                  name='nutritionalValues.proteins.value'
                  type='number'
                  label='Proteinas'
                  required
                  fullWidth
                />
              </Stack>
              <Stack direction='row' spacing={2}>
                <TextFieldElement
                  name='nutritionalValues.carbs.value'
                  type='number'
                  label='Carbohidratos'
                  required
                />
                <TextFieldElement
                  name='nutritionalValues.fats.value'
                  type='number'
                  label='Grasas'
                  required
                />
                <TextFieldElement
                  name='nutritionalValues.fiber.value'
                  type='number'
                  label='Fibra'
                  required
                />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e3e3e3' }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type='submit' variant='contained' disabled={isAdding}>
              {isAdding ? 'Editando Ejercicio' : 'Editar Ejercicio'}
            </Button>
          </DialogActions>
        </FormContainer>
      </Dialog>
    </div>
  )
}

export default EditFoodDialog

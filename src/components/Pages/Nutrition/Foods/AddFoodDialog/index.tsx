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
import { addDoc } from 'firebase/firestore'
import Swal from 'sweetalert2'
import FormContainer from '../../../../Form/FormContainer'
import { Food, NutritionalValueKeys } from '../../../../../types/meals'
import { IProps } from './types'
import TextFieldElement from '../../../../Form/TextFieldElement'
import { foodsRef } from '../../../../../firebase/fbRefs'
import { useAppSelector } from '../../../../../state/storeHooks'
import { selectTrainer } from '../../../../../redux/slices/trainerSlice'

const AddMealDialog = ({ open, onClose }: IProps) => {
  const trainer = useAppSelector(selectTrainer)

  const formContext = useForm<Food>({
    defaultValues: {
      name: '',
      nutritionalValues: {
        kcal: { value: undefined, ratio: NaN },
        proteins: { value: undefined, ratio: NaN },
        carbs: { value: undefined, ratio: NaN },
        fats: { value: undefined, ratio: NaN },
        fiber: { value: undefined, ratio: NaN },
      },
    },
  })

  const [isAdding, setIsAdding] = useState<boolean>(false)

  const onSubmit: SubmitHandler<Food> = async (data) => {
    setIsAdding(true)
    try {
      if (!trainer?.id) {
        throw new Error('No se pudo encontrar la información del entrenador')
      }

      const nutritionalValues: any = {}

      Object.keys(data.nutritionalValues).forEach((nvKey) => {
        const nvv = data.nutritionalValues[nvKey as NutritionalValueKeys].value
        nutritionalValues[nvKey] = {
          value: parseFloat(nvv as any),
          ratio: nvv / 100,
        }
      })
      await addDoc(foodsRef, { ...data, nutritionalValues, creatorId: trainer.id })
      setIsAdding(false)
      onClose()
      Swal.fire('¡Éxito!', 'El alimento se creó correctamente!', 'success')
    } catch (error) {
      console.error(error)
      setIsAdding(false)
      onClose()
      Swal.fire({
        icon: 'error',
        title: 'Error al crear',
        text: 'Hubo un error al intentar crear el Alimento, por favor intente nuevamente o comuniquese con un administrador.',
      })
    }
  }

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
        <FormContainer
          formContext={formContext}
          handleSubmit={formContext.handleSubmit(onSubmit)}
          FormProps={{
            style: { height: '100%', display: 'flex', flexDirection: 'column' },
          }}
        >
          <Box borderBottom='1px solid #e3e3e3'>
            <DialogTitle>Crear alimento</DialogTitle>
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
                  label='Calorías (kcal)'
                  required
                  fullWidth
                />
                <TextFieldElement
                  name='nutritionalValues.proteins.value'
                  type='number'
                  label='Proteinas (g)'
                  required
                  fullWidth
                />
              </Stack>
              <Stack direction='row' spacing={2}>
                <TextFieldElement
                  name='nutritionalValues.carbs.value'
                  type='number'
                  label='Carbohidratos (g)'
                  required
                />
                <TextFieldElement
                  name='nutritionalValues.fats.value'
                  type='number'
                  label='Grasas (g)'
                  required
                />
                <TextFieldElement
                  name='nutritionalValues.fiber.value'
                  type='number'
                  label='Fibra (g)'
                  required
                />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e3e3e3' }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type='submit' variant='contained' disabled={isAdding}>
              {isAdding ? 'Creando Alimento' : 'Crear alimento'}
            </Button>
          </DialogActions>
        </FormContainer>
      </Dialog>
    </div>
  )
}

export default AddMealDialog

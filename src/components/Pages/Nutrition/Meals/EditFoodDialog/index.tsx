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
import { Food } from '../../../../../types/meals'
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
      const foodRef = getDocumentRef('foods', food.id as string)
      await updateDoc(foodRef, data)
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
              <TextFieldElement name='name' type='text' size='small' label='Nombre' required />
              <DialogContentText fontWeight={700}>Valor Nutricional/100 g</DialogContentText>
              <Stack direction='row' spacing={2}>
                <TextFieldElement
                  name='nutritionalValues.kcal'
                  type='number'
                  size='small'
                  label='Calorías'
                  customOnChange={({ target: { value } }) =>
                    formContext.setValue('nutritionalValues.kcal', parseInt(value, 10))
                  }
                  required
                  fullWidth
                  validation={{
                    validate: (value) => Number.isInteger(value),
                  }}
                />
                <TextFieldElement
                  name='nutritionalValues.proteins'
                  type='number'
                  size='small'
                  label='Proteinas'
                  customOnChange={({ target: { value } }) =>
                    formContext.setValue('nutritionalValues.proteins', parseInt(value, 10))
                  }
                  required
                  fullWidth
                  validation={{
                    validate: (value) => Number.isInteger(value),
                  }}
                />
              </Stack>
              <Stack direction='row' spacing={2}>
                <TextFieldElement
                  name='nutritionalValues.carbs'
                  type='number'
                  size='small'
                  label='Carbohidratos'
                  customOnChange={({ target: { value } }) =>
                    formContext.setValue('nutritionalValues.carbs', parseInt(value, 10))
                  }
                  required
                  validation={{
                    validate: (value) => Number.isInteger(value),
                  }}
                />
                <TextFieldElement
                  name='nutritionalValues.fats'
                  type='number'
                  size='small'
                  label='Grasas'
                  customOnChange={({ target: { value } }) =>
                    formContext.setValue('nutritionalValues.fats', parseInt(value, 10))
                  }
                  required
                  validation={{
                    validate: (value) => Number.isInteger(value),
                  }}
                />
                <TextFieldElement
                  name='nutritionalValues.fiber'
                  type='number'
                  size='small'
                  label='Fibra'
                  customOnChange={({ target: { value } }) =>
                    formContext.setValue('nutritionalValues.fiber', parseInt(value, 10))
                  }
                  required
                  validation={{
                    validate: (value) => Number.isInteger(value),
                  }}
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

import { useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useForm } from 'react-hook-form'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from '@mui/material'
import FormContainer from '../../Form/FormContainer'

// import type { MealPlan } from '../../../../../types/meals'
// import type { IProps } from './types'

// import TextFieldElement from '../../../../Form/TextFieldElement'
// import { addDoc, Timestamp, WithFieldValue } from 'firebase/firestore'

const AddDialogExample = ({ open, onClose }: any) => {
  // const trainer = useAppSelector(selectTrainer)
  // const [meals, mealsLoading] = useCollectionData(getMealsByTrainerIdRef(trainer.id as string))
  const formContext = useForm<any>()
  // const { fields, append, remove } = useFieldArray({
  //   control: formContext.control,
  //   name: 'workoutExercises', // unique name for your Field Array
  // })
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const onSubmit = async (meal: any) => {
    // setIsAdding(true)
    // try {
    //   await addDoc(workoutsRef, {
    //     ...newWorkout,
    //     createdAt: Timestamp.fromDate(new Date()),
    //   } as WithFieldValue<Workout>)
    //   setIsAdding(false)
    //   onClose()
    // } catch (err: unknown) {
    //   setIsAdding(false)
    // }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      // PaperProps={{ sx: { maxWidth: 0.95, width: 0.95, height: 0.95 } }}
    >
      <FormContainer formContext={formContext} handleSubmit={formContext.handleSubmit(onSubmit)}>
        <Box borderBottom='1px solid #e3e3e3'>
          <DialogTitle>Nuevo plan nutricional</DialogTitle>
        </Box>
        <DialogContent sx={{ pt: 3, pb: 4 }}>
          {/* <DialogContentText>Completa los datos de tu nuevo plan nutricional</DialogContentText> */}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e3e3e3' }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type='submit' variant='contained' disabled={isAdding}>
            {isAdding ? 'Creando' : 'Crear'}
          </Button>
        </DialogActions>
      </FormContainer>
    </Dialog>
  )
}

export default AddDialogExample

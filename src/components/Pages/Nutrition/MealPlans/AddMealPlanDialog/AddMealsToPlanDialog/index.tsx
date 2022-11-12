import { useState } from 'react'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
// import { useAppSelector } from '../../../../../state/storeHooks'
// import { selectTrainer } from '../../../../../redux/slices/trainerSlice'

import { Button, Dialog, DialogContent } from '@mui/material'

import type { IProps } from './types'
import { StyledDialogActions, StyledDialogHeader } from '../../../../../UI/Dialogs/styles'
import FoodsTable from '../../../Meals/FoodsTable'
import { useAppSelector } from '../../../../../../state/storeHooks'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getFoodsByTrainerIdRef } from '../../../../../../firebase/fbRefs'
import { selectTrainer } from '../../../../../../redux/slices/trainerSlice'
import { Foods, Meals } from '../../../../../../types/meals'

const AddMealsToPlanDialog = ({ open, onClose }: IProps) => {
  const trainer = useAppSelector(selectTrainer)
  const [foods, loading] = useCollectionData(getFoodsByTrainerIdRef(trainer.id as string))
  const [isAdding, setIsAdding] = useState<boolean>(false)

  return (
    <Dialog open={open} onClose={onClose} maxWidth='lg' fullWidth>
      <StyledDialogHeader title='Nuevo plan nutricional' />
      <DialogContent sx={{ py: 3 }}>{foods && <FoodsTable foods={foods as Foods} />}</DialogContent>
      <StyledDialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type='submit' variant='contained' disabled={isAdding}>
          {isAdding ? 'Creando' : 'Crear'}
        </Button>
      </StyledDialogActions>
    </Dialog>
  )
}

export default AddMealsToPlanDialog

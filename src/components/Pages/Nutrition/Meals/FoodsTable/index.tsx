import { useState } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteDoc, DocumentReference } from 'firebase/firestore'
import { Food } from '../../../../../types/meals'
import { selectTrainer } from '../../../../../redux/slices/trainerSlice'
import { useAppSelector } from '../../../../../state/storeHooks'
import EditFoodDialog from '../EditFoodDialog'
import ConfirmDialog from '../../../../ConfirmDialog'
import type { IProps, FoodDialogState } from './types'
import { getDocumentRef } from '../../../../../firebase/fbRefs'

const FoodsTable = ({ foods }: IProps) => {
  const trainer = useAppSelector(selectTrainer)
  const trainerName = trainer.name?.split(' ')[0]
  const [editFoodDialog, setEditFoodDialog] = useState<FoodDialogState>({
    open: false,
    foodId: '',
  })

  const [confirmDialog, setConfirmDialog] = useState<FoodDialogState>({
    open: false,
    foodId: '',
  })

  const openEditFoodDialog = (foodId: string) => {
    setEditFoodDialog({ open: true, foodId: foodId })
  }

  const closeEditFoodDialog = () => {
    setEditFoodDialog({ open: false, foodId: '' })
  }

  const handleDeleteFood = () => {
    const food = foods.find((w) => w.id === confirmDialog.foodId) as Food
    const foodRef = getDocumentRef('foods', food.id as string)
    deleteDoc(foodRef as DocumentReference<Food>)
    setConfirmDialog({ open: false, foodId: '' })
  }

  const handleIconClick = (action: string, food: Food) => {
    if (food.creatorId === '') return

    if (action === 'edit') {
      console.log(food.id)
      openEditFoodDialog(food.id as string)
    }

    if (action === 'delete') {
      setConfirmDialog({ open: true, foodId: food.id as string })
    }
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ width: 0.9, mx: 'auto', my: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label='foods table'>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 0.3 }}>Nombre</TableCell>
              <TableCell sx={{ width: 0.1 }}>Calorías</TableCell>
              <TableCell sx={{ width: 0.1 }}>Proteínas</TableCell>
              <TableCell sx={{ width: 0.09 }}>Carbs</TableCell>
              <TableCell sx={{ width: 0.09 }}>Grasas</TableCell>
              <TableCell sx={{ width: 0.09 }}>Fibra</TableCell>
              <TableCell sx={{ width: 0.1 }}>Creado por</TableCell>
              <TableCell sx={{ width: 0.13 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foods.map((food) => (
              <TableRow
                key={food.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component='th' scope='row'>
                  {food.name}
                </TableCell>
                <TableCell component='th' scope='row'>
                  {food.nutritionalValues.kcal} kcal
                </TableCell>
                <TableCell component='th' scope='row'>
                  {food.nutritionalValues.proteins} g
                </TableCell>
                <TableCell component='th' scope='row'>
                  {food.nutritionalValues.carbs} g
                </TableCell>
                <TableCell component='th' scope='row'>
                  {food.nutritionalValues.fats} g
                </TableCell>
                <TableCell component='th' scope='row'>
                  {food.nutritionalValues.fiber} g
                </TableCell>
                <TableCell component='th' scope='row'>
                  {food.creatorId === trainer.id ? trainerName : 'TrainerPro'}
                </TableCell>
                <TableCell sx={{ display: 'flex', justifyContent: 'right' }}>
                  <EditIcon
                    fontSize='small'
                    sx={{ ml: 0.7, cursor: food.creatorId === '' ? 'default' : 'pointer' }}
                    color={food.creatorId === '' ? 'disabled' : 'primary'}
                    onClick={() => handleIconClick('edit', food)}
                  />
                  <DeleteIcon
                    color={food.creatorId === '' ? 'disabled' : 'error'}
                    fontSize='small'
                    sx={{
                      ml: 0.7,
                      color: '',
                      cursor: food.creatorId === '' ? 'default' : 'pointer',
                    }}
                    onClick={() => handleIconClick('delete', food)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {editFoodDialog.open && (
        <EditFoodDialog
          food={foods.find((w) => w.id === editFoodDialog.foodId) as Food}
          onClose={closeEditFoodDialog}
        />
      )}
      {confirmDialog.open && (
        <ConfirmDialog
          onClose={() => setConfirmDialog({ open: false, foodId: '' })}
          onConfirm={handleDeleteFood}
        />
      )}
    </>
  )
}

export default FoodsTable

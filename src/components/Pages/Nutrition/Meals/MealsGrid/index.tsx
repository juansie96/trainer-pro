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
import { Meal } from '../../../../../types/meals'
import { selectTrainer } from '../../../../../redux/slices/trainerSlice'
import { useAppSelector } from '../../../../../state/storeHooks'
import EditMealDialog from '../EditMealDialog'
import ConfirmDialog from '../../../../ConfirmDialog'
import type { IProps, MealDialogState } from './types'
import { getDocumentRef } from '../../../../../firebase/fbRefs'

const MealsGrid = ({ meals }: IProps) => {
  const trainer = useAppSelector(selectTrainer)
  const trainerName = trainer.name?.split(' ')[0]
  const [editMealDialog, setEditMealDialog] = useState<MealDialogState>({
    open: false,
    mealId: '',
  })

  const [confirmDialog, setConfirmDialog] = useState<MealDialogState>({
    open: false,
    mealId: '',
  })

  const openEditMealDialog = (mealId: string) => {
    setEditMealDialog({ open: true, mealId: mealId })
  }

  const closeEditMealDialog = () => {
    setEditMealDialog({ open: false, mealId: '' })
  }

  const handleDeleteMeal = () => {
    const meal = meals.find((w) => w.id === confirmDialog.mealId) as Meal
    const mealRef = getDocumentRef('meals', meal.id as string)
    deleteDoc(mealRef as DocumentReference<Meal>)
    setConfirmDialog({ open: false, mealId: '' })
  }

  const handleIconClick = (action: string, meal: Meal) => {
    if (meal.creatorId === '') return

    if (action === 'edit') {
      console.log(meal.id)
      openEditMealDialog(meal.id as string)
    }

    if (action === 'delete') {
      setConfirmDialog({ open: true, mealId: meal.id as string })
    }
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ width: 0.9, mx: 'auto', my: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label='meals table'>
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
            {meals.map((meal) => (
              <TableRow
                key={meal.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component='th' scope='row'>
                  {meal.name}
                </TableCell>
                <TableCell component='th' scope='row'>
                  {meal.nutritionalValues.kcal} kcal
                </TableCell>
                <TableCell component='th' scope='row'>
                  {meal.nutritionalValues.proteins} g
                </TableCell>
                <TableCell component='th' scope='row'>
                  {meal.nutritionalValues.carbs} g
                </TableCell>
                <TableCell component='th' scope='row'>
                  {meal.nutritionalValues.fats} g
                </TableCell>
                <TableCell component='th' scope='row'>
                  {meal.nutritionalValues.fiber} g
                </TableCell>
                <TableCell component='th' scope='row'>
                  {meal.creatorId === trainer.id ? trainerName : 'TrainerPro'}
                </TableCell>
                <TableCell sx={{ display: 'flex', justifyContent: 'right' }}>
                  <EditIcon
                    fontSize='small'
                    sx={{ ml: 0.7, cursor: meal.creatorId === '' ? 'default' : 'pointer' }}
                    color={meal.creatorId === '' ? 'disabled' : 'primary'}
                    onClick={() => handleIconClick('edit', meal)}
                  />
                  <DeleteIcon
                    color={meal.creatorId === '' ? 'disabled' : 'error'}
                    fontSize='small'
                    sx={{
                      ml: 0.7,
                      color: '',
                      cursor: meal.creatorId === '' ? 'default' : 'pointer',
                    }}
                    onClick={() => handleIconClick('delete', meal)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {editMealDialog.open && (
        <EditMealDialog
          meal={meals.find((w) => w.id === editMealDialog.mealId) as Meal}
          onClose={closeEditMealDialog}
        />
      )}
      {confirmDialog.open && (
        <ConfirmDialog
          onClose={() => setConfirmDialog({ open: false, mealId: '' })}
          onConfirm={handleDeleteMeal}
        />
      )}
    </>
  )
}

export default MealsGrid

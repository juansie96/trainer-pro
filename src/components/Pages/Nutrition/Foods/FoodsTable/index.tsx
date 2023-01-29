import { useState } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteDoc, DocumentReference } from 'firebase/firestore'
import { Food } from '../../../../../types/meals'
import { selectTrainer } from '../../../../../redux/slices/Trainer.slice'
import { useAppSelector } from '../../../../../state/storeHooks'
import EditFoodDialog from '../EditFoodDialog'
import ConfirmDialog from '../../../../UI/Dialogs/ConfirmDialog'
import { getDocumentRef } from '../../../../../firebase/fbRefs'
import type { IProps, FoodDialogState } from './types'

const FoodsTable = ({ foods }: IProps) => {
  const trainer = useAppSelector(selectTrainer)
  const trainerName = trainer.name?.split(' ')[0]
  const [page, setPage] = useState(0)

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
      openEditFoodDialog(food.id as string)
    }

    if (action === 'delete') {
      setConfirmDialog({ open: true, foodId: food.id as string })
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='foods table'>
          <TableHead sx={{ bgcolor: '#1677d2' }}>
            <TableRow>
              <TableCell sx={{ width: '25em', color: 'white', fontWeight: 700 }}>Nombre</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Calorías</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Proteínas</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Carbs</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Grasas</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Fibra</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Creado por</TableCell>
              <TableCell sx={{ width: '4em', color: 'white', fontWeight: 700 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foods.slice(page * 10, page * 10 + 10).map((food) => (
              <TableRow
                key={food.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell scope='row'>{food.name}</TableCell>
                <TableCell scope='row'>{food.nutritionalValues.kcal.value} kcal</TableCell>
                <TableCell scope='row'>{food.nutritionalValues.proteins.value} g</TableCell>
                <TableCell scope='row'>{food.nutritionalValues.carbs.value} g</TableCell>
                <TableCell scope='row'>{food.nutritionalValues.fats.value} g</TableCell>
                <TableCell scope='row'>{food.nutritionalValues.fiber.value} g</TableCell>
                <TableCell scope='row'>
                  {food.creatorId === trainer.id ? trainerName : 'TrainerPro'}
                </TableCell>
                <TableCell scope='row'>
                  <>
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
                  </>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component='div'
        count={foods.length}
        rowsPerPage={10}
        page={page}
        onPageChange={(_, n) => setPage(n)}
        labelRowsPerPage={'Filas por página'}
        // onRowsPerPageChange={handleChangeRowsPerPage}
      />
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

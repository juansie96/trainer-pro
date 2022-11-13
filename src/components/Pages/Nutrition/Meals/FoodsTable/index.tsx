import { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fade,
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
import { CgAddR, CgCheckO } from 'react-icons/cg'

const FoodsTable = ({ foods, onAddToPlan }: IProps) => {
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

  const [addedIds, setAddedIds] = useState<string[]>([])
  const [showSuccessIcon, setShowSuccessIcon] = useState({ value: false, id: '' })

  useEffect(() => {
    if (addedIds.length > 0) {
      setTimeout(() => {
        setAddedIds((prevState) => prevState.slice(1))
      }, 3000)
    }
  }, [addedIds])

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
      <TableContainer component={Paper} sx={{ width: 1, mx: 'auto', my: 3 }}>
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
                <TableCell scope='row'>{food.name}</TableCell>
                <TableCell scope='row'>{food.nutritionalValues.kcal} kcal</TableCell>
                <TableCell scope='row'>{food.nutritionalValues.proteins} g</TableCell>
                <TableCell scope='row'>{food.nutritionalValues.carbs} g</TableCell>
                <TableCell scope='row'>{food.nutritionalValues.fats} g</TableCell>
                <TableCell scope='row'>{food.nutritionalValues.fiber} g</TableCell>
                <TableCell scope='row'>
                  {food.creatorId === trainer.id ? trainerName : 'TrainerPro'}
                </TableCell>
                <TableCell scope='row'>
                  {onAddToPlan ? (
                    <Stack direction='row' justifyContent='center' alignItems='center'>
                      {addedIds.includes(food.id as string) ? (
                        <Fade in={true} timeout={1600}>
                          <Stack direction='row'>
                            <CgCheckO size={24} cursor='pointer' color='green' />
                          </Stack>
                        </Fade>
                      ) : (
                        <Stack direction='row'>
                          <CgAddR
                            size={24}
                            cursor='pointer'
                            color='#1976d2'
                            onClick={() => setAddedIds([...addedIds, food.id as string])}
                          />
                        </Stack>
                      )}
                      {/* <CgAddR
                        size={24}
                        cursor='pointer'
                        color='#1976d2'
                        style={{
                          transition: 'opacity 1s ease-out',
                          opacity: 0,
                          height: 0,
                          overflow: 'hidden',
                        }}
                      />
                      <CgCheckO size={24} cursor='pointer' color='green' /> */}
                    </Stack>
                  ) : (
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
                  )}
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

import { useContext, useEffect, useState } from 'react'
import {
  Fade,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import type { IProps } from './types'
import { useAppSelector } from '../../../../../../../state/storeHooks'
import { selectTrainer } from '../../../../../../../redux/slices/trainerSlice'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Food, MealPlan } from '../../../../../../../types/meals'
import { CgAddR, CgCheckO } from 'react-icons/cg'
import { useFieldArrayFormContext } from '../../../../../../../contexts/FieldArrayFormProvider'

const FoodsTable = ({ foods, mealIdx }: IProps) => {
  const trainer = useAppSelector(selectTrainer)
  const trainerName = trainer.name?.split(' ')[0]
  const [addedIds, setAddedIds] = useState<string[]>([])
  const { append } = useFieldArrayFormContext<MealPlan>()

  useEffect(() => {
    let timeout: number
    if (addedIds.length > 0) {
      timeout = window.setTimeout(() => {
        setAddedIds((prevState) => prevState.slice(1))
      }, 3000)
    }

    return () => (timeout ? window.clearTimeout(timeout) : undefined)
  }, [addedIds])

  const addFood = (food: Food) => {
    console.log('addFood')
    append(food)
  }

  const handleAddFoodClick = (food: Food) => {
    setAddedIds([...addedIds, food.id as string])
    addFood({ ...food, grams: 100 })
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
                          onClick={() => handleAddFoodClick(food)}
                        />
                      </Stack>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default FoodsTable
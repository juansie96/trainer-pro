import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Box,
  Typography,
  Tooltip,
} from '@mui/material'
import { IProps } from './types'
import { StyledDialogActions } from '../../../../UI/Dialogs/styles'
import { MouseEvent, ReactNode, useEffect, useState } from 'react'
import {
  FoodsTableContainer,
  JMTableRow,
  JMTableRowFooter,
  MacrosSectionContainer,
  Point,
  Separator,
} from './styles'
import { getTotalNV } from '../AddMealPlanDialog/utils'
import { Food, Meal, MealPlan, NutritionalValueKeys } from '../../../../../types/meals'
import { macroItems, tableHeaderCols } from './data'
import { JMTableCell } from '../AddMealPlanDialog/MealContent/styles'
import { getDocumentRef } from '../../../../../firebase/fbRefs'
import { getDoc, updateDoc } from 'firebase/firestore'
import { useAppDispatch, useAppSelector } from '../../../../../state/storeHooks'
import { selectClient, tasksChanged } from '../../../../../redux/slices/Client.slice'
import Swal from 'sweetalert2'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import AddMealPlanDialog from '../AddMealPlanDialog'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import type { Client } from '../../../../../types/client'

const PreviewMealPlanDialog = ({ onClose, data, eventData }: IProps) => {
  const client = useAppSelector(selectClient) as Client
  const dispatch = useAppDispatch()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [mealPlan, setMealPlan] = useState<MealPlan | undefined>(data)

  useEffect(() => {
    if (eventData) {
      getDoc(getDocumentRef('mealPlans', eventData.entityId)).then((res) => {
        setMealPlan(res.data())
      })
    }
  }, [])

  const openEditDialog = () => setEditDialogOpen(true)
  const closeEditDialog = () => setEditDialogOpen(false)

  const handleClose = (e: MouseEvent) => {
    e.stopPropagation()
    onClose()
  }

  if (!mealPlan) return null

  const handleDeleteEvent = async () => {
    const docRef = getDocumentRef('clients', client.id as string)
    // const newTasks = (client as Client).tasks.filter(
    //   (t) => !(t.type === 'mealPlan' && t.entityId === (mealPlan as MealPlan).id),
    const newTasks = client.tasks.filter((t) => !(t.id === eventData.id))
    try {
      await updateDoc<Client>(docRef, { tasks: newTasks })
      dispatch(tasksChanged(newTasks))
      Swal.fire('¡Éxito!', 'La tarea se eliminó correctamente', 'success')
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  const handleMealPlanEdit = (newMealPlan: MealPlan) => {
    setMealPlan({ ...mealPlan, ...newMealPlan })
  }

  const MacroItem = ({
    title,
    nvKey,
    withPoint,
    pointColor,
  }: {
    title: string
    nvKey: string
    withPoint?: boolean
    pointColor?: string
  }) => (
    <Stack spacing={0.5}>
      <Stack direction={'row'} spacing={1} alignItems='center'>
        {withPoint && <Point size={12} color={pointColor as string} />}
        <Typography>{title}</Typography>
      </Stack>
      <Typography textAlign='center'>
        {getTotalNV(nvKey as NutritionalValueKeys, mealPlan.meals)}{' '}
        {nvKey === 'kcal' ? 'kcal' : 'g'}
      </Typography>
    </Stack>
  )

  return (
    <div>
      <Dialog open onClose={handleClose} maxWidth='md' fullWidth>
        <Box
          borderBottom='1px solid #e3e3e3'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          pr={3}
        >
          <DialogTitle>{mealPlan.name}</DialogTitle>
          <Tooltip title='cerrar ventana'>
            <CloseIcon fontSize='medium' cursor='pointer' onClick={handleClose} />
          </Tooltip>
        </Box>
        <DialogContent sx={{ pt: 3, pb: 4 }}>
          <Stack spacing={4}>
            {mealPlan.description && (
              <Section title='Descripción del plan'>
                <Typography>{mealPlan.description}</Typography>
              </Section>
            )}
            <Section title='Calorías y Macros'>
              <MacrosSectionContainer>
                {macroItems.map((i) => (
                  <MacroItem key={i.nvKey} {...i} />
                ))}
              </MacrosSectionContainer>
            </Section>
            <Section title='Planificación de comidas'>
              <Stack spacing={2}>
                {mealPlan.meals.map((m, i) => (
                  <MealSection meal={m} key={m.name + i} />
                ))}
              </Stack>
            </Section>
          </Stack>
        </DialogContent>
        <StyledDialogActions justifyContent='space-between'>
          <Stack direction='row' spacing={2}>
            <Tooltip title='editar rutina' onClick={openEditDialog}>
              <EditIcon color='primary' fontSize='large' sx={{ cursor: 'pointer' }} />
            </Tooltip>
          </Stack>
          <Box display='flex' alignItems='center'>
            {data ? (
              <Button onClick={handleClose} variant='contained'>
                Aceptar
              </Button>
            ) : (
              <>
                <Button
                  variant='contained'
                  color='error'
                  sx={{ height: 38 }}
                  onClick={handleDeleteEvent}
                >
                  <DeleteForeverIcon
                    fontSize='large'
                    sx={{ cursor: 'pointer', color: 'white', mr: 1 }}
                  />
                  Borrar tarea
                </Button>
              </>
            )}
          </Box>
        </StyledDialogActions>
        {editDialogOpen && (
          <AddMealPlanDialog
            open
            onClose={closeEditDialog}
            mealPlan={mealPlan}
            onSubmit={handleMealPlanEdit}
          />
        )}
      </Dialog>
    </div>
  )
}

export const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <Stack spacing={1.5}>
    <Typography fontWeight={600} fontSize={17}>
      {title}
    </Typography>
    <Separator />
    {children}
  </Stack>
)

const MealSection = ({ meal }: { meal: Meal }) => (
  <Stack spacing={2}>
    <Typography fontSize={17}>{meal.name}</Typography>
    <FoodsTableContainer>
      <JMTableRow>
        {tableHeaderCols.map((col) => (
          <Typography
            key={col.name}
            fontWeight={700}
            textAlign={col.textAlign as 'center' | 'left'}
          >
            {col.name}
          </Typography>
        ))}
      </JMTableRow>

      {meal.foods.map((f) => {
        const food = f as Food
        return (
          <JMTableRow key={food.name}>
            <JMTableCell>
              <Typography sx={{ pl: 0.7 }}>{food.grams} g</Typography>
            </JMTableCell>
            <JMTableCell>
              <Typography sx={{ pl: 0.7 }}>{food.name}</Typography>
            </JMTableCell>
            <JMTableCell>
              <Typography sx={{ pl: 0.7 }}>{food.nutritionalValues.kcal.value} kcal</Typography>
            </JMTableCell>
            <JMTableCell>
              <Typography sx={{ pl: 0.7 }} textAlign='center'>
                {food.nutritionalValues.proteins.value} g
              </Typography>
            </JMTableCell>
            <JMTableCell>
              <Typography sx={{ pl: 0.7 }} textAlign='center'>
                {food.nutritionalValues.carbs.value} g
              </Typography>
            </JMTableCell>
            <JMTableCell>
              <Typography sx={{ pl: 0.7 }} textAlign='center'>
                {food.nutritionalValues.fats.value} g
              </Typography>
            </JMTableCell>
            <JMTableCell>
              <Typography sx={{ pl: 0.7 }} textAlign='center'>
                {food.nutritionalValues.fiber.value} g
              </Typography>
            </JMTableCell>
          </JMTableRow>
        )
      })}
      <Separator />
      <JMTableRowFooter>
        <Typography fontWeight={700} sx={{ justifySelf: 'start' }} p={1.5}>
          Total comida:
        </Typography>

        <JMTableCell>
          <Typography sx={{ pl: 0.7 }}>
            {meal.foods
              .reduce((t, c) => t + (c as Food).nutritionalValues.kcal.value, 0)
              .toFixed(2)}{' '}
            kcal
          </Typography>
        </JMTableCell>
        <JMTableCell>
          <Typography sx={{ pl: 0.7 }} textAlign='center'>
            {meal.foods
              .reduce((t, c) => t + (c as Food).nutritionalValues.proteins.value, 0)
              .toFixed(2)}{' '}
            g
          </Typography>
        </JMTableCell>
        <JMTableCell>
          <Typography sx={{ pl: 0.7 }} textAlign='center'>
            {meal.foods
              .reduce((t, c) => t + (c as Food).nutritionalValues.carbs.value, 0)
              .toFixed(2)}{' '}
            g
          </Typography>
        </JMTableCell>
        <JMTableCell>
          <Typography sx={{ pl: 0.7 }} textAlign='center'>
            {meal.foods
              .reduce((t, c) => t + (c as Food).nutritionalValues.fats.value, 0)
              .toFixed(2)}{' '}
            g
          </Typography>
        </JMTableCell>
        <JMTableCell>
          <Typography sx={{ pl: 0.7 }} textAlign='center'>
            {meal.foods
              .reduce((t, c) => t + (c as Food).nutritionalValues.fiber.value, 0)
              .toFixed(2)}{' '}
            g
          </Typography>
        </JMTableCell>
      </JMTableRowFooter>
    </FoodsTableContainer>
  </Stack>
)

export default PreviewMealPlanDialog

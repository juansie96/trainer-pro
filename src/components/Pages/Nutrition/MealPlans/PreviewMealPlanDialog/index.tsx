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
import { ReactNode, useEffect, useState } from 'react'
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
import { AiOutlineClose } from 'react-icons/ai'
import { JMTableCell } from '../AddMealPlanDialog/MealContent/styles'
import { getDocumentRef } from '../../../../../firebase/fbRefs'
import { getDoc } from 'firebase/firestore'

const PreviewMealPlanDialog = ({ onClose, data, mealPlanId }: IProps) => {
  const [mealPlan, setMealPlan] = useState<MealPlan | undefined>(data)
  useEffect(() => {
    if (!data && mealPlanId) {
      getDoc(getDocumentRef('mealPlans', mealPlanId as string)).then((res) => {
        setMealPlan(res.data())
      })
    }
  }, [])
  if (!mealPlan) return null

  const handleClose = (e: any) => {
    e.stopPropagation()
    onClose()
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
        >
          <DialogTitle>{mealPlan.name}</DialogTitle>
          <Box m='1em 1.5em'>
            <AiOutlineClose
              size={20}
              style={{ display: 'block', cursor: 'pointer' }}
              onClick={onClose}
            />
          </Box>
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
        <StyledDialogActions>
          <Button type='submit' variant='contained' onClick={handleClose}>
            Aceptar
          </Button>
        </StyledDialogActions>
      </Dialog>
    </div>
  )
}

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
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

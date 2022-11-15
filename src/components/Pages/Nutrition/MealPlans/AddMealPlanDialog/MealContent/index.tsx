import { DeleteForever } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { MdOutlineExpandLess, MdOutlineExpandMore } from 'react-icons/md'
import { FieldArrayFormProvider } from '../../../../../../contexts/FieldArrayFormProvider'
import { Food, MealPlan } from '../../../../../../types/meals'
import TextFieldElement from '../../../../../Form/TextFieldElement'
import AddFoodsToMeal from '../AddFoodsToMeal'
import { tableHeaderCols } from './data'
import {
  Container,
  DefaultContent,
  JMTableCell,
  JMTableRow,
  NoContentTableMessage,
  Separator,
} from './styles'
import { IProps } from './types'
import { getNewNutritionalValues } from './utils'

const MealContent = ({ onDeleteMeal, idx }: IProps) => {
  const [isContentExpanded, setisContentExpanded] = useState(false)
  const [addFoodDialogOpen, setAddFoodDialogOpen] = useState(false)

  const fc = useFormContext<MealPlan>()
  const fieldArrayMethods = useFieldArray({
    control: fc.control,
    name: `meals.${idx}.foods` as `meals.${number}.foods`,
  })
  const { fields, update, remove } = fieldArrayMethods

  const contractContent = () => setisContentExpanded(false)
  const expandContent = () => setisContentExpanded(true)

  const handleGramsChange = (value: string, food: Food, foodIdx: number) => {
    const modifiedFood: Food = {
      ...food,
      grams: value as any,
      nutritionalValues: getNewNutritionalValues(food.nutritionalValues, parseFloat(value)),
    }
    update(foodIdx, modifiedFood)
  }

  return (
    <FieldArrayFormProvider {...fc} {...fieldArrayMethods}>
      <Container>
        <DefaultContent>
          <DeleteForever
            color='error'
            fontSize='large'
            sx={{ cursor: 'pointer' }}
            onClick={() => onDeleteMeal()}
          />
          <TextFieldElement name={`meals.${idx}.name`} size='small' fullWidth required />
          {isContentExpanded ? (
            <MdOutlineExpandLess size={40} onClick={contractContent} />
          ) : (
            <MdOutlineExpandMore size={40} onClick={expandContent} />
          )}
        </DefaultContent>

        {isContentExpanded && (
          <>
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
            {fields.length === 0 ? (
              <NoContentTableMessage msg='Todavía no agregaste ninguna comida' />
            ) : (
              <>
                {fields.map((f, foodIdx) => {
                  const food = f as Food
                  return (
                    <JMTableRow key={food.id}>
                      <JMTableCell>
                        <TextFieldElement
                          name={`meals.${idx}.foods.${foodIdx}.grams`}
                          type='number'
                          size='small'
                          label='Gramos'
                          customOnChange={(e) => handleGramsChange(e.target.value, food, foodIdx)}
                          validation={{ required: { value: true, message: '' } }}
                          sx={{ width: 100 }}
                        />
                      </JMTableCell>
                      <JMTableCell>
                        <Typography sx={{ pl: 0.7 }}>{food.name}</Typography>
                      </JMTableCell>
                      <JMTableCell>
                        <Typography sx={{ pl: 0.7 }}>
                          {food.nutritionalValues.kcal.value} kcal
                        </Typography>
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
                      <DeleteForever
                        color='error'
                        fontSize='medium'
                        sx={{ cursor: 'pointer', ml: 2 }}
                        onClick={() => remove(foodIdx)}
                      />
                    </JMTableRow>
                  )
                })}
                <Separator />
                <JMTableRow>
                  <Typography fontWeight={700}>Total comida:</Typography>
                  <div></div>
                  <JMTableCell>
                    <Typography sx={{ pl: 0.7 }}>
                      {fields
                        .reduce((t, c) => t + (c as Food).nutritionalValues.kcal.value, 0)
                        .toFixed(2)}{' '}
                      kcal
                    </Typography>
                  </JMTableCell>
                  <JMTableCell>
                    <Typography sx={{ pl: 0.7 }} textAlign='center'>
                      {fields
                        .reduce((t, c) => t + (c as Food).nutritionalValues.proteins.value, 0)
                        .toFixed(2)}{' '}
                      g
                    </Typography>
                  </JMTableCell>
                  <JMTableCell>
                    <Typography sx={{ pl: 0.7 }} textAlign='center'>
                      {fields
                        .reduce((t, c) => t + (c as Food).nutritionalValues.carbs.value, 0)
                        .toFixed(2)}{' '}
                      g
                    </Typography>
                  </JMTableCell>
                  <JMTableCell>
                    <Typography sx={{ pl: 0.7 }} textAlign='center'>
                      {fields
                        .reduce((t, c) => t + (c as Food).nutritionalValues.fats.value, 0)
                        .toFixed(2)}{' '}
                      g
                    </Typography>
                  </JMTableCell>
                  <JMTableCell>
                    <Typography sx={{ pl: 0.7 }} textAlign='center'>
                      {fields
                        .reduce((t, c) => t + (c as Food).nutritionalValues.fiber.value, 0)
                        .toFixed(2)}{' '}
                      g
                    </Typography>
                  </JMTableCell>
                </JMTableRow>
              </>
            )}
            <Button
              onClick={() => setAddFoodDialogOpen(true)}
              variant='contained'
              sx={{ alignSelf: 'end', m: 2 }}
              color='info'
            >
              Agregar alimento
            </Button>
          </>
        )}

        {addFoodDialogOpen && (
          <AddFoodsToMeal
            open={addFoodDialogOpen}
            onClose={() => setAddFoodDialogOpen(false)}
            mealIdx={idx}
            numberOfFoodsInMeal={fields.length}
          />
        )}
      </Container>
    </FieldArrayFormProvider>
  )
}

export default MealContent

import { DeleteForever } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { MdOutlineExpandLess, MdOutlineExpandMore } from 'react-icons/md'
import { FieldArrayFormProvider } from '../../../../../../contexts/FieldArrayFormProvider'
import { Food, MealPlan } from '../../../../../../types/meals'
import TextFieldElement from '../../../../../Form/TextFieldElement'
import AddFoodsToMeal from '../AddFoodsToMeal'
import { Container, DefaultContent, JMTableCell, JMTableRow, NoContentTableMessage } from './styles'

const tableHeaderCols = [
  { name: 'Cantidad', textAlign: 'left' },
  { name: 'Alimento', textAlign: 'left' },
  { name: 'Calorías', textAlign: 'left' },
  { name: 'Prote', textAlign: 'center' },
  { name: 'Carbs', textAlign: 'center' },
  { name: 'Grasas', textAlign: 'center' },
  { name: 'Fibra', textAlign: 'center' },
  { name: '', textAlign: 'center' },
]

const MealContent = ({
  onDeleteMeal,
  idx,
}: // ...meal
{
  onDeleteMeal(): void
  name: string
  idx: number
}) => {
  const [isContentExpanded, setisContentExpanded] = useState(false)
  const [addFoodDialogOpen, setAddFoodDialogOpen] = useState(false)

  const fc = useFormContext<MealPlan>()
  const fieldArrayMethods = useFieldArray({
    control: fc.control,
    name: `meals.${idx}.foods` as `meals.${number}.foods`,
  })
  const { fields } = fieldArrayMethods

  const contractContent = () => setisContentExpanded(false)
  const expandContent = () => setisContentExpanded(true)

  const handleGramsChange = ({ e, foodIdx }: { e: React.ChangeEvent<any>; foodIdx: number }) => {
    fc.setValue(
      `meals.${idx}.foods.${foodIdx}.grams` as `meals.${number}.foods.${number}.grams`,
      // parseInt(value, 10) as number,
      +e.target.value as never,
    )
    fc.setValue(
      `meals.${idx}.foods.${foodIdx}.nutritionalValues.kcal` as `meals.${number}.foods.${number}.nutritionalValues.kcal`,
      // parseInt(value, 10) as number,
      +e.target.value as never,
    )
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
              fields.map((f, foodIdx) => {
                const food = f as Food
                return (
                  <JMTableRow key={food.id}>
                    <JMTableCell>
                      <TextFieldElement
                        name={`meals.${idx}.foods.${foodIdx}.grams`}
                        type='number'
                        size='small'
                        label='Gramos'
                        customOnChange={onGramsChange}
                        required
                        sx={{ width: 100 }}
                        validation={{
                          validate: (value) => Number.isInteger(value),
                        }}
                      />
                    </JMTableCell>
                    <JMTableCell>
                      <Typography sx={{ pl: 0.7 }}>{food.name}</Typography>
                    </JMTableCell>
                    <JMTableCell>
                      <Typography sx={{ pl: 0.7 }}>{food.nutritionalValues.kcal}</Typography>
                    </JMTableCell>
                    <JMTableCell withPoint pointColor='#0d8ac1'>
                      <Typography sx={{ pl: 0.7 }} textAlign='center'>
                        {food.nutritionalValues.proteins}
                      </Typography>
                    </JMTableCell>
                    <JMTableCell withPoint pointColor='#cba52a'>
                      <Typography sx={{ pl: 0.7 }} textAlign='center'>
                        {food.nutritionalValues.carbs}
                      </Typography>
                    </JMTableCell>
                    <JMTableCell withPoint pointColor='#b9261b'>
                      <Typography sx={{ pl: 0.7 }} textAlign='center'>
                        {food.nutritionalValues.fats}
                      </Typography>
                    </JMTableCell>
                    <JMTableCell withPoint pointColor='#64615c'>
                      <Typography sx={{ pl: 0.7 }} textAlign='center'>
                        {food.nutritionalValues.fiber}
                      </Typography>
                    </JMTableCell>
                    <DeleteForever
                      color='error'
                      fontSize='medium'
                      sx={{ cursor: 'pointer', ml: 2 }}
                      onClick={() => null}
                    />
                  </JMTableRow>
                )
              })
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

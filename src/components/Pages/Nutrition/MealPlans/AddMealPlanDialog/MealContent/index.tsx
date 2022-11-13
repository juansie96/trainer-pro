import { DeleteOutline } from '@mui/icons-material'
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useFieldArray } from 'react-hook-form'
import { MdOutlineExpandLess, MdOutlineExpandMore } from 'react-icons/md'
import TextFieldElement from '../../../../../Form/TextFieldElement'
import AddFoodsToMeal from '../AddFoodsToMeal'
import { Container, DefaultContent, JMTableRow, NoContentTableMessage } from './styles'

const tableHeaderCols = [
  'Cantidad',
  'Alimento',
  'Calorías',
  'Prote',
  'Carbs',
  'Grasas',
  'Fibra',
  '',
]

const MealContent = ({
  onDeleteMeal,
  idx,
  ...meal
}: {
  onDeleteMeal(): void
  name: string
  idx: number
}) => {
  const [isContentExpanded, setisContentExpanded] = useState(false)

  const [addFoodDialogOpen, setAddFoodDialogOpen] = useState(true)
  // const { fields, append, remove } = useFieldArray({
  //   control: formContext.control,
  //   name: 'meals', // unique name for your Field Array
  // })

  const rows = []

  const contractContent = () => setisContentExpanded(false)
  const expandContent = () => setisContentExpanded(true)

  return (
    <Container>
      <DefaultContent>
        <DeleteOutline
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
            {tableHeaderCols.map((colName) => (
              <div key='colName'>{colName}</div>
            ))}
          </JMTableRow>
          {rows.length === 0 ? (
            <NoContentTableMessage msg='Todavía no agregaste ninguna comida' />
          ) : null}
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
        <AddFoodsToMeal open={addFoodDialogOpen} onClose={() => setAddFoodDialogOpen(false)} />
      )}
    </Container>
  )
}

export default MealContent

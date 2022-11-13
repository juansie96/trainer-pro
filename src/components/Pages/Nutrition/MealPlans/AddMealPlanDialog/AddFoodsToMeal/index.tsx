import { useState } from 'react'
// import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
// import { useAppSelector } from '../../../../../state/storeHooks'
// import { selectTrainer } from '../../../../../redux/slices/trainerSlice'

import {
  Button,
  Dialog,
  DialogContent,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { StyledDialogActions, StyledDialogHeader } from '../../../../../UI/Dialogs/styles'
import FoodsTable from '../../../Meals/FoodsTable'
import { useAppSelector } from '../../../../../../state/storeHooks'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getFoodsByTrainerIdRef } from '../../../../../../firebase/fbRefs'
import { selectTrainer } from '../../../../../../redux/slices/trainerSlice'
import SearchIcon from '@mui/icons-material/Search'

import type { IProps } from './types'
import type { Foods, Meals } from '../../../../../../types/meals'
import AddMealDialog from '../../../Meals/AddFoodDialog'
import { CreatedByTypes } from '../../../Meals/FoodsLayout/types'

const AddFoodsToMeal = ({ open, onClose }: IProps) => {
  const trainer = useAppSelector(selectTrainer)
  const [foods, loading] = useCollectionData(getFoodsByTrainerIdRef(trainer.id as string))
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [query, setQuery] = useState('')
  const [addMealDialogOpen, setAddMealDialogOpen] = useState(false)
  const [createdBy, setCreatedBy] = useState<CreatedByTypes>('all')

  let filteredFoods = foods?.slice(0)

  if (query && foods) {
    filteredFoods = foods.filter((meal) => meal.name.toUpperCase().includes(query.toUpperCase()))
  }

  if (createdBy === 'custom') {
    filteredFoods = filteredFoods?.filter((m) => m.creatorId === trainer.id)
  } else if (createdBy === 'default') {
    filteredFoods = filteredFoods?.filter((m) => m.creatorId === '')
  }

  const addFoodToPlan = () => null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <StyledDialogHeader title='Añadir alimentos' />
      <DialogContent sx={{ py: 3 }}>
        <Typography>Seleccione los alimentos que desea agregar a su comida</Typography>
        <Stack direction='row' spacing={2} my={2}>
          <SearchClientInput
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          />
          <Button variant='contained' disabled={loading} onClick={() => setAddMealDialogOpen(true)}>
            Agregar alimento
          </Button>
        </Stack>
        <Stack direction='row' alignItems='center' mt={3} spacing={3}>
          <FormLabel>Alimentos creados por:</FormLabel>
          <RadioGroup
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value as CreatedByTypes)}
            name='radio-buttons-group'
          >
            <Stack direction='row'>
              <FormControlLabel value='all' control={<Radio />} label='Todos' />
              <FormControlLabel value='default' control={<Radio />} label='Trainer Pro' />
              <FormControlLabel value='custom' control={<Radio />} label='Propios' />
            </Stack>
          </RadioGroup>
        </Stack>
        {foods && <FoodsTable foods={filteredFoods as Foods} onAddToPlan={addFoodToPlan} />}
      </DialogContent>
      <StyledDialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type='submit' variant='contained' disabled={isAdding}>
          {isAdding ? 'Creando' : 'Crear'}
        </Button>
      </StyledDialogActions>
      {addMealDialogOpen && (
        <AddMealDialog open={addMealDialogOpen} onClose={() => setAddMealDialogOpen(false)} />
      )}
    </Dialog>
  )
}

const SearchClientInput = ({
  value,
  onChange,
}: {
  value: string
  onChange(e: React.ChangeEvent<HTMLInputElement>): void
}): JSX.Element => (
  <TextField
    sx={{ width: 500 }}
    type='text'
    size='small'
    label='Buscar un alimento'
    value={value}
    onChange={onChange}
    InputProps={{
      endAdornment: (
        <InputAdornment position='end'>
          <IconButton aria-label='toggle password visibility'>
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
)

export default AddFoodsToMeal

import {
  Box,
  Button,
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
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getFoodsByTrainerIdRef } from '../../../../../firebase/fbRefs'
import { CenteredLayout } from '../../../../UI/CenteredLayout'
import FoodsTable from '../FoodsTable'
import { useAppSelector } from '../../../../../state/storeHooks'
import { selectTrainer } from '../../../../../redux/slices/Trainer.slice'
import { CreatedByTypes } from './types'

const MealsLayout = ({ openAddMealDialog }: { openAddMealDialog(): void }) => {
  const trainer = useAppSelector(selectTrainer)
  const [foods, loading] = useCollectionData(getFoodsByTrainerIdRef(trainer.id as string))
  const [query, setQuery] = useState('')
  const [createdBy, setCreatedBy] = useState<CreatedByTypes>('all')

  let filteredFoods = foods?.slice(0).sort((a, b) => a.name.localeCompare(b.name))

  if (query && foods) {
    filteredFoods = foods.filter((meal) => meal.name.toUpperCase().includes(query.toUpperCase()))
  }

  if (createdBy === 'custom') {
    filteredFoods = filteredFoods?.filter((m) => m.creatorId === trainer.id)
  } else if (createdBy === 'default') {
    filteredFoods = filteredFoods?.filter((m) => m.creatorId === '')
  }

  return (
    <Stack maxWidth='95em' spacing={2.5}>
      <Stack direction='row' spacing={2}>
        <SearchFoodInput
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        />
        <Button variant='contained' disabled={loading} onClick={openAddMealDialog}>
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

      {filteredFoods && filteredFoods.length > 0 ? (
        <FoodsTable foods={filteredFoods} />
      ) : (
        <CenteredLayout>
          <Typography variant='h5' my={3}>
            No se encontró ningun alimento
          </Typography>
        </CenteredLayout>
      )}
    </Stack>
  )
}

const SearchFoodInput = ({
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

export default MealsLayout

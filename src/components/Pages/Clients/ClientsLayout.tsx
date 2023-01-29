import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { ClientsTable } from './ClientsTable'
import { useSelector } from 'react-redux'
import { selectTrainer } from '../../../redux/slices/Trainer.slice'
import { getClientsByTrainerIdRef } from '../../../firebase/fbRefs'
import { Stack } from '@mui/system'
import { AddClientDialog } from './AddClientDialog'

export const ClientsLayout = () => {
  const trainer = useSelector(selectTrainer)
  const [clients, isLoading] = useCollectionData(getClientsByTrainerIdRef(trainer.id as string))
  const [addClientDialogOpen, setAddClientDialogOpen] = useState<boolean>(false)
  const [query, setQuery] = useState('')

  let filteredClients = clients?.slice(0)

  if (query && clients) {
    filteredClients = clients.filter(
      (c) =>
        c.name.toUpperCase().includes(query.toUpperCase()) ||
        c.lastname.toUpperCase().includes(query.toUpperCase()) ||
        c.email.toUpperCase().includes(query.toUpperCase()),
    )
  }

  return (
    <Stack mt={5} className='clients-layout' maxWidth='95em' pl={4} spacing={4}>
      <Typography variant='h1'>Clientes</Typography>
      <Box display='flex'>
        <SearchClientInput
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        />
        <Button
          variant='contained'
          disabled={isLoading}
          onClick={() => setAddClientDialogOpen(true)}
        >
          Agregar cliente
        </Button>
      </Box>

      {isLoading ? (
        <Box>
          <Skeleton
            variant='rounded'
            sx={{ width: '100%', maxWidth: 'calc(100vw - 4em)' }}
            height={60}
          />
          <Skeleton
            variant='rectangular'
            sx={{ width: '100%', maxWidth: 'calc(100vw - 4em)', mt: 0.5 }}
            height={200}
          />
        </Box>
      ) : (
        <ClientsTable clients={filteredClients} />
      )}
      {addClientDialogOpen && (
        <AddClientDialog open={addClientDialogOpen} onClose={() => setAddClientDialogOpen(false)} />
      )}
    </Stack>
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
    sx={{ width: 600, mr: 2 }}
    type='text'
    size='small'
    label='Buscar un cliente'
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

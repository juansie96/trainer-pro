import { ReactNode, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { StyledDialogActions, StyledDialogHeader } from '../styles'
import { IProps } from './types'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import SearchIcon from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person'
import AddIcon from '@mui/icons-material/Add'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useAppSelector } from '../../../../state/storeHooks'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getClientsByTrainerIdRef, getDocumentRef } from '../../../../firebase/fbRefs'
import { selectTrainer } from '../../../../redux/slices/trainerSlice'
import { updateDoc } from 'firebase/firestore'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid'
import type { Client } from '../../../../types/client'
import type { MealPlanTask, WorkoutTask } from '../../../../types/task'

const AssignDialog = ({ onClose, data }: IProps) => {
  const trainer = useAppSelector(selectTrainer)
  const [clients, loading] = useCollectionData(getClientsByTrainerIdRef(trainer.id as string))

  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [query, setQuery] = useState('')
  const [unassignedClients, setUnassignedClients] = useState<Client[]>([])
  const [selectedClients, setSelectedClients] = useState<Client[]>([])
  const [selectedDate, setSelectedDate] = useState<any>()

  useEffect(() => {
    if (clients) {
      setUnassignedClients(clients.filter((c) => !selectedClients.find((sc) => sc.id === c.id)))
    }
  }, [clients])

  if (loading) return null // ToDo

  let filteredUnassignedClients = unassignedClients?.slice(0)

  if (query && unassignedClients) {
    filteredUnassignedClients = unassignedClients.filter(
      (c) =>
        c.name.toUpperCase().includes(query.toUpperCase()) ||
        c.lastname.toUpperCase().includes(query.toUpperCase()),
    )
  }

  const onSubmit = async () => {
    const date = selectedDate ? new Date(selectedDate).toISOString() : new Date().toISOString()
    setIsAdding(true)

    const task: WorkoutTask | MealPlanTask = {
      id: uuidv4(),
      date,
      title: data.data.name,
      type: data.type === 'workout' ? 'workout' : 'mealPlan',
      entityId: data.data.id as string,
      completed: { value: false, date: null },
    }

    const promises = selectedClients.map((c) =>
      updateDoc<Client>(getDocumentRef('clients', c.id as string), { tasks: [...c.tasks, task] }),
    )

    try {
      await Promise.all(promises)
      setIsAdding(false)
      Swal.fire(
        '¡Éxito!',
        `${
          data.type === 'workout' ? 'La rutina' : 'El plan nutricional'
        } se asignó correctamente a ${selectedClients.length} alumnos!`,
        'success',
      )
      onClose()
    } catch (err: unknown) {
      setIsAdding(false)
    }
  }

  const addClient = (client: Client) => {
    setUnassignedClients(unassignedClients.filter((c) => c.id !== client.id))
    setSelectedClients([...selectedClients, client])
  }

  const removeClient = (client: Client) => {
    setUnassignedClients([...unassignedClients, client])
    setSelectedClients(selectedClients.filter((c) => c.id !== client.id))
  }

  const title = `Asignar ${data.type === 'workout' ? 'rutina' : 'plan nutricional'} ${
    data.data.name
  }`

  return (
    <Dialog open onClose={onClose} maxWidth='md' fullWidth>
      <StyledDialogHeader title={title} />
      <DialogContent sx={{ pt: 3, pb: 4 }}>
        <Stack spacing={3}>
          <Typography>
            Selecciona a los clientes que deseas asignarle el plan nutricional y la fecha de inicio{' '}
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label='Fecha de nacimiento'
              inputFormat='DD/MM/YYYY'
              renderInput={(params) => <TextField {...params} sx={{ width: 250 }} />}
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </LocalizationProvider>
          <SearchClientInput
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          />
          <Box display='grid' gridTemplateColumns='1fr 1fr' sx={{ gridGap: '2em' }}>
            <ClientsBoxContainer>
              {filteredUnassignedClients.length === 0 ? (
                <Typography>No se encontraron clientes</Typography>
              ) : (
                filteredUnassignedClients.map((c) => (
                  <ClientRow key={c.id} client={c} onIconClick={() => addClient(c)} type='add' />
                ))
              )}
            </ClientsBoxContainer>
            <ClientsBoxContainer>
              {selectedClients.length === 0 ? (
                <Typography>No se seleccionó ningún cliente</Typography>
              ) : (
                selectedClients.map((c) => (
                  <ClientRow
                    key={c.id}
                    client={c}
                    onIconClick={() => removeClient(c)}
                    type='remove'
                  />
                ))
              )}
            </ClientsBoxContainer>
          </Box>
        </Stack>
      </DialogContent>
      <StyledDialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={onSubmit}
          variant='contained'
          disabled={isAdding || selectedClients.length === 0}
        >
          {isAdding ? 'Asignando' : 'Asignar'}
        </Button>
      </StyledDialogActions>
    </Dialog>
  )
}

const ClientsBoxContainer = ({ children }: { children: ReactNode }) => (
  <Stack
    borderRadius={1}
    border='1px solid #ccc'
    height={200}
    p={2}
    spacing={1}
    overflow='scroll'
    sx={{ overflowX: 'hidden' }}
  >
    {children}
  </Stack>
)

const ClientRow = ({
  onIconClick,
  type,
  client,
}: {
  client: Client
  onIconClick(): void
  type: 'add' | 'remove'
}) => (
  <Stack
    direction='row'
    spacing={2}
    width={1}
    justifyContent='space-between'
    divider={<Divider orientation='horizontal' flexItem />}
  >
    <Stack direction='row' spacing={2} alignItems='center'>
      <PersonIcon fontSize='large' />
      <Typography>{client.name + ' ' + client.lastname}</Typography>
    </Stack>
    {type === 'add' ? (
      <AddIcon fontSize='large' color='success' cursor='pointer' onClick={onIconClick} />
    ) : (
      <HighlightOffIcon fontSize='large' color='error' cursor='pointer' onClick={onIconClick} />
    )}
  </Stack>
)

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
    label='Buscar cliente'
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

export default AssignDialog

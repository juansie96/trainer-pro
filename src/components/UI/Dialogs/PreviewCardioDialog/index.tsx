import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Box,
  Typography,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { doc, updateDoc } from 'firebase/firestore'
import Swal from 'sweetalert2'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useAppDispatch, useAppSelector } from '../../../../state/storeHooks'
import { cardioTaskModified, selectClient, tasksChanged } from '../../../Pages/Client/Client.slice'
import { StyledDialogActions } from '../styles'
import { getDocumentRef } from '../../../../firebase/fbRefs'
import { Section } from '../../../Pages/Nutrition/MealPlans/PreviewMealPlanDialog'
import { useState } from 'react'
import FormContainer from '../../../Form/FormContainer'
import { Controller, SubmitHandler } from 'react-hook-form'
import TextFieldElement from '../../../Form/TextFieldElement'
import { firestoreDB } from '../../../../firebase/firebase'
import type { Client } from '../../../../types/client'
import type { IProps } from './types'
import { CardioTask } from '../../../../types/task'
import CheckIcon from '@mui/icons-material/Check'

const PreviewCardioDialog = ({ onClose, data }: IProps) => {
  const [status, setStatus] = useState<'view' | 'edit'>('view')
  const client = useAppSelector(selectClient) as Client
  const dispatch = useAppDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleClose = (e: any) => {
    e.stopPropagation()
    onClose()
  }

  const handleDeleteEvent = async () => {
    setIsDeleting(true)
    const docRef = getDocumentRef('clients', client.id as string)
    const newTasks = client.tasks.filter((t) => !(t.type === 'cardio' && t.id === data.id))
    try {
      setIsDeleting(false)
      await updateDoc<Client>(docRef, { tasks: newTasks })
      dispatch(tasksChanged(newTasks))
      Swal.fire('¡Éxito!', 'El evento se eliminó correctamente', 'success')
      onClose()
    } catch (error) {
      setIsDeleting(false)
      console.error(error)
    }
  }

  const handleEditSubmit: SubmitHandler<typeof data> = async (data) => {
    const docRef = doc(firestoreDB, 'clients', client.id as string)
    setIsEditing(true)
    try {
      const newTasks = client.tasks.map((t) => (t.type === 'cardio' && t.id === data.id ? data : t))
      await updateDoc(docRef, {
        tasks: newTasks,
      })
      Swal.fire('¡Éxito!', 'El cardio se asignó correctamente!', 'success')
      dispatch(cardioTaskModified(data))
      onClose()
    } catch (error) {
      onClose()
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se pudo agregar la rutina, intente nuevamente.',
      })
    }
  }

  const handleCompleteEvent = async () => {
    const docRef = getDocumentRef('clients', client.id as string)
    const newTasks = client.tasks.map((t) =>
      t.id === data?.id ? { ...t, completed: { value: true, date: new Date().toISOString() } } : t,
    )
    try {
      await updateDoc<Client>(docRef, { tasks: newTasks })
      dispatch(tasksChanged(newTasks))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Dialog open onClose={handleClose} maxWidth='sm' fullWidth>
        <Box
          borderBottom='1px solid #e3e3e3'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          pr={3}
        >
          <DialogTitle>
            {status === 'view'
              ? data.cardioType[0].toLocaleUpperCase() + data.cardioType.substring(1)
              : 'Editar cardio'}
          </DialogTitle>
          <Tooltip title='cerrar ventana'>
            <CloseIcon fontSize='medium' cursor='pointer' onClick={handleClose} />
          </Tooltip>
        </Box>
        <FormContainer onSuccess={handleEditSubmit} defaultValues={data}>
          <DialogContent sx={{ pt: 3, pb: 4 }}>
            {status === 'view' ? (
              <Section title='Distancia'>
                <Typography>{data.distance}</Typography>
              </Section>
            ) : (
              <EditContent onClose={onClose} data={data} onSubmit={handleEditSubmit} />
            )}
          </DialogContent>
          <StyledDialogActions justifyContent={status === 'view' ? 'space-between' : 'end'}>
            {status === 'view' ? (
              <Stack
                direction='row'
                spacing={2}
                alignItems='center'
                justifyContent='space-between'
                width={1}
              >
                <Tooltip title='editar rutina' onClick={() => setStatus('edit')}>
                  <EditIcon color='primary' fontSize='large' sx={{ cursor: 'pointer' }} />
                </Tooltip>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <Button
                    variant='contained'
                    sx={{ height: 38 }}
                    onClick={() => (data.completed.value ? null : handleCompleteEvent())}
                    color={data.completed.value ? 'success' : 'primary'}
                  >
                    <CheckIcon sx={{ mr: 1 }} />
                    {data.completed.value ? 'Tarea completada' : 'Completar tarea'}
                  </Button>
                  <Button
                    variant='contained'
                    color='error'
                    sx={{ height: 38 }}
                    onClick={handleDeleteEvent}
                    disabled={isDeleting}
                  >
                    <DeleteForeverIcon
                      fontSize='large'
                      sx={{ cursor: 'pointer', color: 'white', mr: 1 }}
                    />
                    Borrar tarea
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <>
                <Button onClick={() => setStatus('view')} sx={{ mr: 1 }}>
                  Cancelar
                </Button>
                <Button variant='contained' type='submit' disabled={isEditing}>
                  {isEditing ? 'Editando' : 'Editar'}
                </Button>
              </>
            )}
          </StyledDialogActions>
        </FormContainer>
      </Dialog>
    </div>
  )
}

const EditContent = ({
  data,
  onClose,
  onSubmit,
}: {
  data: CardioTask
  onClose(): void
  onSubmit: any
}) => {
  const cardioTypes = ['correr', 'caminar', 'ciclismo', 'elíptico', 'nadar', 'otro']

  return (
    <Box p={1}>
      <FormControl fullWidth>
        <InputLabel id='demo-simple-select-label'>Tipo</InputLabel>
        <Controller
          name='cardioType'
          rules={{ required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <>
              <Select {...field} error={invalid} required placeholder='lala'>
                {cardioTypes.map((type) => (
                  <MenuItem value={type} key={type} sx={{ py: 0, fontSize: '0.9em' }}>
                    {type[0].toUpperCase() + type.substring(1)}
                  </MenuItem>
                ))}
              </Select>
              {invalid && (
                <Typography variant='caption' color={'error'} sx={{ m: 1 }}>
                  Este campo es requerido
                </Typography>
              )}
            </>
          )}
        />
      </FormControl>
      <TextFieldElement
        name='distance'
        label='Distancia a recorrer'
        required
        fullWidth
        sx={{ mt: 3 }}
      />
    </Box>
  )
}

export default PreviewCardioDialog

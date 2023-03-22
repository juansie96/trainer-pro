import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { CLIENT_OBJECTIVES, TClientObjectives } from '../../../utils'
import type { Client } from '../../../types/client'
import { NoContentTableMessage } from '../Nutrition/MealPlans/AddMealPlanDialog/MealContent/styles'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import ConfirmDialog from '../../UI/Dialogs/ConfirmDialog'
import { deleteDoc } from 'firebase/firestore'
import { useState } from 'react'
import Swal from 'sweetalert2'

export interface ClientsTableProps {
  clients: Client[]
}

export interface ClientDialogState {
  open: boolean
  clientId: string
}

export const ClientsTable = ({ clients }: ClientsTableProps) => {
  const navigate = useNavigate()

  const [confirmDialog, setConfirmDialog] = useState<ClientDialogState>({
    open: false,
    clientId: '',
  })

  const handleDeleteClient = async () => {
    const client = clients.find((c) => c.id === confirmDialog.clientId) as Client
    try {
      await deleteDoc(client.ref)
      Swal.fire('¡Éxito!', 'El cliente se eliminó correctamente!', 'success')
      // dispatch
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear',
        text: 'Hubo un error al intentar eliminar el cliente, por favor intente nuevamente o comuniquese con un administrador.',
      })
    }
    setConfirmDialog({ open: false, clientId: '' })
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 'calc(100vw - 4em)' }}>
      <Table sx={{ minWidth: 650 }} aria-label='clients table'>
        <TableHead sx={{ bgcolor: '#1677d2' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, color: 'white' }}>Nombre</TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'white' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'white' }}>Objetivo</TableCell>
            <TableCell sx={{ width: '5em' }}></TableCell>
          </TableRow>
        </TableHead>
        {clients.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3}>
              <NoContentTableMessage msg='No se encontró ningún usuario' />
            </TableCell>
          </TableRow>
        ) : (
          <TableBody>
            {clients.map((client) => (
              <TableRow
                key={client.id}
                sx={{
                  cursor: 'pointer',
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component='th' scope='row'>
                  {client.name} {client.lastname}
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
                  {CLIENT_OBJECTIVES[client.objective as TClientObjectives].short}
                </TableCell>
                <TableCell>
                  <Tooltip title='visualizar cliente'>
                    <VisibilityIcon
                      color='action'
                      onClick={() => {
                        navigate(`/dashboard/client/${client.id}`, {
                          state: { client },
                        })
                      }}
                      sx={{ ml: 1, cursor: 'pointer' }}
                    />
                  </Tooltip>
                  <Tooltip title='eliminar cliente'>
                    <DeleteIcon
                      color='error'
                      sx={{ ml: 1, cursor: 'pointer' }}
                      onClick={() => setConfirmDialog({ open: true, clientId: client.id })}
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {confirmDialog.open && (
        <ConfirmDialog
          onClose={() => setConfirmDialog({ open: false, clientId: '' })}
          onConfirm={handleDeleteClient}
        />
      )}
    </TableContainer>
  )
}

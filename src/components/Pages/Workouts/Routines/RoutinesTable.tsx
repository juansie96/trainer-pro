import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from '@mui/material'
import { Workout } from '../../../../types/workout'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useState } from 'react'
import PreviewWorkoutDialog from './PreviewWorkoutDialog'
import EditWorkoutDialog from './EditWorkoutDialog'
import { deleteDoc } from 'firebase/firestore'
import ConfirmDialog from '../../../UI/Dialogs/ConfirmDialog'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import AssignDialog from '../../../UI/Dialogs/AssignDialog'
import { NoContentTableMessage } from '../../Nutrition/MealPlans/AddMealPlanDialog/MealContent/styles'
import Swal from 'sweetalert2'

export interface WorkoutsTableProps {
  workouts: Workout[]
}

export interface WorkoutDialogState {
  open: boolean
  workoutId: string
}

const RoutinesTable = ({ workouts }: WorkoutsTableProps) => {
  const [page, setPage] = useState(0)

  const [previewWorkoutDialog, setPreviewWorkoutDialog] = useState<WorkoutDialogState>({
    open: false,
    workoutId: '',
  })
  const [editWorkoutDialog, setEditWorkoutDialog] = useState<WorkoutDialogState>({
    open: false,
    workoutId: '',
  })

  const [confirmDialog, setConfirmDialog] = useState<WorkoutDialogState>({
    open: false,
    workoutId: '',
  })

  const [assignDialog, setAssignDialog] = useState<WorkoutDialogState>({
    open: false,
    workoutId: '',
  })

  const openPreviewWorkoutDialog = (workoutId: string) => {
    setPreviewWorkoutDialog({ open: true, workoutId: workoutId })
  }

  const closePreviewWorkoutDialog = () => {
    setPreviewWorkoutDialog({ open: false, workoutId: '' })
  }

  const openEditWorkoutDialog = (workoutId: string) => {
    setEditWorkoutDialog({ open: true, workoutId: workoutId })
  }

  const closeEditWorkoutDialog = () => {
    setEditWorkoutDialog({ open: false, workoutId: '' })
  }

  const openAssignDialog = (workoutId: string) => {
    setAssignDialog({ open: true, workoutId: workoutId })
  }

  const handleDeleteWorkout = async () => {
    const workout = workouts.find((w) => w.id === confirmDialog.workoutId) as Workout
    try {
      await deleteDoc(workout.ref)
      Swal.fire('¡Éxito!', 'La rutina se eliminó correctamente!', 'success')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: 'Hubo un error al eliminar la rutina, por favor intente nuevamente o comuniquese con un administrador.',
      })
      console.error(error)
    }
    setConfirmDialog({ open: false, workoutId: '' })
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 'calc(100vw - 6.875em - 4em)' }}>
        <Table sx={{ minWidth: 650 }} aria-label='workouts table'>
          <TableHead sx={{ bgcolor: '#1677d2' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 700, width: 0.25, maxWidth: '20em' }}>
                Nombre
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700, minWidth: '20em' }}>
                Descripción
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700, width: '10em' }}>
                Fecha de creación
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700, width: '10em' }}></TableCell>
            </TableRow>
          </TableHead>
          {workouts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>
                <NoContentTableMessage msg='No se encontró ninguna rutina' />
              </TableCell>
            </TableRow>
          ) : (
            <TableBody>
              {workouts.slice(page * 10, page * 10 + 10).map((workout) => (
                <TableRow
                  key={workout.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell component='th' scope='row'>
                    {workout.name}
                  </TableCell>
                  <TableCell>{workout.description}</TableCell>
                  <TableCell>
                    {workout.createdAt.toDate().toLocaleDateString().split(' ')[0]}
                  </TableCell>
                  <TableCell sx={{ width: '5em' }}>
                    <Tooltip title='asignar rutina'>
                      <PersonAddAlt1Icon
                        color='success'
                        sx={{ cursor: 'pointer' }}
                        onClick={() => openAssignDialog(workout.id)}
                      />
                    </Tooltip>
                    <Tooltip title='visualizar rutina'>
                      <VisibilityIcon
                        color='action'
                        onClick={() => openPreviewWorkoutDialog(workout.id)}
                        sx={{ ml: 1, cursor: 'pointer' }}
                      />
                    </Tooltip>
                    <Tooltip title='editar rutina'>
                      <EditIcon
                        color='primary'
                        sx={{ ml: 1, cursor: 'pointer' }}
                        onClick={() => openEditWorkoutDialog(workout.id)}
                      />
                    </Tooltip>
                    <Tooltip title='eliminar rutina'>
                      <DeleteIcon
                        color='error'
                        sx={{ ml: 1, cursor: 'pointer' }}
                        onClick={() => setConfirmDialog({ open: true, workoutId: workout.id })}
                      />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component='div'
        count={workouts.length}
        rowsPerPage={10}
        page={page}
        onPageChange={(_, n) => setPage(n)}
      />
      {previewWorkoutDialog.open && (
        <PreviewWorkoutDialog
          data={workouts.find((w) => w.id === previewWorkoutDialog.workoutId) as Workout}
          onClose={closePreviewWorkoutDialog}
        />
      )}
      {editWorkoutDialog.open && (
        <EditWorkoutDialog
          workout={workouts.find((w) => w.id === editWorkoutDialog.workoutId) as Workout}
          onClose={closeEditWorkoutDialog}
        />
      )}
      {confirmDialog.open && (
        <ConfirmDialog
          onClose={() => setConfirmDialog({ open: false, workoutId: '' })}
          onConfirm={handleDeleteWorkout}
        />
      )}
      {assignDialog.open && (
        <AssignDialog
          onClose={() => setAssignDialog({ open: false, workoutId: '' })}
          data={{
            type: 'workout',
            data: workouts.find((w) => w.id === assignDialog.workoutId) as Workout,
          }}
        />
      )}
    </>
  )
}

export default RoutinesTable

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
import { Workout } from '../../../../types/workout'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import PreviewWorkoutDialog from './PreviewWorkoutDialog'
import EditWorkoutDialog from './EditWorkoutDialog'
import { deleteDoc } from 'firebase/firestore'
import ConfirmDialog from '../../../ConfirmDialog'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import AssignDialog from '../../../UI/Dialogs/AssignDialog'

export interface WorkoutsTableProps {
  workouts: Workout[]
}

export interface WorkoutDialogState {
  open: boolean
  workoutId: string
}

const RoutinesTable = ({ workouts }: WorkoutsTableProps) => {
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

  const closeAssignDialog = () => {
    setAssignDialog({ open: false, workoutId: '' })
  }

  const handleDeleteWorkout = () => {
    const workout = workouts.find((w) => w.id === confirmDialog.workoutId) as Workout
    deleteDoc(workout.ref)
    setConfirmDialog({ open: false, workoutId: '' })
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ width: 0.9, mx: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label='workouts table'>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha de creación</TableCell>
              <TableCell sx={{ width: 150 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workouts.map((workout) => (
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
                <TableCell>
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
        </Table>
      </TableContainer>
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

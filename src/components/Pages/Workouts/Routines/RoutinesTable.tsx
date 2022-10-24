import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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

export interface WorkoutsTableProps {
  workouts: Workout[]
}

interface WorkoutDialogState {
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
                  cursor: 'pointer',
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
                  <VisibilityIcon
                    color='action'
                    onClick={() => openPreviewWorkoutDialog(workout.id)}
                  />
                  <EditIcon
                    color='primary'
                    sx={{ ml: 2 }}
                    onClick={() => openEditWorkoutDialog(workout.id)}
                  />
                  <DeleteIcon
                    color='error'
                    sx={{ ml: 2, color: '' }}
                    onClick={() => setConfirmDialog({ open: true, workoutId: workout.id })}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {previewWorkoutDialog.open && (
        <PreviewWorkoutDialog
          workout={workouts.find((w) => w.id === previewWorkoutDialog.workoutId) as Workout}
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
    </>
  )
}

export default RoutinesTable

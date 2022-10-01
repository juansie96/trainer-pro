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

export interface WorkoutsTableProps {
  workouts: Workout[]
}

interface WorkoutDialogState {
  open: boolean
  workout: Workout | null
}

const RoutinesTable = ({ workouts }: WorkoutsTableProps) => {
  const [previewWorkoutDialog, setPreviewWorkoutDialog] = useState<WorkoutDialogState>({
    open: false,
    workout: null,
  })

  const openPreviewWorkoutDialog = (workout: Workout) => {
    setPreviewWorkoutDialog({ open: true, workout })
  }

  const closePreviewWorkoutDialog = () => {
    setPreviewWorkoutDialog({ open: false, workout: null })
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
                    onClick={() => openPreviewWorkoutDialog(workout)}
                  />
                  <EditIcon color='primary' sx={{ ml: 2 }} />
                  <DeleteIcon color='error' sx={{ ml: 2, color: '' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {previewWorkoutDialog.open && (
        <PreviewWorkoutDialog
          workout={previewWorkoutDialog.workout as Workout}
          onClose={closePreviewWorkoutDialog}
        />
      )}
    </>
  )
}

export default RoutinesTable

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
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import PreviewWorkoutDialog from './PreviewWorkoutDialog'
import EditWorkoutDialog from './EditWorkoutDialog'
import {
  deleteDoc,
  doc,
  DocumentReference,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import ConfirmDialog from '../../../UI/Dialogs/ConfirmDialog'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import AssignDialog from '../../../UI/Dialogs/AssignDialog'
import { Client } from '../../../../types/client'
import { clientsRef } from '../../../../firebase/fbRefs'
import { firestoreDB } from '../../../../firebase/firebase'
import { selectClient, tasksChanged } from '../../../../redux/slices/Client.slice'
import { selectTrainer } from '../../../../redux/slices/Trainer.slice'
import { useAppDispatch, useAppSelector } from '../../../../state/storeHooks'
import { NoContentTableMessage } from '../../Nutrition/MealPlans/AddMealPlanDialog/MealContent/styles'

export interface WorkoutsTableProps {
  workouts: Workout[]
}

export interface WorkoutDialogState {
  open: boolean
  workoutId: string
}

const RoutinesTable = ({ workouts }: WorkoutsTableProps) => {
  const dispatch = useAppDispatch()
  const trainer = useAppSelector(selectTrainer)
  const client = useAppSelector(selectClient)
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

  const closeAssignDialog = () => {
    setAssignDialog({ open: false, workoutId: '' })
  }

  const handleDeleteWorkout = async () => {
    const workout = workouts.find((w) => w.id === confirmDialog.workoutId) as Workout
    deleteDoc(workout.ref)
    const q = query<Client>(clientsRef, where('trainerId', '==', trainer.id as string))
    const querySnapshot = await getDocs<Client>(q)
    const clientsQuery: Client[] = []
    querySnapshot.forEach((doc) => clientsQuery.push(doc.data()))

    const promises: Promise<void>[] = []

    clientsQuery.forEach((c) => {
      const clientDoc = c as Client
      const containsWorkoutTask = c.tasks.some(
        (t) => t.type === 'workout' && t.entityId == confirmDialog.workoutId,
      )
      if (containsWorkoutTask) {
        const newTasks = c.tasks.filter(
          (t) => t.type === 'workout' && t.entityId !== confirmDialog.workoutId,
        )
        const docRef = doc(firestoreDB, 'clients', clientDoc.id as string)
        promises.push(updateDoc<Client>(docRef as DocumentReference<Client>, { tasks: newTasks }))
      }
    })

    await Promise.all(promises)

    if (client) {
      dispatch(
        tasksChanged(
          client.tasks.filter(
            (t) => t.type === 'workout' && t.entityId !== confirmDialog.workoutId,
          ),
        ),
      )
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
        // onRowsPerPageChange={handleChangeRowsPerPage}
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

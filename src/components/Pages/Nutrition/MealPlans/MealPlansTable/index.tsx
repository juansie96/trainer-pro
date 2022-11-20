import { useState } from 'react'
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
import { deleteDoc, DocumentReference } from 'firebase/firestore'
import { MealPlan } from '../../../../../types/meals'
import { selectTrainer } from '../../../../../redux/slices/trainerSlice'
import { useAppSelector } from '../../../../../state/storeHooks'
import AddMealPlanDialog from '../AddMealPlanDialog'
import ConfirmDialog from '../../../../ConfirmDialog'
import { getDocumentRef } from '../../../../../firebase/fbRefs'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import type { IProps, MealPlanDialogState } from './types'
import PreviewMealPlanDialog from '../PreviewMealPlanDialog'
import { Stack } from '@mui/system'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import AssignDialog from '../../../../UI/Dialogs/AssignDialog'

const MealPlansTable = ({ mealPlans }: IProps) => {
  const trainer = useAppSelector(selectTrainer)

  const [previewMealPlanDialog, setPreviewMealPlanDialog] = useState<MealPlanDialogState>({
    open: false,
    mealPlanId: '',
  })
  const [editMealPlanDialog, setEditMealPlanDialog] = useState<MealPlanDialogState>({
    open: false,
    mealPlanId: '',
  })
  const [confirmDialog, setConfirmDialog] = useState<MealPlanDialogState>({
    open: false,
    mealPlanId: '',
  })

  const [assignDialog, setAssignDialog] = useState<MealPlanDialogState>({
    open: false,
    mealPlanId: '',
  })

  const openPreviewMealPlanDialog = (mealPlanId: string) => {
    setPreviewMealPlanDialog({ open: true, mealPlanId })
  }

  const closePreviewMealPlanDialog = () => {
    setPreviewMealPlanDialog({ open: false, mealPlanId: '' })
  }

  const openEditMealPlanDialog = (mealPlanId: string) => {
    setEditMealPlanDialog({ open: true, mealPlanId: mealPlanId })
  }

  const closeEditMealPlanDialog = () => {
    setEditMealPlanDialog({ open: false, mealPlanId: '' })
  }

  const openAssignDialog = (mealPlanId: string) => {
    setAssignDialog({ open: true, mealPlanId: mealPlanId })
  }

  const closeAssignDialog = () => {
    setAssignDialog({ open: false, mealPlanId: '' })
  }

  const handleDeleteMealPlan = () => {
    const mealPlan = mealPlans.find((mp) => mp.id === confirmDialog.mealPlanId) as MealPlan
    const mealPlanRef = getDocumentRef('mealPlans', mealPlan.id as string)
    deleteDoc(mealPlanRef as DocumentReference<MealPlan>)
    setConfirmDialog({ open: false, mealPlanId: '' })
  }

  const handleIconClick = (action: string, mealPlan: MealPlan) => {
    if (mealPlan.trainerId === '') return

    if (action === 'edit') {
      openEditMealPlanDialog(mealPlan.id as string)
    }

    if (action === 'delete') {
      setConfirmDialog({ open: true, mealPlanId: mealPlan.id as string })
    }
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ width: 1, mx: 'auto', my: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label='mealPlans table'>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 0.2 }}>Nombre</TableCell>
              <TableCell sx={{ width: 0.45 }}>Descripción</TableCell>
              <TableCell sx={{ width: 0.15 }}>Energía</TableCell>
              <TableCell sx={{ width: 0.1 }}>Creación</TableCell>
              <TableCell sx={{ width: 0.1 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mealPlans.map((mealPlan) => (
              <TableRow
                key={mealPlan.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell scope='row'>{mealPlan.name}</TableCell>
                <TableCell scope='row'>{mealPlan.description}</TableCell>
                <TableCell scope='row'>{mealPlan.kcal} kcal</TableCell>
                <TableCell scope='row'>
                  {mealPlan.createdAt?.toDate().toLocaleDateString().split(' ')[0]}
                </TableCell>
                <TableCell>
                  <Stack direction='row' spacing={1.5}>
                    <Tooltip title='asignar plan'>
                      <PersonAddAlt1Icon
                        onClick={() => openAssignDialog(mealPlan.id as string)}
                        color='success'
                        sx={{ cursor: 'pointer' }}
                      />
                    </Tooltip>
                    <Tooltip title='visualizar plan'>
                      <VisibilityIcon
                        color='action'
                        onClick={() => openPreviewMealPlanDialog(mealPlan.id as string)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </Tooltip>
                    <Tooltip title='editar plan'>
                      <EditIcon
                        fontSize='small'
                        color='primary'
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleIconClick('edit', mealPlan)}
                      />
                    </Tooltip>
                    <Tooltip title='eliminar plan'>
                      <DeleteIcon
                        color='error'
                        fontSize='small'
                        sx={{
                          cursor: 'pointer',
                        }}
                        onClick={() => handleIconClick('delete', mealPlan)}
                      />
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {editMealPlanDialog.open && (
        <AddMealPlanDialog
          mealPlan={mealPlans.find((w) => w.id === editMealPlanDialog.mealPlanId) as MealPlan}
          onClose={closeEditMealPlanDialog}
          open={editMealPlanDialog.open}
        />
      )}
      {confirmDialog.open && (
        <ConfirmDialog
          onClose={() => setConfirmDialog({ open: false, mealPlanId: '' })}
          onConfirm={handleDeleteMealPlan}
        />
      )}
      {previewMealPlanDialog.open && (
        <PreviewMealPlanDialog
          onClose={() => setPreviewMealPlanDialog({ open: false, mealPlanId: '' })}
          data={mealPlans.find((mp) => mp.id === previewMealPlanDialog.mealPlanId) as MealPlan}
        />
      )}
      {assignDialog.open && (
        <AssignDialog
          onClose={() => setAssignDialog({ open: false, mealPlanId: '' })}
          data={{
            type: 'mealPlan',
            data: mealPlans.find((mp) => mp.id === assignDialog.mealPlanId) as MealPlan,
          }}
        />
      )}
    </>
  )
}

export default MealPlansTable

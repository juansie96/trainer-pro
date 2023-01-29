import { useState } from 'react'
import {
  Button,
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
import { deleteDoc, DocumentReference, updateDoc } from 'firebase/firestore'
import { MealPlan } from '../../../../../types/meals'
import { useAppDispatch, useAppSelector } from '../../../../../state/storeHooks'
import AddMealPlanDialog from '../AddMealPlanDialog'
import ConfirmDialog from '../../../../ConfirmDialog'
import { getDocumentRef } from '../../../../../firebase/fbRefs'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PreviewMealPlanDialog from '../PreviewMealPlanDialog'
import { Stack } from '@mui/system'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import AssignDialog from '../../../../UI/Dialogs/AssignDialog'
import { selectClient, taskDeleted } from '../../../Client/Client.slice'
import type { IProps, MealPlanDialogState } from './types'
import { useLocation } from 'react-router-dom'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import SchedulePlanDialog from '../../../Client/ClientNutrition/SchedulePlanDialog'
import { NoContentTableMessage } from '../AddMealPlanDialog/MealContent/styles'

const MealPlansTable = ({ mealPlans, isClientAssignation, onAssignMealPlan }: IProps) => {
  const client = useAppSelector(selectClient)
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(0)
  const location = useLocation()

  const initialDialogState = {
    open: false,
    mealPlanId: '',
    clientId: null,
  }

  const [previewMealPlanDialog, setPreviewMealPlanDialog] =
    useState<MealPlanDialogState>(initialDialogState)
  const [editMealPlanDialog, setEditMealPlanDialog] =
    useState<MealPlanDialogState>(initialDialogState)
  const [confirmDialog, setConfirmDialog] = useState<MealPlanDialogState>(initialDialogState)
  const [assignDialog, setAssignDialog] = useState<MealPlanDialogState>(initialDialogState)
  const [scheduleMealPlanDialog, setScheduleMealPlanDialog] =
    useState<MealPlanDialogState>(initialDialogState)

  const openPreviewMealPlanDialog = (mealPlanId: string) => {
    setPreviewMealPlanDialog({ open: true, mealPlanId })
  }

  const openEditMealPlanDialog = (mealPlanId: string) => {
    setEditMealPlanDialog({ open: true, mealPlanId: mealPlanId })
  }

  const openScheduleMealPlanDialog = (mealPlanId: string) => {
    setScheduleMealPlanDialog({ open: true, mealPlanId, clientId: client.id })
  }

  const closeScheduleMealPlanDialog = () => {
    setScheduleMealPlanDialog(initialDialogState)
  }

  const closeEditMealPlanDialog = () => {
    setEditMealPlanDialog(initialDialogState)
    onAssignMealPlan ? onAssignMealPlan() : null
  }

  const handleDeleteMealPlan = async () => {
    const mealPlan = mealPlans.find((mp) => mp.id === confirmDialog.mealPlanId) as MealPlan
    const mealPlanRef = getDocumentRef('mealPlans', mealPlan.id as string)
    deleteDoc(mealPlanRef as DocumentReference<MealPlan>)

    if (mealPlan.clientId) {
      try {
        updateDoc(getDocumentRef('clients', mealPlan.clientId), {
          tasks: client.tasks.filter((t) => t.entityId !== mealPlan.id),
        })
        dispatch(taskDeleted({ taskEntityId: mealPlan.id }))
      } catch (error) {
        console.log(error)
      }
    }

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

  const handleUseTemplateClick = (mealPlanId: string) => {
    setEditMealPlanDialog({ open: true, mealPlanId, clientId: client.id })
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 'calc(100vw - 6.875em - 4em)' }}>
        <Table sx={{ minWidth: 650 }} aria-label='mealPlans table'>
          <TableHead sx={{ bgcolor: '#1677d2' }}>
            <TableRow>
              <TableCell sx={{ width: 0.2, fontWeight: 700, color: 'white' }}>Nombre</TableCell>
              <TableCell sx={{ width: 0.4, fontWeight: 700, color: 'white' }}>
                Descripción
              </TableCell>
              <TableCell sx={{ width: 0.15, fontWeight: 700, color: 'white' }}>Energía</TableCell>
              <TableCell sx={{ width: '10em', fontWeight: 700, color: 'white' }}>
                Creación
              </TableCell>
              <TableCell sx={{ width: '10em', fontWeight: 700, color: 'white' }}></TableCell>
            </TableRow>
          </TableHead>
          {mealPlans.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <NoContentTableMessage msg='No se encontró ningun plan nutricional' />
              </TableCell>
            </TableRow>
          ) : (
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
                    {isClientAssignation ? (
                      <Button
                        size='small'
                        variant='contained'
                        onClick={() => handleUseTemplateClick(mealPlan.id)}
                      >
                        Usar plantilla
                      </Button>
                    ) : (
                      <Stack direction='row' spacing={1.5}>
                        {!location.pathname.includes('client') ? (
                          <Tooltip title='asignar plan'>
                            <PersonAddAlt1Icon
                              onClick={() => null}
                              color='success'
                              sx={{ cursor: 'pointer' }}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title='agendar plan'>
                            <CalendarMonthIcon
                              onClick={() => openScheduleMealPlanDialog(mealPlan.id as string)}
                              color='success'
                              sx={{ cursor: 'pointer' }}
                            />
                          </Tooltip>
                        )}
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
                    )}
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
        count={mealPlans.length}
        rowsPerPage={10}
        page={page}
        onPageChange={(_, n) => setPage(n)}
      />
      {editMealPlanDialog.open && (
        <AddMealPlanDialog
          mealPlan={mealPlans.find((w) => w.id === editMealPlanDialog.mealPlanId) as MealPlan}
          onClose={closeEditMealPlanDialog}
          open={editMealPlanDialog.open}
          clientId={editMealPlanDialog.clientId}
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
      {scheduleMealPlanDialog.open && (
        <SchedulePlanDialog
          onClose={closeScheduleMealPlanDialog}
          mealPlanId={scheduleMealPlanDialog.mealPlanId}
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

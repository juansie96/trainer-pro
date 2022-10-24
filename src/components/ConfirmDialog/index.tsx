import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import { IProps } from './types'

const ConfirmDialog = ({ onConfirm, onClose }: IProps) => {
  return (
    <Dialog open={true} onClose={onClose} fullWidth>
      <DialogContent
        sx={{ pt: 3, pb: 4, display: 'flex', alignItems: 'center', flexDirection: 'column' }}
      >
        <PriorityHighIcon sx={{ fontSize: '7em' }} color='error' />
        <Typography textAlign='center' variant='h4'>
          ¿Estás seguro?
        </Typography>
        <Typography textAlign='center' variant='h6'>
          Esta acción no se puede deshacer
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type='submit' variant='contained' color='error' onClick={onConfirm}>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog

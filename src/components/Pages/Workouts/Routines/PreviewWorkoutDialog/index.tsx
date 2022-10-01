import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { IProps } from './types'

const PreviewWorkoutDialog = ({ onClose, workout }: IProps) => {
  //   const [exercises] = useCollectionData(exercisesRef)
  // <DialogContent dividers={scroll === 'paper'}> try this for divider
  // if not apply border of theme

  return (
    <Dialog open={true} onClose={onClose}>
      <Box borderBottom='1px solid #e3e3e3'>
        <DialogTitle>{workout.name}</DialogTitle>
      </Box>
      <DialogContent sx={{ pt: 3, pb: 4 }}>
        <DialogContentText>{workout.description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e3e3e3' }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type='submit' variant='contained'>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PreviewWorkoutDialog

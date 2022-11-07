import { Box, Dialog, DialogContent } from '@mui/material'
import { WorkoutTask } from '../../../types/client'

interface WorkoutEventDialogProps {
  onClose(): void
  data: WorkoutTask
}

const WorkoutEventDialog = ({ onClose, data }: WorkoutEventDialogProps) => {
  return (
    <Dialog open={true} onClose={onClose} maxWidth='xs' fullWidth>
      <Box borderBottom='1px solid #e3e3e3'>
        {/* <DialogTitle>Agregar nueva tarea</DialogTitle> */}
      </Box>
      <DialogContent></DialogContent>
    </Dialog>
  )
}

export default WorkoutEventDialog

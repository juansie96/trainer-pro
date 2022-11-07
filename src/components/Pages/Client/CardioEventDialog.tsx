import { Box, Dialog, DialogContent } from '@mui/material'
import { CardioTask } from '../../../types/client'

interface CardioEventDialogProps {
  onClose(): void
  data: CardioTask
}

const CardioEventDialog = ({ onClose, data }: CardioEventDialogProps) => {
  return (
    <Dialog open={true} onClose={onClose} maxWidth='xs' fullWidth>
      <Box borderBottom='1px solid #e3e3e3'>
        {/* <DialogTitle>Agregar nueva tarea</DialogTitle> */}
      </Box>
      <DialogContent></DialogContent>
    </Dialog>
  )
}

export default CardioEventDialog

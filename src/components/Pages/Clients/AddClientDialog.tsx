import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import LinkIcon from '@mui/icons-material/Link'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { selectTrainer } from '../../../redux/slices/trainerSlice'
import { useAppSelector } from '../../../state/storeHooks'

interface AddClientDialogProps {
  onClose(): void
  open: boolean
}

type AddClientOptions = 'link' | 'manual'

export function AddClientDialog({ open, onClose }: AddClientDialogProps) {
  const [step, setStep] = useState(1)
  const [option, setOption] = useState<AddClientOptions>('link')
  const [user] = useAuthState(getAuth())
  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        {/* <FormContainer formContext={formContext} handleSubmit={formContext.handleSubmit(onSubmit)}> */}
        <Box borderBottom='1px solid #e3e3e3'>
          <DialogTitle>Agregar Cliente</DialogTitle>
        </Box>
        <DialogContent sx={{ pt: 3, pb: 4 }}>
          {step === 1 && <StepOne option={option} setOption={setOption} />}{' '}
          {step === 2 && <div>{option === 'link' ? <ShareLinkContent /> : <AddClientForm />}</div>}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e3e3e3' }}>
          {!(step === 2 && option === 'link') && <Button onClick={onClose}>Cancelar</Button>}
          {step === 1 && (
            <Button variant='contained' onClick={() => setStep(2)}>
              Continuar
            </Button>
          )}
          {step === 2 && option === 'link' && (
            <Button variant='contained' onClick={() => onClose()}>
              Finalizar
            </Button>
          )}
        </DialogActions>
        {/* </FormContainer> */}
      </Dialog>
    </div>
  )
}

const StepOne = ({
  option,
  setOption,
}: {
  option: AddClientOptions
  setOption: (value: AddClientOptions) => void
}) => {
  return (
    <>
      <Typography variant='body1'>¿Cómo quieres agregar a tu cliente a la App?</Typography>
      <FormControl sx={{ mt: 3 }}>
        <FormLabel>Opciones:</FormLabel>
        <RadioGroup value={option} onChange={(e) => setOption(e.target.value as AddClientOptions)}>
          <FormControlLabel value='link' control={<Radio />} label='A través de un link' />
          <FormControlLabel value='manual' control={<Radio />} label='De forma manual' />
        </RadioGroup>
      </FormControl>
    </>
  )
}

const ShareLinkContent = () => {
  const trainer = useAppSelector(selectTrainer)
  return (
    <>
      <Typography variant='body1'>
        Generamos un enlace para que compartas con tu/s cliente/s. Solo tienes que copiarlo y
        mandarselos para que completen el registro.
      </Typography>
      <Box border='1px solid #ccc' borderRadius={5} display='flex' p={1} mt={2} alignItems='center'>
        <LinkIcon />
        <Typography sx={{ ml: 1 }} fontSize={13}>
          {window.location.origin}/client-activation/{trainer.id}
        </Typography>
        <Button
          size='small'
          onClick={() =>
            navigator.clipboard.writeText(
              `${window.location.origin}/client-activation/${trainer.id}`,
            )
          }
        >
          Copiar enlace
        </Button>
      </Box>
    </>
  )
}
const AddClientForm = () => {
  return <></>
}

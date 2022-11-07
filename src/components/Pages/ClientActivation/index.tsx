import {
  Button,
  Card,
  CircularProgress,
  FormControlLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import {
  SubmitHandler,
  useForm,
  Controller,
  useFormContext,
  useFieldArray,
  FieldError,
} from 'react-hook-form'
import { selectTrainer, TrainerState } from '../../../redux/slices/trainerSlice'
import { useAppSelector } from '../../../state/storeHooks'
import FormContainer from '../../Form/FormContainer'
import TextFieldElement from '../../Form/TextFieldElement'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import type { ClientActivationForm } from './types'
import { AuthError, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, firestoreDB } from '../../../firebase/firebase'
import { addDoc, doc, getDoc, WithFieldValue } from 'firebase/firestore'
import { clientsRef, trainerConverter } from '../../../firebase/fbRefs'
import type { Client } from '../../../types/client'
import { mapFirebaseErrorCodeToMsg } from '../../../utils/utils'
import { CustomSnackbar } from '../../UI/CustomSnackbar'
import { useParams } from 'react-router-dom'
import { ref } from 'firebase/database'

const ClientActivation = () => {
  const { trainerId } = useParams()

  useEffect(() => {
    getDoc(doc(firestoreDB, 'trainers/' + trainerId).withConverter(trainerConverter)).then(
      (res) => {
        const dbtrainer = res.data()
        setTrainer(dbtrainer ? { ...dbtrainer, id: trainerId as string } : null)
        setPageStatus(dbtrainer ? 'valid' : 'invalid')
      },
    )
  }, [])

  const [pageStatus, setPageStatus] = useState<'loading' | 'valid' | 'invalid'>('loading')

  const rhfMethods = useForm<ClientActivationForm>({
    defaultValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      gender: '',
      objective: '',
      birthDate: new Date(),
      weight: 0,
      height: 0,
      healthFormQuestions: healthFormQuestions,
    },
  })
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const isFirstStep = step === 1
  const isLastStep = step === 10
  const [signingUp, setSigningUp] = useState(false)
  const [trainer, setTrainer] = useState<TrainerState | null>(null)

  const handleSubmit: SubmitHandler<ClientActivationForm> = async (client) => {
    if (isLastStep) {
      try {
        setSigningUp(true)
        await createUserWithEmailAndPassword(auth, client.email, client.password)

        const ref = await addDoc(clientsRef, {
          ...client,
          birthDate: new Date(client.birthDate).toISOString(),
          trainerId: (trainer as TrainerState).id,
          tasks: [], // TAKE A LOOK AT THIS, NOT WORKING
        } as WithFieldValue<Client>)
        setSigningUp(false)
        setStep(step + 1)
        // dispatch(trainerRetrieved({ email, name: user.name, lastname: user.lastname, id: ref.id }))
      } catch (err) {
        console.error(err)
        setSigningUp(false)
        const error = err as AuthError
        setRegisterError(mapFirebaseErrorCodeToMsg(error.code))
        rhfMethods.setValue('password', '')
      }
    } else {
      setStep(step + 1)
    }
  }

  let stepContent

  switch (step) {
    case 1:
      stepContent = <StepOneContent trainer={trainer as TrainerState} />
      break
    case 2:
      stepContent = <StepTwoContent />
      break
    case 3:
      stepContent = <StepThreeContent />
      break
    case 4:
      stepContent = <StepFourContent />
      break
    case 5:
      stepContent = <StepFiveContent />
      break
    case 6:
      stepContent = <StepSixContent />
      break
    case 7:
      stepContent = <StepSevenContent />
      break
    case 8:
      stepContent = <StepEightContent />
      break
    case 9:
      stepContent = <StepNineContent />
      break
    case 10:
      stepContent = (
        <StepTenContent
          onSnackbarClose={() => setRegisterError(null)}
          registerError={registerError}
        />
      )
      break
    case 11:
      stepContent = <StepElevenContent />
      break
  }

  return (
    <Box
      bgcolor='#1976d2'
      width={1}
      height={1}
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      <Card elevation={5} sx={{ minWidth: 300, maxWidth: 500 }}>
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          maxWidth={500}
          bgcolor='#fff'
          borderRadius={3}
          p={5}
          minWidth={300}
        >
          {pageStatus === 'loading' && <CircularProgress />}
          {pageStatus === 'valid' && (
            <FormContainer onSuccess={handleSubmit} formContext={rhfMethods}>
              <>{signingUp && <LinearProgress sx={{ mb: 2 }} />}</>
              {stepContent}
              {step !== 11 && (
                <Box display={'flex'} justifyContent='space-between'>
                  {!isFirstStep && !signingUp && (
                    <Button onClick={() => setStep(step - 1)} fullWidth>
                      Atras
                    </Button>
                  )}
                  <Button variant='contained' type='submit' fullWidth disabled={signingUp}>
                    {!isLastStep && 'Siguiente'}
                    {isLastStep ? (signingUp ? 'Creando cuenta' : 'Crear cuenta') : null}
                  </Button>
                </Box>
              )}
            </FormContainer>
          )}
          {pageStatus === 'invalid' && (
            <>
              <Typography variant='h6' fontWeight={600} sx={{ mb: 1 }}>
                Lo sentimos
              </Typography>
              <Typography variant='body1'>
                Este link de invitación no es válido. Por favor, contactese con su entrenador para
                que le proporcione un link válido.
              </Typography>
            </>
          )}
        </Box>
      </Card>
    </Box>
  )
}

const StepOneContent = ({ trainer }: { trainer: TrainerState }) => {
  return (
    <>
      <Typography variant='h4' textAlign='center'>
        Trainer Pro
      </Typography>
      <Typography variant='body1' my={2} textAlign='center'>
        El entrenador {trainer.name} {trainer.lastname} te invitó a unirte a la aplicación. Por
        favor, completa los siguientes datos para crear tu nueva cuenta
      </Typography>
      <TextFieldElement
        name='name'
        label='Nombre'
        validation={{ required: 'El nombre es requerido' }}
        fullWidth={true}
        sx={{ mb: 2 }}
      />
      <TextFieldElement
        name='lastname'
        label='Apellido'
        validation={{ required: 'El apellido es requerido' }}
        fullWidth={true}
        sx={{ mb: 2 }}
      />
    </>
  )
}

const StepTwoContent = () => {
  const { control, formState } = useFormContext<ClientActivationForm>()
  const hasError = formState.errors.gender
  return (
    <div>
      <Typography variant='h6' fontWeight={600}>
        Selecciona tu genero
      </Typography>
      <Controller
        name='gender'
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <RadioGroup sx={{ my: 2 }} {...field}>
            {hasError && (
              <Typography variant='caption' fontWeight={600} color='error'>
                Debe seleccionar una de las opciones
              </Typography>
            )}
            <FormControlLabel value='male' control={<Radio />} label='Hombre' />
            <FormControlLabel value='female' control={<Radio />} label='Mujer' />
          </RadioGroup>
        )}
      />
    </div>
  )
}

const StepThreeContent = () => {
  const { control, formState } = useFormContext<ClientActivationForm>()
  const hasError = formState.errors.objective
  return (
    <div>
      <Typography variant='h6' fontWeight={600}>
        Selecciona tu objetivo
      </Typography>
      <Controller
        name='objective'
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <RadioGroup sx={{ my: 2 }} {...field}>
            {hasError && (
              <Typography variant='caption' fontWeight={600} color='error'>
                Debe seleccionar una de las opciones
              </Typography>
            )}
            <FormControlLabel
              value='loss'
              control={<Radio />}
              label='Perder peso, quemar grasa y definir músculo'
            />
            <FormControlLabel
              value='fit'
              control={<Radio />}
              label='Ponerme en forma de manera balanceada'
            />
            <FormControlLabel
              value='gain'
              control={<Radio />}
              label='Ganar músculo, volumen y fuerza'
            />
          </RadioGroup>
        )}
      />
    </div>
  )
}

const StepFourContent = () => (
  <div>
    <Typography variant='h6' fontWeight={600}>
      Seleccione su fecha de nacimiento
    </Typography>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name='birthDate'
        render={({ field }) => (
          <DesktopDatePicker
            label='Fecha de nacimiento'
            inputFormat='DD/MM/YYYY'
            renderInput={(params) => <TextField {...params} fullWidth sx={{ my: 2 }} />}
            {...field}
          />
        )}
      />
    </LocalizationProvider>
  </div>
)

const StepFiveContent = () => {
  const { setValue } = useFormContext<ClientActivationForm>()
  return (
    <>
      <Typography variant='h6' fontWeight={600}>
        ¿Cuánto pesas?
      </Typography>
      <TextFieldElement
        fullWidth
        label='Peso en kg'
        name='weight'
        type='number'
        customOnChange={(e) => setValue('weight', Number(e.target.value))}
        validation={{ min: { value: 1, message: 'El peso es requerido' } }}
        sx={{ my: 2 }}
      />
    </>
  )
}

const StepSixContent = () => {
  const { setValue } = useFormContext<ClientActivationForm>()
  return (
    <>
      <Typography variant='h6' fontWeight={600}>
        ¿Cuánto mides?
      </Typography>
      <TextFieldElement
        fullWidth
        label='Altura en cm'
        name='height'
        type='number'
        customOnChange={(e) => setValue('height', Number(e.target.value))}
        validation={{ min: { value: 1, message: 'La altura es requerido' } }}
        sx={{ my: 2 }}
      />
    </>
  )
}

// If I get error of no answers doesn't revalidate if no is pressed
const StepSevenContent = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ClientActivationForm>()

  const { fields, update } = useFieldArray({
    control,
    name: 'healthFormQuestions',
  })

  return (
    <div>
      {fields.slice(0, 2).map((item, idx) => {
        const hasError =
          Boolean(errors.healthFormQuestions) &&
          Boolean((errors.healthFormQuestions as Array<unknown>)[idx])

        return (
          <Box my={2} key={item.question}>
            {hasError && (
              <Typography variant='caption' color='error'>
                Esta pregunta es requerida
              </Typography>
            )}
            <Typography variant='body1'>{item.question}</Typography>
            <Box display='flex' alignItems='center'>
              <Controller
                name={`healthFormQuestions.${idx}.answer` as any}
                control={control}
                rules={{
                  validate: (value) => value !== null,
                }}
                render={({ field }) => (
                  <RadioGroup
                    sx={{ my: 0 }}
                    {...field}
                    onChange={(e) =>
                      update(idx, { ...item, answer: e.target.value === 'true' ? true : false })
                    }
                  >
                    <FormControlLabel value={true} control={<Radio />} label='Sí' />
                    <FormControlLabel value={false} control={<Radio />} label='No' />
                  </RadioGroup>
                )}
              />
            </Box>
          </Box>
        )
      })}
    </div>
  )
}

const StepEightContent = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ClientActivationForm>()

  const { fields, update } = useFieldArray({
    control,
    name: 'healthFormQuestions',
  })

  return (
    <div>
      {fields.slice(2, 5).map((item, idx) => {
        const hasError =
          Boolean(errors.healthFormQuestions) &&
          Boolean((errors.healthFormQuestions as Array<unknown>)[idx + 2])

        return (
          <Box my={2} key={item.question}>
            {hasError && (
              <Typography variant='caption' color='error'>
                Esta pregunta es requerida
              </Typography>
            )}
            <Typography variant='body1'>{item.question}</Typography>
            <Box display='flex' alignItems='center'>
              <Controller
                name={`healthFormQuestions.${2 + idx}.answer` as any}
                control={control}
                rules={{ validate: (value) => value !== null }}
                render={({ field }) => (
                  <RadioGroup
                    sx={{ my: 0 }}
                    {...field}
                    onChange={(e) =>
                      update(idx + 2, { ...item, answer: e.target.value === 'true' ? true : false })
                    }
                  >
                    <FormControlLabel value={true} control={<Radio />} label='Sí' />
                    <FormControlLabel value={false} control={<Radio />} label='No' />
                  </RadioGroup>
                )}
              />
            </Box>
          </Box>
        )
      })}
    </div>
  )
}

const StepNineContent = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ClientActivationForm>()

  const { fields, update } = useFieldArray({
    control,
    name: 'healthFormQuestions',
  })

  return (
    <div>
      {fields.slice(5).map((item, idx) => {
        const hasError =
          Boolean(errors.healthFormQuestions) &&
          Boolean((errors.healthFormQuestions as Array<unknown>)[idx + 5])

        return (
          <Box my={2} key={item.question}>
            {hasError && (
              <Typography variant='caption' color='error'>
                Esta pregunta es requerida
              </Typography>
            )}
            <Typography variant='body1'>{item.question}</Typography>
            <Box display='flex' alignItems='center'>
              <Controller
                name={`healthFormQuestions.${5 + idx}.answer` as any}
                control={control}
                rules={{ validate: (value) => value !== null }}
                render={({ field }) => (
                  <RadioGroup
                    sx={{ my: 0 }}
                    {...field}
                    onChange={(e) =>
                      update(idx + 5, { ...item, answer: e.target.value === 'true' ? true : false })
                    }
                  >
                    <FormControlLabel value={true} control={<Radio />} label='Sí' />
                    <FormControlLabel value={false} control={<Radio />} label='No' />
                  </RadioGroup>
                )}
              />
            </Box>
          </Box>
        )
      })}
    </div>
  )
}

const StepTenContent = ({
  registerError,
  onSnackbarClose,
}: {
  registerError?: string | null
  onSnackbarClose: () => void
}) => {
  return (
    <>
      <Typography variant='h6' textAlign={'center'}>
        ¡Ya casi!
      </Typography>
      <Typography variant='body1' sx={{ mb: 2 }} textAlign={'center'}>
        Introduzca su email y contraseña deseados y procederemos a crear su cuenta
      </Typography>
      <TextFieldElement
        fullWidth
        label='Email'
        name='email'
        type='email'
        validation={{ required: 'El email es requerido' }}
        sx={{ mb: 2 }}
      />
      <TextFieldElement
        fullWidth
        label='Password'
        name='password'
        type='password'
        validation={{ required: 'La contraseña es requerida' }}
        sx={{ mb: 2 }}
      />
      <CustomSnackbar
        open={!!registerError}
        message={registerError}
        severity='error'
        onClose={onSnackbarClose}
      />
    </>
  )
}

const StepElevenContent = () => {
  return (
    <>
      <Typography variant='h6' fontWeight={600}>
        ¡Felicitaciones, su cuenta a sido creada!
      </Typography>
      <Typography variant='body1' sx={{ my: 1 }}>
        Descarga la aplicación de TrainerPro desde Google Play store y disfruta.
      </Typography>
      <a href='https://play.google.com/store/games?hl=es_AR&gl=US'>
        <img src='/images/playstore.png' width={200} />
      </a>
    </>
  )
}

export default ClientActivation

const healthFormQuestions = [
  {
    question:
      '¿Alguna vez te ha diagnosticado un médico una enfermedad cardíaca, recomendándote que solo hagas actividad física supervisada por personal sanitario?',
    answer: null,
  },
  {
    question: '¿Sufres dolor en el pecho cuando realizas actividad física?',
    answer: null,
  },
  {
    question: '¿Has notado dolor en el pecho durante el último mes mientras estabas en reposo?',
    answer: null,
  },
  {
    question: '¿Has perdido la consciencia o el equilibrio después de notar sensación de mareo?',
    answer: null,
  },
  {
    question:
      '¿Tienes alguna alteración ósea o articular que podría agravarse con la actividad física?',
    answer: null,
  },
  {
    question:
      '¿Alguna vez te ha recetado el médico algún fármaco para la presión arterial u otro problema cardiocirculatorio?',
    answer: null,
  },
  {
    question:
      '¿Tienes conocimiento, por experiencia propia, o debido al consejo de algún médico, de cualquier otra razón física que te impida hacer ejercicio sin supervisión médica?',
    answer: null,
  },
]

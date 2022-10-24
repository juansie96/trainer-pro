import { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Button, LinearProgress } from '@mui/material'
import { useForm } from 'react-hook-form'
import { MainContainer } from '../../MainContainer/MainContainer'
import { CustomSnackbar } from '../../UI/CustomSnackbar'
import FormContainer from '../../Form/FormContainer'
import { UserContext } from '../../../contexts/UserContext'
import TextFieldElement from '../../Form/TextFieldElement'
import { AuthError, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebase/firebase'
import { mapFirebaseErrorCodeToMsg } from '../../../utils/utils'
import { addDoc, WithFieldValue } from 'firebase/firestore'
import { trainersRef } from '../../../firebase/fbRefs'
import { TrainerState } from '../../../redux/slices/trainerSlice'
import { useDispatch } from 'react-redux'

type RegisterFormValues = {
  email: string | null
  password: string
  name: string
  lastname: string
}

export const Register = () => {
  const userContext = useContext(UserContext)
  const dispatch = useDispatch()

  const formContext = useForm<RegisterFormValues>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      name: '',
      lastname: '',
    },
  })

  const [signingUp, setSigningUp] = useState(false)
  const [registerError, setRegisterError] = useState('')

  if (userContext?.user) {
    return <Navigate to='/dashboard' />
  }

  return (
    <MainContainer maxWidth='xs' sx={{ mt: 4 }}>
      {/* <FormErrors errors={formErrors} /> */}
      <>{signingUp && <LinearProgress sx={{ my: 3 }} />}</>
      <FormContainer formContext={formContext} handleSubmit={formContext.handleSubmit(onSignUp)}>
        <TextFieldElement
          sx={{ mb: 2 }}
          fullWidth
          label='Nombre'
          name='name'
          type='text'
          validation={{ required: 'El nombre es requerido' }}
        />
        <TextFieldElement
          sx={{ mb: 2 }}
          fullWidth
          label='Apellido'
          name='lastname'
          type='text'
          validation={{ required: 'El apellido es requerido' }}
        />
        <TextFieldElement
          sx={{ mb: 2 }}
          fullWidth
          label='Email'
          name='email'
          type='email'
          validation={{ required: 'El email es requerido' }}
        />
        <TextFieldElement
          sx={{ mb: 2 }}
          fullWidth
          label='Password'
          name='password'
          type='password'
          validation={{ required: 'La contraseña es requerida' }}
        />
        <Button variant='contained' type='submit' fullWidth disabled={signingUp}>
          {signingUp ? 'Creando cuenta' : 'Registrarse'}
        </Button>
      </FormContainer>

      <CustomSnackbar
        open={!!registerError}
        message={registerError}
        severity='error'
        onClose={onSnackbarClose}
      />
    </MainContainer>
  )

  function onSnackbarClose() {
    setRegisterError('')
  }

  async function onSignUp(user: RegisterFormValues) {
    setSigningUp(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email as string,
        user.password,
      )
      const email = userCredential.user.email as string
      const ref = await addDoc(trainersRef, {
        email,
        name: user.name,
        lastname: user.lastname,
      } as WithFieldValue<TrainerState>)
      // dispatch(trainerRetrieved({ email, name: user.name, lastname: user.lastname, id: ref.id }))
      setSigningUp(false)
      setRegisterError('')
    } catch (err) {
      const error = err as AuthError
      console.log('err', err)
      setSigningUp(false)
      setRegisterError(mapFirebaseErrorCodeToMsg(error.code))
      formContext.setValue('password', '')
    }
  }
}

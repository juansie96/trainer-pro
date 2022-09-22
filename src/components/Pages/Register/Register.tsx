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

type RegisterFormValues = {
  email: string
  password: string
}

export const Register = () => {
  const user = useContext(UserContext)

  const formContext = useForm<RegisterFormValues>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [signingUp, setSigningUp] = useState(false)
  const [registerError, setRegisterError] = useState<any>('')

  if (user) {
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
      await createUserWithEmailAndPassword(auth, user.email, user.password)
      setSigningUp(false)
      setRegisterError('')
    } catch (err) {
      const error = err as AuthError
      setSigningUp(false)
      setRegisterError(mapFirebaseErrorCodeToMsg(error.code))
      formContext.setValue('password', '')
    }
  }
}

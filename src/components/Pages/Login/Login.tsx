import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import { Button, LinearProgress } from '@mui/material'
import { MainContainer } from '../../MainContainer/MainContainer'
import { CustomSnackbar } from '../../UI/CustomSnackbar'
import FormContainer from '../../Form/FormContainer'
import TextFieldElement from '../../Form/TextFieldElement'
import { auth } from '../../../firebase/firebase'
import { AuthError, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { mapFirebaseErrorCodeToMsg } from '../../../utils/utils'
import { useAppDispatch } from '../../../state/storeHooks'
import { userLoggedIn } from '../../../redux/slices/trainerSlice'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getTrainerDataQueryRef } from '../../../firebase/fbRefs'
import { getDocs } from 'firebase/firestore'

type RegisterFormValues = {
  email: string
  password: string
}

export const Login: React.FC = () => {
  const dispatch = useAppDispatch()
  const [user] = useAuthState(auth)

  const formContext = useForm<RegisterFormValues>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [loginError, setLoginError] = useState('')

  if (user && !loading) {
    return <Navigate to='/dashboard' />
  }

  return (
    <MainContainer sx={{ mt: 4 }} maxWidth='xs'>
      {/* <FormErrors errors={formErrors} /> */}
      <FormContainer formContext={formContext} handleSubmit={formContext.handleSubmit(loginUser)}>
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
        <Button variant='contained' type='submit' fullWidth disabled={loading}>
          {loading ? 'INICIANDO SESIÓN' : 'INICIAR SESIÓN'}
        </Button>
      </FormContainer>
      <>{loading && <LinearProgress sx={{ my: 3 }} />}</>
      <CustomSnackbar
        open={!!loginError}
        message={loginError}
        severity='error'
        onClose={onSnackbarClose}
      />
    </MainContainer>
  )

  function onSnackbarClose() {
    setLoginError('')
  }

  function loginValidationError() {
    setLoading(false)
    signOut(auth)
    setLoginError('Por favor, ingrese a su cuenta de alumno desde la APP Movil')
  }

  async function loginUser(user: RegisterFormValues) {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, user.email, user.password)

      const querySnapshot = await getDocs(getTrainerDataQueryRef(user.email))
      const userExists = querySnapshot.size > 0
      if (userExists) {
        querySnapshot.forEach((doc) => {
          const trainerdb = doc.data()
          if (trainerdb) {
            dispatch(userLoggedIn({ ...trainerdb, id: doc.id }))
            setLoading(false)
          } else {
            loginValidationError()
          }
        })
      } else {
        loginValidationError()
      }
    } catch (err) {
      signOut(auth)
      setLoading(false)
      const error = err as AuthError
      setLoginError(mapFirebaseErrorCodeToMsg(error.code))
      formContext.setValue('password', '')
    }
  }
}

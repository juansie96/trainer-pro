import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate } from 'react-router-dom'
import { Box, Button, Container, LinearProgress, Typography } from '@mui/material'
import { CustomSnackbar } from '../../UI/CustomSnackbar'
import FormContainer from '../../Form/FormContainer'
import TextFieldElement from '../../Form/TextFieldElement'
import { mapFirebaseErrorCodeToMsg } from '../../../utils'
import { useAppDispatch } from '../../../state/storeHooks'
import { TrainerState, userLoggedIn } from '../../../redux/slices/Trainer.slice'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getTrainerDataQueryRef, trainersRef } from '../../../firebase/fbRefs'
import { addDoc, getDocs, WithFieldValue } from 'firebase/firestore'
import { FcGoogle } from 'react-icons/fc'
import { AuthError, signInWithPopup, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../../../firebase/firebase'

type RegisterFormValues = {
  email: string
  password: string
}

export const Login = () => {
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

  const handleGoogleLogin = async () => {
    setLoading(true)

    try {
      const { user } = await signInWithPopup(auth, googleProvider)
      const querySnapshot = await getDocs(getTrainerDataQueryRef(user?.email as string))
      const userExists = querySnapshot.size > 0
      if (userExists) {
        setLoading(false)
      } else {
        const name = user.displayName as string
        await addDoc(trainersRef, {
          email: user.email,
          name,
          lastname: '',
        } as WithFieldValue<TrainerState>)
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container sx={{ mt: 4 }} maxWidth='xs'>
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
          label='Contraseña'
          name='password'
          type='password'
          validation={{ required: 'La contraseña es requerida' }}
        />
        <Button variant='contained' type='submit' fullWidth disabled={loading}>
          {loading ? 'INICIANDO SESIÓN' : 'INICIAR SESIÓN'}
        </Button>
        <Link to='/reset-password'>
          <Typography variant={'body2'} color={'#333'} sx={{ mt: 1.5, cursor: 'pointer' }}>
            ¿Olvidaste tu contraseña?
          </Typography>
        </Link>
      </FormContainer>
      <Typography textAlign={'center'} sx={{ my: 2 }}>
        o
      </Typography>
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: '0.2em',
          display: 'flex',
          padding: '0.5em',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={handleGoogleLogin}
      >
        <FcGoogle size={23} />
        <Typography sx={{ ml: 1.3 }} variant='body1'>
          Login con Google
        </Typography>
      </Box>
      <>{loading && <LinearProgress sx={{ my: 3 }} />}</>
      <CustomSnackbar
        open={!!loginError}
        message={loginError}
        severity='error'
        onClose={onSnackbarClose}
      />
    </Container>
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

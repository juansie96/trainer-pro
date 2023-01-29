import { Button, Container, Typography } from '@mui/material'
import FormContainer from './Form/FormContainer'
import TextFieldElement from './Form/TextFieldElement'
import { HiOutlineKey } from 'react-icons/hi'
import { BsCheckCircle } from 'react-icons/bs'
import { AuthError, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { CustomSnackbar } from './UI/CustomSnackbar'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const ResetPassword = () => {
  const defaultValues = { email: '' }
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = ({ email }: { email: string }) => {
    setLoading(true)
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false)
        setEmailSent(true)
      })
      .catch((err) => {
        setLoading(false)
        const error = err as AuthError
        if (error.code === 'auth/user-not-found') {
          setLoginError('El email ingresado no existe en el sistema')
        } else {
          setLoginError(
            'Ocurrió un error inesperado, intentelo nuevamente mas tarde o comuniquese con un administrador.',
          )
        }
      })
  }
  return (
    <Container sx={{ mt: 4, textAlign: 'center', color: '#333' }} maxWidth='xs'>
      {!emailSent ? (
        <>
          <HiOutlineKey size={100} />
          <Typography variant='h6' sx={{ my: 1 }}>
            Reestablecer contraseña
          </Typography>
          <Typography variant='body1'>
            Por favor ingrese su email y nosotros le enviaremos un link para poder reestablecer su
            contraseña 👌
          </Typography>
          <FormContainer onSuccess={handleSubmit} defaultValues={defaultValues}>
            <TextFieldElement
              sx={{ mb: 2, mt: 1.5 }}
              fullWidth
              label='Email'
              name='email'
              type='email'
              validation={{ required: 'El email es requerido' }}
            />

            <Button variant='contained' type='submit' fullWidth disabled={loading}>
              Enviar mail
            </Button>
          </FormContainer>
        </>
      ) : (
        <EmailSentContent />
      )}

      <CustomSnackbar
        open={!!loginError}
        message={loginError}
        severity='error'
        onClose={() => setLoginError('')}
      />
    </Container>
  )
}

const EmailSentContent = () => {
  return (
    <>
      <BsCheckCircle size={100} />
      <Typography variant='h6' sx={{ my: 1 }}>
        ¡Revisa tu correo! 👀
      </Typography>
      <Typography variant='body1' sx={{ mt: 1, mb: 2 }}>
        El email fue enviado con éxito. Adentro encontrarás un link, haz click en el y podrás
        reestablecer tu contraseñá 😉
      </Typography>
      <Link to={'/login'} style={{ textDecoration: 'none' }}>
        <Button variant='contained' type='submit' fullWidth>
          Volver al login
        </Button>
      </Link>
    </>
  )
}

export default ResetPassword

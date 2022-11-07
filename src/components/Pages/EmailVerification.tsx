import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { HiOutlineMail } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/firebase'

const EmailVerification = () => {
  const [user] = useAuthState(auth)
  const navigate = useNavigate()

  if (user?.emailVerified) {
    navigate('/dashboard')
  }

  useEffect(() => {
    const emailVerificationListener = setInterval(function () {
      user?.reload().then(() => {
        if (user.emailVerified) {
          navigate('/dashboard')
        }
      })
    }, 5000)

    return () => clearInterval(emailVerificationListener)
  }, [])

  return (
    <Box
      width='100vw'
      height='calc(100vh - 64px)'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
    >
      <Box position='relative' textAlign='center'>
        <Box
          position='absolute'
          top={0}
          left={0}
          sx={{ transform: 'translate(-50%, -55%)' }}
          width={'50vw'}
          color={'#383838;'}
        >
          <HiOutlineMail size={200} />
          <Typography variant='h5' fontSize={30} sx={{ my: 1 }} letterSpacing={0.5}>
            Revisa tu email 😃
          </Typography>
          <Typography variant='body1' letterSpacing={0.5} fontSize={18} textAlign='center'>
            Enviamos un email de confirmación a tu correo para verificar tu cuenta.
            <br />
            Accede al email y haz click en el link para terminar el registro.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default EmailVerification

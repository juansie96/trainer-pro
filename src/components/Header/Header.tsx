import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../state/storeHooks'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase/firebase'
import { userLoggedOut } from '../../redux/slices/Trainer.slice'
import { useAuthState } from 'react-firebase-hooks/auth'
import LogoutIcon from '@mui/icons-material/Logout'

type Link = {
  label: string
  to: string
  onClick?: () => void
}

export function Header() {
  const [user] = useAuthState(auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  let links

  const onLogout = () => {
    dispatch(userLoggedOut())
    signOut(auth)
    navigate('/login')
  }

  if (user) {
    links = (
      <Button sx={{ color: 'white' }} onClick={onLogout}>
        <LogoutIcon sx={{ mr: 1 }} /> CERRAR SESIÓN
      </Button>
    )
  } else {
    links = (
      <>
        <CustomLink to='/register' label='Registrarse' />
        <CustomLink to='/login' label='Iniciar sesión' />
      </>
    )
  }

  return (
    <Box className='header'>
      <AppBar position='static' sx={{ '& .MuiTypography-root': { color: 'white' } }}>
        <Toolbar sx={{ boxShadow: '0px 3px 3px 0px rgb(0 0 0 / 10%)' }}>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Trainer Pro
          </Typography>
          {links}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

const CustomLink = (link: Link) => (
  <Button>
    <Link to={link.to} style={{ textDecoration: 'none', color: 'white' }} onClick={link.onClick}>
      {link.label}
    </Link>
  </Button>
)

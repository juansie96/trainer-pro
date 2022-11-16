import { Header } from '../Header/Header'
import { UserProvider } from '../../contexts/UserContext'
import AppRoutes from './AppRoutes'
import { useLocation } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebase'
// import { useAppSelector } from '../../state/storeHooks'
// import { selectTrainer } from '../../redux/slices/trainerSlice'

function App() {
  const [user] = useAuthState(auth)
  console.log('user', user)
  // const trainer = useAppSelector(selectTrainer)

  return (
    <UserProvider>
      {!useLocation().pathname.includes('/client-activation') && <Header />}
      <AppRoutes />
    </UserProvider>
  )
}

export default App

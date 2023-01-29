import { Header } from '../Header/Header'
import AppRoutes from './AppRoutes'
import { useLocation } from 'react-router-dom'
// import { useAuthState } from 'react-firebase-hooks/auth'
// import { auth } from '../../firebase/firebase'
// import { useAppSelector } from '../../state/storeHooks'
// import { selectTrainer } from '../../redux/slices/trainerSlice'

function App() {
  // const [user] = useAuthState(auth)
  // const trainer = useAppSelector(selectTrainer)

  const location = useLocation()

  return (
    <>
      {!location.pathname.includes('/client-activation') && <Header />}
      <AppRoutes />
    </>
  )
}

export default App

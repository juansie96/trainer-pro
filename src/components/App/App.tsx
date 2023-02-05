import { Header } from '../Header/Header'
import AppRoutes from './AppRoutes'
import { useLocation } from 'react-router-dom'
import { auth } from '../../firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useAppDispatch } from '../../state/storeHooks'
import { userLoggedOut } from '../../redux/slices/Trainer.slice'
// import { useAuthState } from 'react-firebase-hooks/auth'
// import { auth } from '../../firebase/firebase'
// import { useAppSelector } from '../../state/storeHooks'
// import { selectTrainer } from '../../redux/slices/trainerSlice'

function App() {
  // const [user] = useAuthState(auth)
  // const trainer = useAppSelector(selectTrainer)

  const dispatch = useAppDispatch()
  const location = useLocation()

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      dispatch(userLoggedOut())
    }
  })

  return (
    <>
      {!location.pathname.includes('/client-activation') && <Header />}
      <AppRoutes />
    </>
  )
}

export default App

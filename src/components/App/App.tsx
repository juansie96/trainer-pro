import { Header } from '../Header/Header'
import { UserProvider } from '../../contexts/UserContext'
import AppRoutes from './AppRoutes'
import { useLocation } from 'react-router-dom'
import populateMealsScript from '../Pages/Nutrition/Meals/populateMealsScript'
import { useEffect } from 'react'
// import { useAuthState } from 'react-firebase-hooks/auth'
// import { auth } from '../../firebase/firebase'
// import { useAppSelector } from '../../state/storeHooks'
// import { selectTrainer } from '../../redux/slices/trainerSlice'

function App() {
  // const [user] = useAuthState(auth)
  // const trainer = useAppSelector(selectTrainer)

  return (
    <UserProvider>
      {!useLocation().pathname.includes('/client-activation') && <Header />}
      <AppRoutes />
    </UserProvider>
  )
}

export default App

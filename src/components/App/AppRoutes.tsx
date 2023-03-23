import { Navigate, Route, Routes } from 'react-router-dom'
import { Login } from '../Pages/Login/Login'
import { Register } from '../Pages/Register/Register'
import { Dashboard } from '../Pages/Dashboard/Dashboard'
import HomeScreen from '../Pages/Home/Home'
import Nutrition from '../Pages/Nutrition/Nutrition'
import Workouts from '../Pages/Workouts/Workouts'
import Client from '../Pages/Client/Client'
import ClientPlanification from '../Pages/Client/ClientPlanification'
import ClientInformation from '../Pages/Client/ClientInformation'
import Exercises from '../Pages/Workouts/Exercises/Exercises'
import ClientActivation from '../Pages/ClientActivation'
import ResetPassword from '../ResetPassword'
import Meals from '../Pages/Nutrition/Foods'
import ClientNutrition from '../Pages/Client/ClientNutrition'
import { ClientsLayout } from '../Pages/Clients/ClientsLayout'
import { RoutinesLayout } from '../Pages/Workouts/Routines/RoutinesLayout'
import MealPlansLayout from '../Pages/Nutrition/MealPlans/MealPlansLayout'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebase'
import EmailVerification from '../Pages/EmailVerification'
import ClientEvolution from '../Pages/Client/ClientEvolution'

const AppRoutes = () => {
  const [user] = useAuthState(auth)

  return (
    <Routes>
      <Route path='/' element={<Navigate to={user ? '/dashboard' : '/register'} />} />
      <Route path='/login' element={<Login />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path='/register' element={<Register />} />
      <Route path='client-activation/:trainerId' element={<ClientActivation />} />
      <Route path='/verification' element={<EmailVerification />} />
      <Route path='/dashboard' element={<Dashboard />}>
        <Route path='' element={<HomeScreen />} />
        <Route path='clients' element={<ClientsLayout />} />
        <Route path='workouts' element={<Workouts />}>
          <Route path='' element={<RoutinesLayout />} />
          <Route path='exercises' element={<Exercises />} />
        </Route>
        <Route path='nutrition' element={<Nutrition />}>
          <Route path='' element={<MealPlansLayout />} />
          <Route path='meals' element={<Meals />} />
        </Route>
        <Route path='client/:clientId' element={<Client />}>
          <Route path='' element={<ClientPlanification />} />
          <Route path='information' element={<ClientInformation />} />
          <Route path='nutrition' element={<ClientNutrition />} />
          <Route path='evolution' element={<ClientEvolution />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes

import { Navigate, Route, Routes } from 'react-router-dom'
import { Login } from '../Pages/Login/Login'
import { Register } from '../Pages/Register/Register'
import { Dashboard } from '../Pages/Dashboard/Dashboard'
import Clients from '../Pages/Clients/Clients'
import HomeScreen from '../Pages/Home/Home'
import Nutrition from '../Pages/Nutrition/Nutrition'
import Workouts from '../Pages/Workouts/Workouts'
import { UserContext } from '../../contexts/UserContext'
import Client from '../Pages/Client/Client'
import ClientPlanification from '../Pages/Client/ClientPlanification'
import ClientInformation from '../Pages/Client/ClientInformation'
import { useContext } from 'react'
import ClientNutrition from '../Pages/Client/ClientNutrition'
import Routines from '../Pages/Workouts/Routines/Routines'
import Exercises from '../Pages/Workouts/Exercises/Exercises'
import ClientActivation from '../Pages/ClientActivation'
import EmailVerification from '../Pages/EmailVerification'
import ResetPassword from '../ResetPassword'
import MealPlans from '../Pages/Nutrition/MealPlans'
import Meals from '../Pages/Nutrition/Meals'

const AppRoutes = () => {
  const user = useContext(UserContext)?.user

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
        <Route path='clients' element={<Clients />} />
        <Route path='workouts' element={<Workouts />}>
          <Route path='' element={<Routines />} />
          <Route path='exercises' element={<Exercises />} />
        </Route>
        <Route path='nutrition' element={<Nutrition />}>
          <Route path='' element={<MealPlans />} />
          <Route path='meals' element={<Meals />} />
        </Route>
        <Route path='client/:clientId' element={<Client />}>
          <Route path='' element={<ClientPlanification />} />
          <Route path='information' element={<ClientInformation />} />
          <Route path='nutrition' element={<ClientNutrition />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes

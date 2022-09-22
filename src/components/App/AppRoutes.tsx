import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from '../Pages/Login/Login';
import { Register } from '../Pages/Register/Register';
import { Dashboard } from '../Pages/Dashboard/Dashboard';
import Clients from '../Pages/Clients/Clients';
import HomeScreen from '../Pages/Home/Home';
import NutritionScreen from '../Pages/Nutrition/Nutrition';
import Workouts from '../Pages/Workouts/Workouts';
import { UserContext } from '../../contexts/UserContext';
import Client from '../Pages/Client/Client';
import ClientPlanification from '../Pages/Client/ClientPlanification'
import ClientInformation from '../Pages/Client/ClientInformation';
import { useContext } from 'react';
import ClientNutrition from '../Pages/Client/ClientNutrition';
import Routines from '../Pages/Workouts/Routines/Routines';
import Exercises from '../Pages/Workouts/Exercises/Exercises';

const AppRoutes = () => {

  const user = useContext(UserContext)?.user;

  return (
    <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? '/dashboard' : '/register'} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="" element={<HomeScreen />} />
          <Route path="clients" element={<Clients />} />
          <Route path="workouts" element={<Workouts />}>
            <Route path="" element={<Routines />} />
            <Route path="exercises" element={<Exercises />} />
          </Route>
          <Route path="nutrition" element={<NutritionScreen />} />
          <Route path="client/:clientId" element={<Client />}>
            <Route path="" element={<Navigate to="planification" />} />
            <Route path="planification" element={<ClientPlanification />} />
            <Route path="information" element={<ClientInformation />} />
            <Route path="nutrition" element={<ClientNutrition />} />
          </Route>
        </Route>
      </Routes>
  )
}

export default AppRoutes
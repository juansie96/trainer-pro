import { Navigate, Route, Routes } from "react-router-dom";
import { Header } from "../Header/Header";
import { Login } from "../Pages/Login/Login";
import { Register } from "../Pages/Register/Register";
import { Dashboard } from "../Pages/Dashboard/Dashboard";
import Clients from "../Pages/Clients/Clients";
import HomeScreen from "../Pages/Home/Home";
import NutritionScreen from "../Pages/Nutrition/Nutrition";
import Workouts from "../Pages/Workouts/Workouts";
import { UserContext, UserProvider } from "../../contexts/UserContext";
import Client from "../Pages/Client/Client";
import ClientPlanification from "../Pages/Client/ClientPlanification"
import ClientInformation from "../Pages/Client/ClientInformation";
import { useContext } from "react";

function App() {
  
  const user = useContext(UserContext)?.user;

  return (
    <UserProvider>
      <Header />
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/register"} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="" element={<HomeScreen />} />
          <Route path="clients" element={<Clients />} /> 
          <Route path="workouts" element={<Workouts />} />
          <Route path="nutrition" element={<NutritionScreen />} />
          <Route path="client/:clientId" element={<Client />} >
            <Route
              path=""
              element={<Navigate to="planification" />}
            />
            <Route path="planification" element={<ClientPlanification />} />
            <Route path="information" element={<ClientInformation/>} />
          </Route>
        </Route>
      </Routes>
    </UserProvider>
  );
}

export default App;

import { Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "../../state/storeHooks";
import { Header } from "../Header/Header";
import { Login } from "../Pages/Login/Login";
import { Register } from "../Pages/Register/Register";
import { selectLoggedInUser } from "./App.slice";
import { Dashboard } from "../Pages/Dashboard/Dashboard";
import Clients from "../Pages/Clients/Clients";
import HomeScreen from "../Pages/Home/Home";
import NutritionScreen from "../Pages/Nutrition/Nutrition";
import Workouts from "../Pages/Workouts/Workouts";
import { UserProvider } from "../../contexts/UserContext";

function App() {
  const user = useAppSelector(selectLoggedInUser);

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
        </Route>
      </Routes>
    </UserProvider>
  );
}

export default App;

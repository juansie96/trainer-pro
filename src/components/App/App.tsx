import { Header } from "../Header/Header";
import { UserProvider } from "../../contexts/UserContext";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <UserProvider>
      <Header />
      <AppRoutes />
    </UserProvider>
  );
}

export default App;

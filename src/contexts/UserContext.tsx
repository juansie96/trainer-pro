import { User } from "firebase/auth";
import { createContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";

interface IUserContext {
  user: User | null | undefined;
  loading: boolean
}

export const UserContext = createContext<IUserContext | null | undefined>(null);

export const UserProvider: React.FC = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  return <UserContext.Provider value={{user, loading}}>{children}</UserContext.Provider>;
};

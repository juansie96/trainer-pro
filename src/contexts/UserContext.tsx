import { User } from "firebase/auth";
import { createContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";

export const UserContext = createContext<User | null | undefined>(null);

export const UserProvider: React.FC = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebase";

export const registerUserFB = (email: string, password: string): Promise<any> => {
    return createUserWithEmailAndPassword(auth, email, password);
}
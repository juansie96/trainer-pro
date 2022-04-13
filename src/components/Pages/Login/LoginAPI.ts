import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebase";

export const signInUserFB = (email: string, password: string): Promise<any> => {
    return signInWithEmailAndPassword(auth, email, password);
}
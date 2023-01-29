import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { firebaseConfig } from './firebaseConfig'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

import 'firebase/database'
import 'firebase/functions'

export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const firestoreDB = getFirestore(app)
export const storage = getStorage()
export const googleProvider = new GoogleAuthProvider()

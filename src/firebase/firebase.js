import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { firebaseConfig } from './firebaseConfig';

import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
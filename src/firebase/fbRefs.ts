import {
  collection,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { Client } from "../components/Pages/Clients/Clients";
import { Workout } from "../components/Pages/Workouts/Routines/Routines";
import { firestoreDB } from "./firebase";

const clientConverter: FirestoreDataConverter<Client> = {
  toFirestore(client: WithFieldValue<Client>): DocumentData {
    return {
      name: client.name,
      lastname: client.lastname,
      email: client.email,
      age: client.age,
      trainerId: client.trainerId
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Client {
    const data = snapshot.data(options);
    return {
      name: data.name,
      lastname: data.lastname,
      email: data.email,
      age: data.age,
      trainerId: data.trainerId,
      id: snapshot.id,
      ref: snapshot.ref,
    };
  },
};

const workoutConverter: FirestoreDataConverter<Workout> = {
  toFirestore(workout: WithFieldValue<Workout>): DocumentData {
    return {
      name: workout.name,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Workout {
    const data = snapshot.data(options);
    return {
      name: data.name,
      id: snapshot.id,
      ref: snapshot.ref,
    };
  },
};



export const clientsRef = collection(firestoreDB, "clients").withConverter(clientConverter);
export const workoutsRef = collection(firestoreDB, "workouts").withConverter(workoutConverter);

export default null;
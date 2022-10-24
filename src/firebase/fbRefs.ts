import {
  collection,
  doc,
  DocumentData,
  FirestoreDataConverter,
  getDoc,
  query,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  where,
  WithFieldValue,
} from 'firebase/firestore'
import { Client } from '../components/Pages/Clients/Clients'
import { Exercise } from '../components/Pages/Workouts/Exercises/Exercises'
import { TrainerState } from '../redux/slices/trainerSlice'
import { Workout } from '../types/workout'
import { firestoreDB } from './firebase'

export const trainerConverter: FirestoreDataConverter<Omit<TrainerState, 'id'>> = {
  toFirestore(trainer: WithFieldValue<Omit<TrainerState, 'id'>>): DocumentData {
    return {
      email: trainer.email,
      name: trainer.name,
      lastname: trainer.lastname,
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Omit<TrainerState, 'id'> {
    const data = snapshot.data(options)
    return {
      email: data.email,
      name: data.name,
      lastname: data.lastname,
    }
  },
}

const clientConverter: FirestoreDataConverter<Client> = {
  toFirestore(client: WithFieldValue<Client>): DocumentData {
    return {
      ...client,
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<Client>, options: SnapshotOptions): Client {
    const data = snapshot.data(options)
    const birthDate = (data.birthDate as Timestamp).toDate()
    return {
      ...data,
      birthDate,
      id: snapshot.id,
    }
  },
}

const workoutConverter: FirestoreDataConverter<Workout> = {
  toFirestore(workout: WithFieldValue<Workout>): DocumentData {
    return { ...workout }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<Workout>, options: SnapshotOptions): Workout {
    const data = snapshot.data(options)
    return {
      ...data,
      id: snapshot.id,
      ref: snapshot.ref,
    }
  },
}

const exerciseConverter: FirestoreDataConverter<Exercise> = {
  toFirestore(exercise: WithFieldValue<Exercise>): DocumentData {
    return {
      name: exercise.name,
      description: exercise.description ? exercise.description : '',
      videoUrl: exercise.videoUrl,
      imgUrls: exercise.imgUrls,
      tags: exercise.tags ? exercise.tags : [],
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Exercise {
    const data = snapshot.data(options)
    return {
      name: data.name,
      description: data.description,
      videoUrl: data.videoUrl,
      imgUrls: data.imgUrls,
      tags: data.tags,
      id: snapshot.id,
      ref: snapshot.ref,
    }
  },
}

export const clientsRef = collection(firestoreDB, 'clients').withConverter(clientConverter)

export const getClientDataDocById = (clientId: string) =>
  getDoc(doc(firestoreDB, 'clients', clientId).withConverter(clientConverter))

export const getClientsByTrainerIdRef = (trainerId: string) =>
  query(clientsRef, where('trainerId', '==', trainerId))

export const getTrainerDataQueryRef = (email: string) =>
  query(trainersRef, where('email', '==', email))

export const workoutsRef = collection(firestoreDB, 'workouts').withConverter(workoutConverter)
export const exercisesRef = collection(firestoreDB, 'exercises').withConverter(exerciseConverter)
export const trainersRef = collection(firestoreDB, 'trainers').withConverter(trainerConverter)

export default null

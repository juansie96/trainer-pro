import {
  collection,
  doc,
  DocumentData,
  FirestoreDataConverter,
  getDoc,
  query,
  QueryDocumentSnapshot,
  SnapshotOptions,
  where,
  WithFieldValue,
} from 'firebase/firestore'
import { firestoreDB } from './firebase'

import type { Client } from '../types/client'
import type { Exercise } from '../components/Pages/Workouts/Exercises/Exercises'
import type { TrainerState } from '../redux/slices/trainerSlice'
import type { Workout } from '../types/workout'
import type { Food } from '../types/meals'

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
    return client
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<Client>, options: SnapshotOptions): Client {
    const data = snapshot.data(options)

    return {
      ...data,
      id: snapshot.id,
    }
  },
}

const workoutConverter: FirestoreDataConverter<Workout> = {
  toFirestore(workout: WithFieldValue<Workout>): DocumentData {
    return workout
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
const foodConverter: FirestoreDataConverter<Food> = {
  toFirestore(food: WithFieldValue<Food>): DocumentData {
    return food
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<Food>, options: SnapshotOptions): Food {
    const data = snapshot.data(options)
    return { ...data, id: snapshot.id }
  },
}

export const clientsRef = collection(firestoreDB, 'clients').withConverter(clientConverter)

export const getClientDataDocById = (clientId: string) =>
  getDoc(doc(firestoreDB, 'clients', clientId).withConverter(clientConverter))

export const getClientsByTrainerIdRef = (trainerId: string) =>
  query(clientsRef, where('trainerId', '==', trainerId))

export const getWorkoutsByTrainerIdRef = (trainerId: string) =>
  query(workoutsRef, where('trainerId', '==', trainerId))

export const getFoodsByTrainerIdRef = (trainerId: string) =>
  query(foodsRef, where('creatorId', 'in', [trainerId, '']))

export const getTrainerDataQueryRef = (email: string) =>
  query(trainersRef, where('email', '==', email))

export const workoutsRef = collection(firestoreDB, 'workouts').withConverter(workoutConverter)
export const exercisesRef = collection(firestoreDB, 'exercises').withConverter(exerciseConverter)
export const trainersRef = collection(firestoreDB, 'trainers').withConverter(trainerConverter)
export const foodsRef = collection(firestoreDB, 'foods').withConverter(foodConverter)

export const getDocumentRef = (table: string, id: string) =>
  doc(firestoreDB, table, id).withConverter(getConverter(table) as FirestoreDataConverter<any>)

function getConverter(table: string) {
  switch (table) {
    case 'foods':
      return foodConverter
    case 'exercises':
      return exerciseConverter
    case 'workouts':
      return workoutConverter
    case 'trainers':
      return trainerConverter
  }
}

export default null

import {
  collection,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore'
import { Client } from '../components/Pages/Clients/Clients'
import { Exercise } from '../components/Pages/Workouts/Exercises/Exercises'
import { Workout } from '../types/workout'
import { firestoreDB } from './firebase'

const clientConverter: FirestoreDataConverter<Client> = {
  toFirestore(client: WithFieldValue<Client>): DocumentData {
    return {
      name: client.name,
      lastname: client.lastname,
      email: client.email,
      age: client.age,
      trainerId: client.trainerId,
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Client {
    const data = snapshot.data(options)
    return {
      name: data.name,
      lastname: data.lastname,
      email: data.email,
      age: data.age,
      trainerId: data.trainerId,
      id: snapshot.id,
      ref: snapshot.ref,
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
export const workoutsRef = collection(firestoreDB, 'workouts').withConverter(workoutConverter)
export const exercisesRef = collection(firestoreDB, 'exercises').withConverter(exerciseConverter)

export default null

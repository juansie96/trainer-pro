import { DocumentReference } from 'firebase/firestore'
import { HealthFormQuestion } from '../components/Pages/ClientActivation/types'

export interface Client {
  name: string
  lastname: string
  email: string
  trainerId: string
  password: string
  gender: string
  objective: string
  birthDate: string
  weight: number
  height: number
  healthFormQuestions: HealthFormQuestion[]
  tasks: Task[]
  id?: string
  ref?: DocumentReference<Client>
}

export type Task = CardioTask | WorkoutTask

export interface WorkoutTask {
  type: 'workout'
  date: string
  title: string
  workoutId: string
}

export type CardioTypes = 'correr' | 'caminar' | 'ciclismo' | 'elíptico' | 'nadar' | 'otro' | ''
export interface CardioTask {
  type: 'cardio'
  date: string
  cardioType: CardioTypes
  distance: string
}

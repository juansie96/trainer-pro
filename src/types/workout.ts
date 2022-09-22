import { DocumentData, DocumentReference } from 'firebase/firestore'

export interface SingleExercise {
  id: string
  sets?: number
  objective?: string
  rest: number
  type: 'single'
  exerciseId: string
}

export interface Superset {
  id: string
  sets: number
  exercises: SingleExercise[]
  type: 'superset'
}

export type WorkoutExercise = SingleExercise | Superset

export interface Workout {
  id: string
  name: string
  description: string
  workoutExercises: Array<WorkoutExercise>
  ref: DocumentReference<DocumentData>
}

import { DocumentData, DocumentReference, Timestamp } from 'firebase/firestore'

export interface SingleExercise {
  id: string
  sets?: number
  objective?: string
  rest: number
  type: 'single'
  exerciseId: string
}

export interface Workout {
  id: string
  name: string
  description: string
  trainerId: string
  createdAt: Timestamp
  updatedAt: Timestamp
  workoutExercises: Array<SingleExercise>
  ref: DocumentReference<DocumentData>
}

// export interface Superset {
//   id: string
//   sets: number
//   exercises: SingleExercise[]
//   type: 'superset'
// }

// export type WorkoutExercise = SingleExercise | Superset

import { DocumentData, DocumentReference, Timestamp } from 'firebase/firestore'

export interface SingleExercise extends Exercise {
  sets?: number
  objective?: string
  rest: number
  exerciseId: string
}

export interface Workout {
  id?: string
  name: string
  description: string
  trainerId: string
  clientId?: string
  createdAt: Timestamp
  updatedAt?: Timestamp
  workoutExercises: Array<SingleExercise>
  ref?: DocumentReference<DocumentData>
}

export interface Exercise {
  name: string
  description?: string
  id?: string
  videoUrl: string
  imgUrls: string[] | null
  tags: string[] | null
  creatorId?: string
  ref?: DocumentReference<DocumentData>
}

import { SingleExercise, Workout } from '../../../../../types/workout'

export interface EditWorkoutDialogProps {
  onClose(): void
  workout: Workout
  onSubmit?(workout: Workout): void
  clientId?: string
}

export interface EditWorkoutFormData {
  name: string
  description: string
  workoutExercises: Array<SingleExercise>
  id?: string
}

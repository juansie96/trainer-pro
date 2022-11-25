import { SingleExercise, Workout } from '../../../../../types/workout'

export interface EditWorkoutDialogProps {
  onClose(): void
  workout: Workout
  onSubmit?(workout: Workout): void
}

export interface EditWorkoutFormData {
  name: string
  description: string
  workoutExercises: Array<SingleExercise>
  id?: string
}

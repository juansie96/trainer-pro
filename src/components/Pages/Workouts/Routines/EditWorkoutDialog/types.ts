import { SingleExercise, Workout } from '../../../../../types/workout'

export interface EditWorkoutDialogProps {
  onClose(): void
  workout: Workout
}

export interface EditWorkoutFormData {
  name: string
  description: string
  workoutExercises: Array<SingleExercise>
}

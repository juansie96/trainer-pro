import { Workout } from '../../../../../types/workout'

export interface IProps {
  onClose(): void
  data?: Workout
  workoutId?: string
}

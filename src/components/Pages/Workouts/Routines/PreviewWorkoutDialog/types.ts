import { Workout } from '../../../../../types/workout'

export interface IProps {
  onClose(): void
  workout: Workout
}

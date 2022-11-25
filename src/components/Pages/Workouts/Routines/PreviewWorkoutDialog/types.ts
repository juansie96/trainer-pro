import { WorkoutTask } from '../../../../../types/task'
import { Workout } from '../../../../../types/workout'

export interface IProps {
  onClose(): void
  data?: Workout
  eventData?: WorkoutTask
}

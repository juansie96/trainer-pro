import { FieldArrayWithId } from 'react-hook-form'
import { Exercise } from '../../../../../types/workout'
import { AddWorkoutFormData } from '../AddWorkoutDialog'

export interface IProps {
  fields: FieldArrayWithId<AddWorkoutFormData, 'workoutExercises', 'id'>[]
  exercises: Exercise[]
  onRemoveExercises: (selectedExercises: readonly string[]) => void
  // onSupersetClick: (selectedExercises: readonly string[]) => void
}

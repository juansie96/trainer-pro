import { MealPlan } from '../../../../types/meals'
import { Workout } from '../../../../types/workout'

export interface IProps {
  onClose(): void
  data: AssignData
}

type AssignData = MealPlanData | WorkoutData

interface MealPlanData {
  type: 'mealPlan'
  data: MealPlan
}

interface WorkoutData {
  type: 'workout'
  data: Workout
}

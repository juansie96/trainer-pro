import { MealPlan } from '../../../../../types/meals'

export interface IProps {
  open: boolean
  onClose(): void
  mealPlan?: MealPlan
  fromAddTask?: boolean
}

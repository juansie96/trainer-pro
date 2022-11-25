import { MealPlan } from '../../../../../types/meals'

export interface IProps {
  open: boolean
  onClose(): void
  onSubmit?(mealPlan: MealPlan): void
  mealPlan?: MealPlan
  fromAddTask?: boolean
}

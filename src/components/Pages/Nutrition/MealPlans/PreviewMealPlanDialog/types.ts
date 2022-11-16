import { MealPlan } from '../../../../../types/meals'

export interface IProps {
  onClose(): void
  mealPlan: MealPlan
}

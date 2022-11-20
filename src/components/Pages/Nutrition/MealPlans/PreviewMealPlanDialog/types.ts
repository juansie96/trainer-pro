import { MealPlan } from '../../../../../types/meals'

export interface IProps {
  onClose(): void
  data?: MealPlan
  mealPlanId?: string
}

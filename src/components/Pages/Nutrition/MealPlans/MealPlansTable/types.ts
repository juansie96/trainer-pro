import { MealPlans } from '../../../../../types/meals'

export interface MealPlanDialogState {
  open: boolean
  mealPlanId: string
}

export interface IProps {
  mealPlans: MealPlans
  isClientAssignation?: boolean
}

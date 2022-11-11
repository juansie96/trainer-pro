import { Meals } from '../../../../../types/meals'

export interface MealDialogState {
  open: boolean
  mealId: string
}

export interface IProps {
  meals: Meals
}

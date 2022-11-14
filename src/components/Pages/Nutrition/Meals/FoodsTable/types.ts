import { Food, Foods } from '../../../../../types/meals'

export interface FoodDialogState {
  open: boolean
  foodId: string
}

export interface IProps {
  foods: Foods
  onAddToPlan?(food: Food): void
  mealIdx?: number
}

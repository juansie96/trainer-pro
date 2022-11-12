import { Foods } from '../../../../../types/meals'

export interface FoodDialogState {
  open: boolean
  foodId: string
}

export interface IProps {
  foods: Foods
}

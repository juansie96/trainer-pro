import { Meal } from '../../../../../types/meals'

export interface IProps {
  onClose(): void
  meal: Meal
}

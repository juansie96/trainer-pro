import { Food } from '../../../../../types/meals'

export interface IProps {
  onClose(): void
  food: Food
}

import { MealPlan } from '../../../../../types/meals'
import { MealPlanTask } from '../../../../../types/task'

export interface IProps {
  onClose(): void
  data?: MealPlan
  eventData?: MealPlanTask
}

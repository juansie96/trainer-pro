interface Task {
  id: string
  date: string
  title: string
  completed: {
    value: boolean
    date: string | null
  }
  entityId: string
}

export interface WorkoutTask extends Task {
  type: 'workout'
}

export interface MealPlanTask extends Task {
  type: 'mealPlan'
}

export interface CardioTask extends Task {
  type: 'cardio'
  cardioType: CardioTypes
  distance: string
}

export type GeneralTask = WorkoutTask | MealPlanTask | CardioTask
export type CardioTypes = 'correr' | 'caminar' | 'ciclismo' | 'elíptico' | 'nadar' | 'otro' | ''

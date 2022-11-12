export type MealPlans = Array<MealPlan>

export interface MealPlan {
  name: string
  description: string
  meals: Meals
}

export type Meals = Array<Meal>

export interface Meal {
  name: string
  foods: Foods
}

export type Foods = Array<Food>

export interface Food {
  name: string
  nutritionalValues: NutritionalValues
  id?: string
  creatorId?: string
}

export interface NutritionalValues {
  kcal: number
  proteins: number
  carbs: number
  fats: number
  fiber: number
}

import { DocumentData, DocumentReference } from 'firebase/firestore'

export type Meals = Array<Meal>

export interface Meal {
  name: string
  nutritionalValues: NutritionalValues
  id?: string
  creatorId?: string
  // ref?: DocumentReference<DocumentData>
}

export interface NutritionalValues {
  kcal: number
  proteins: number
  carbs: number
  fats: number
  fiber: number
}

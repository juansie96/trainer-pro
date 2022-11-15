import { Meal, MealPlan, Meals, NutritionalValueKeys } from '../../../../../types/meals'

export const getTotalNV = (key: NutritionalValueKeys, meals: Meals) =>
  meals.reduce((total, m) => {
    if (!m.foods) return total + 0
    return total + m.foods.reduce((t, food) => t + food.nutritionalValues[key].value, 0)
  }, 0)

export const changeGramsToFloat = (mealPlan: MealPlan): MealPlan => {
  const meals = mealPlan.meals.map((m) => ({
    ...m,
    foods: m.foods.map((f) => ({ ...f, grams: parseFloat(f.grams as any) })),
  }))
  return { ...mealPlan, meals }
}

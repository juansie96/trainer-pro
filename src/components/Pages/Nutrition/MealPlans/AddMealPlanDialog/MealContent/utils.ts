import { NutritionalValues } from '../../../../../../types/meals'

export const getNewNutritionalValues = (
  nv: NutritionalValues,
  newGrams: number,
): NutritionalValues => ({
  kcal: { ...nv.kcal, value: +(newGrams * nv.kcal.ratio).toFixed(2) },
  proteins: { ...nv.proteins, value: +(newGrams * nv.proteins.ratio).toFixed(2) },
  carbs: { ...nv.carbs, value: +(newGrams * nv.carbs.ratio).toFixed(2) },
  fats: { ...nv.fats, value: +(newGrams * nv.fats.ratio).toFixed(2) },
  fiber: { ...nv.fiber, value: +(newGrams * nv.fiber.ratio).toFixed(2) },
})

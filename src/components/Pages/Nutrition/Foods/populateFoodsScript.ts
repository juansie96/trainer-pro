import { addDoc } from 'firebase/firestore'
import { foodsRef } from '../../../../firebase/fbRefs'

const foods = [
  {
    name: 'Aceite de girasol',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 880, ratio: 880 / 100 },
      proteins: { value: 0, ratio: 0 / 100 },
      carbs: { value: 0, ratio: 0 / 100 },
      fats: { value: 99.9, ratio: 99.9 / 100 },
      fiber: { value: 0, ratio: 0 / 100 },
    },
  },
  {
    name: 'Aceite de oliva',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 880, ratio: 880 / 100 },
      proteins: { value: 0, ratio: 0 / 100 },
      carbs: { value: 0, ratio: 0 / 100 },
      fats: { value: 99.9, ratio: 99.9 / 100 },
      fiber: { value: 0, ratio: 0 / 100 },
    },
  },
  {
    name: 'Agua mineral',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 0, ratio: 0 / 100 },
      proteins: { value: 0, ratio: 0 / 100 },
      carbs: { value: 0, ratio: 0 / 100 },
      fats: { value: 0, ratio: 0 / 100 },
      fiber: { value: 0, ratio: 0 / 100 },
    },
  },
  {
    name: 'Almendra cruda',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 615, ratio: 615 / 100 },
      proteins: { value: 20, ratio: 20 / 100 },
      carbs: { value: 5.3, ratio: 5.3 / 100 },
      fats: { value: 54.1, ratio: 54.1 / 100 },
      fiber: { value: 13.5, ratio: 13.5 / 100 },
    },
  },
  {
    name: 'Arroz',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 387, ratio: 387 / 100 },
      proteins: { value: 7, ratio: 7 / 100 },
      carbs: { value: 86, ratio: 86 / 100 },
      fats: { value: 1, ratio: 1 / 100 },
      fiber: { value: 0.2, ratio: 0.2 / 100 },
    },
  },
  {
    name: 'Atún al natural',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 101, ratio: 101 / 100 },
      proteins: { value: 23.5, ratio: 23.5 / 100 },
      carbs: { value: 0, ratio: 0 / 100 },
      fats: { value: 0.6, ratio: 0.6 / 100 },
      fiber: { value: 0, ratio: 0 / 100 },
    },
  },
  {
    name: 'Batata cruda',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 101, ratio: 101 / 100 },
      proteins: { value: 1.2, ratio: 1.2 / 100 },
      carbs: { value: 21.5, ratio: 21.5 / 100 },
      fats: { value: 0.6, ratio: 0.6 / 100 },
      fiber: { value: 2.5, ratio: 2.5 / 100 },
    },
  },
  {
    name: 'Brocoli crudo',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 38, ratio: 38 / 100 },
      proteins: { value: 0, ratio: 0 / 100 },
      carbs: { value: 0, ratio: 0 / 100 },
      fats: { value: 0, ratio: 0 / 100 },
      fiber: { value: 0, ratio: 0 / 100 },
    },
  },
  {
    name: 'Calabacín',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 17.28, ratio: 17.28 / 100 },
      proteins: { value: 1.28, ratio: 1.28 / 100 },
      carbs: { value: 2, ratio: 2 / 100 },
      fats: { value: 0.2, ratio: 0.2 / 100 },
      fiber: { value: 1, ratio: 1 / 100 },
    },
  },
  {
    name: 'Carne Picada',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 244, ratio: 244 / 100 },
      proteins: { value: 15.22, ratio: 15.22 / 100 },
      carbs: { value: 0, ratio: 0 / 100 },
      fats: { value: 20.5, ratio: 20.5 / 100 },
      fiber: { value: 0, ratio: 0 / 100 },
    },
  },
  {
    name: 'Frutos secos',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 565, ratio: 565 / 100 },
      proteins: { value: 1.3, ratio: 1.3 / 100 },
      carbs: { value: 25, ratio: 25 / 100 },
      fats: { value: 51.4, ratio: 51.4 / 100 },
      fiber: { value: 9, ratio: 9 / 100 },
    },
  },
  {
    name: 'Gelatina',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 267, ratio: 267 / 100 },
      proteins: { value: 84, ratio: 84 / 100 },
      carbs: { value: 0, ratio: 0 / 100 },
      fats: { value: 0, ratio: 0 / 100 },
      fiber: { value: 0, ratio: 0 / 100 },
    },
  },
  {
    name: 'Huevo de gallina',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 150, ratio: 150 / 100 },
      proteins: { value: 12.5, ratio: 12.5 / 100 },
      carbs: { value: 0, ratio: 0 / 100 },
      fats: { value: 11.1, ratio: 11.1 / 100 },
      fiber: { value: 0, ratio: 0 / 100 },
    },
  },
  {
    name: 'Jugo de naranja',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 41.35, ratio: 41.35 / 100 },
      proteins: { value: 0.7, ratio: 0.7 / 100 },
      carbs: { value: 9, ratio: 9 / 100 },
      fats: { value: 0.2, ratio: 0.2 / 100 },
      fiber: { value: 0.1, ratio: 0.1 / 100 },
    },
  },
  {
    name: 'Leche de vaca entera',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 65, ratio: 65 / 100 },
      proteins: { value: 3, ratio: 3 / 100 },
      carbs: { value: 4.7, ratio: 4.7 / 100 },
      fats: { value: 3.8, ratio: 3.8 / 100 },
      fiber: { value: 0, ratio: 0 / 100 },
    },
  },
  {
    name: 'Manzana',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 50, ratio: 50 / 100 },
      proteins: { value: 0.3, ratio: 0.3 / 100 },
      carbs: { value: 12, ratio: 12 / 100 },
      fats: { value: 0, ratio: 0 / 100 },
      fiber: { value: 2, ratio: 2 / 100 },
    },
  },
  {
    name: 'Naranja',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 38.35, ratio: 38.35 / 100 },
      proteins: { value: 0.8, ratio: 0.8 / 100 },
      carbs: { value: 8.6, ratio: 8.6 / 100 },
      fats: { value: 0, ratio: 0 / 100 },
      fiber: { value: 2, ratio: 2 / 100 },
    },
  },
  {
    name: 'Pan lactal',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 243.2, ratio: 243.2 / 100 },
      proteins: { value: 6, ratio: 6 / 100 },
      carbs: { value: 44, ratio: 44 / 100 },
      fats: { value: 4, ratio: 4 / 100 },
      fiber: { value: 2, ratio: 2 / 100 },
    },
  },
  {
    name: 'Papa cruda',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 72.76, ratio: 72.76 / 100 },
      proteins: { value: 2.2, ratio: 2.2 / 100 },
      carbs: { value: 15.2, ratio: 15.2 / 100 },
      fats: { value: 0.2, ratio: 0.2 / 100 },
      fiber: { value: 1.7, ratio: 1.7 / 100 },
    },
  },
  {
    name: 'Pimiento rojo',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 29, ratio: 29 / 100 },
      proteins: { value: 1.3, ratio: 1.3 / 100 },
      carbs: { value: 4.5, ratio: 4.5 / 100 },
      fats: { value: 0.6, ratio: 0.6 / 100 },
      fiber: { value: 1.9, ratio: 1.9 / 100 },
    },
  },
  {
    name: 'Pimiento verde',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 22, ratio: 22 / 100 },
      proteins: { value: 0.6, ratio: 0.6 / 100 },
      carbs: { value: 2.6, ratio: 2.6 / 100 },
      fats: { value: 0.6, ratio: 0.6 / 100 },
      fiber: { value: 1.9, ratio: 1.9 / 100 },
    },
  },
  {
    name: 'Pechuga de pollo',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 112, ratio: 112 / 100 },
      proteins: { value: 21.8, ratio: 21.8 / 100 },
      carbs: { value: 0, ratio: 0 / 100 },
      fats: { value: 2.8, ratio: 2.8 / 100 },
      fiber: { value: 0, ratio: 0 / 100 },
    },
  },
  {
    name: 'Queso cremoso',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 304, ratio: 304 / 100 },
      proteins: { value: 24, ratio: 24 / 100 },
      carbs: { value: 1.9, ratio: 1.9 / 100 },
      fats: { value: 20, ratio: 20 / 100 },
      fiber: { value: 0, ratio: 0 / 100 },
    },
  },
  {
    name: 'Tomate',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 18.84, ratio: 18.84 / 100 },
      proteins: { value: 0.9, ratio: 0.9 / 100 },
      carbs: { value: 3.5, ratio: 3.5 / 100 },
      fats: { value: 0.1, ratio: 0.1 / 100 },
      fiber: { value: 1.1, ratio: 1.1 / 100 },
    },
  },
  {
    name: 'Yogur líquido natural',
    creatorId: '',
    nutritionalValues: {
      kcal: { value: 63.9, ratio: 0 / 100 },
      proteins: { value: 3, ratio: 0 / 100 },
      carbs: { value: 12.3, ratio: 0 / 100 },
      fats: { value: 0.3, ratio: 0 / 100 },
      fiber: { value: 0, ratio: 0 / 100 },
    },
  },
]

export default async function () {
  const promises = foods.map((food) => addDoc(foodsRef, food))
  Promise.all(promises).then(console.log).catch(console.error)
}

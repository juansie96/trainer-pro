import { addDoc } from 'firebase/firestore'
import { foodsRef } from '../../../../firebase/fbRefs'

const example = {
  name: '',
  creatorId: '',
  nutritionalValues: {
    kcal: 0,
    proteins: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
  },
}

const foods = [
  {
    name: 'Aceite de girasol',
    creatorId: '',
    nutritionalValues: {
      kcal: 880,
      proteins: 0,
      carbs: 0,
      fats: 99.9,
      fiber: 0,
    },
  },
  {
    name: 'Aceite de oliva',
    creatorId: '',
    nutritionalValues: {
      kcal: 880,
      proteins: 0,
      carbs: 0,
      fats: 99.9,
      fiber: 0,
    },
  },
  {
    name: 'Agua mineral',
    creatorId: '',
    nutritionalValues: {
      kcal: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
    },
  },
  {
    name: 'Almendra cruda',
    creatorId: '',
    nutritionalValues: {
      kcal: 615,
      proteins: 20,
      carbs: 5.3,
      fats: 54.1,
      fiber: 13.5,
    },
  },
  {
    name: 'Arroz',
    creatorId: '',
    nutritionalValues: {
      kcal: 387,
      proteins: 7,
      carbs: 86,
      fats: 1,
      fiber: 0.2,
    },
  },
  {
    name: 'Atún al natural',
    creatorId: '',
    nutritionalValues: {
      kcal: 101,
      proteins: 23.5,
      carbs: 0,
      fats: 0.6,
      fiber: 0,
    },
  },
  {
    name: 'Batata cruda',
    creatorId: '',
    nutritionalValues: {
      kcal: 101,
      proteins: 1.2,
      carbs: 21.5,
      fats: 0.6,
      fiber: 2.5,
    },
  },
  {
    name: 'Brocoli crudo',
    creatorId: '',
    nutritionalValues: {
      kcal: 38,
      proteins: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
    },
  },
  {
    name: 'Calabacín',
    creatorId: '',
    nutritionalValues: {
      kcal: 17.28,
      proteins: 1.28,
      carbs: 2,
      fats: 0.2,
      fiber: 1,
    },
  },
  {
    name: 'Carne Picada',
    creatorId: '',
    nutritionalValues: {
      kcal: 244,
      proteins: 15.22,
      carbs: 0,
      fats: 20.5,
      fiber: 0,
    },
  },
  {
    name: 'Frutos secos',
    creatorId: '',
    nutritionalValues: {
      kcal: 565,
      proteins: 1.3,
      carbs: 25,
      fats: 51.4,
      fiber: 9,
    },
  },
  {
    name: 'Gelatina',
    creatorId: '',
    nutritionalValues: {
      kcal: 267,
      proteins: 84,
      carbs: 0,
      fats: 0,
      fiber: 0,
    },
  },
  {
    name: 'Huevo de gallina',
    creatorId: '',
    nutritionalValues: {
      kcal: 150,
      proteins: 12.5,
      carbs: 0,
      fats: 11.1,
      fiber: 0,
    },
  },
  {
    name: 'Jugo de naranja',
    creatorId: '',
    nutritionalValues: {
      kcal: 41.35,
      proteins: 0.7,
      carbs: 9,
      fats: 0.2,
      fiber: 0.1,
    },
  },
  {
    name: 'Leche de vaca entera',
    creatorId: '',
    nutritionalValues: {
      kcal: 65,
      proteins: 3,
      carbs: 4.7,
      fats: 3.8,
      fiber: 0,
    },
  },
  {
    name: 'Manzana',
    creatorId: '',
    nutritionalValues: {
      kcal: 50,
      proteins: 0.3,
      carbs: 12,
      fats: 0,
      fiber: 2,
    },
  },
  {
    name: 'Naranja',
    creatorId: '',
    nutritionalValues: {
      kcal: 38.35,
      proteins: 0.8,
      carbs: 8.6,
      fats: 0,
      fiber: 2,
    },
  },
  {
    name: 'Pan lactal',
    creatorId: '',
    nutritionalValues: {
      kcal: 243.2,
      proteins: 6,
      carbs: 44,
      fats: 4,
      fiber: 2,
    },
  },
  {
    name: 'Papa cruda',
    creatorId: '',
    nutritionalValues: {
      kcal: 72.76,
      proteins: 2.2,
      carbs: 15.2,
      fats: 0.2,
      fiber: 1.7,
    },
  },
  {
    name: 'Pimiento rojo',
    creatorId: '',
    nutritionalValues: {
      kcal: 29,
      proteins: 1.3,
      carbs: 4.5,
      fats: 0.6,
      fiber: 1.9,
    },
  },
  {
    name: 'Pimiento verde',
    creatorId: '',
    nutritionalValues: {
      kcal: 22,
      proteins: 0.6,
      carbs: 2.6,
      fats: 0.6,
      fiber: 1.9,
    },
  },
  {
    name: 'Pechuga de pollo',
    creatorId: '',
    nutritionalValues: {
      kcal: 112,
      proteins: 21.8,
      carbs: 0,
      fats: 2.8,
      fiber: 0,
    },
  },
  {
    name: 'Queso cremoso',
    creatorId: '',
    nutritionalValues: {
      kcal: 304,
      proteins: 24,
      carbs: 1.9,
      fats: 20,
      fiber: 0,
    },
  },
  {
    name: 'Tomate',
    creatorId: '',
    nutritionalValues: {
      kcal: 18.84,
      proteins: 0.9,
      carbs: 3.5,
      fats: 0.1,
      fiber: 1.1,
    },
  },
  {
    name: 'Yogur líquido natural',
    creatorId: '',
    nutritionalValues: {
      kcal: 63.9,
      proteins: 3,
      carbs: 12.3,
      fats: 0.3,
      fiber: 0,
    },
  },
]

export default async function () {
  const promises = foods.map((food) => addDoc(foodsRef, food))
  Promise.all(promises).then(console.log).catch(console.error)
}

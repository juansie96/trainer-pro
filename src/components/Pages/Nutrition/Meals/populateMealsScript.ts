import { addDoc } from 'firebase/firestore'
import { mealsRef } from '../../../../firebase/fbRefs'

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

const meals = [
  {
    name: 'populateTest1',
    creatorId: '',
    nutritionalValues: {
      kcal: 1,
      proteins: 1,
      carbs: 1,
      fats: 1,
      fiber: 1,
    },
  },
  {
    name: 'populateTest2',
    creatorId: '',
    nutritionalValues: {
      kcal: 2,
      proteins: 2,
      carbs: 2,
      fats: 2,
      fiber: 2,
    },
  },
  {
    name: 'populateTest3',
    creatorId: '',
    nutritionalValues: {
      kcal: 3,
      proteins: 3,
      carbs: 3,
      fats: 3,
      fiber: 3,
    },
  },
]

export default async function () {
  const promises = meals.map((meal) => addDoc(mealsRef, meal))
  Promise.all(promises).then(console.log).catch(console.error)
}

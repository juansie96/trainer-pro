import { addDoc } from 'firebase/firestore'
import { foodsRef } from '../firebase/fbRefs'

export const defaultWorkouts = []

// export default async function () {
//   const promises = foods.map((food) => addDoc(foodsRef, food))
//   Promise.all(promises).then(console.log).catch(console.error)
// }

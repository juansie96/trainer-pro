import { addDoc } from 'firebase/firestore'
import { exercisesRef } from '../firebase/fbRefs'

const exercises = []

export default async function () {
  const promises = exercises.map((food) => addDoc(exercisesRef, food))
  Promise.all(promises).then(console.log).catch(console.error)
}

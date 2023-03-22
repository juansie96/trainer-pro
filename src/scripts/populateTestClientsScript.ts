import { addDoc } from 'firebase/firestore'
import { clientsRef, foodsRef } from '../firebase/fbRefs'
import { Client } from '../types/client'

export const testClients: Client[] = [
  {
    birthDate: '1996-11-17T19:55:20.752Z',
    email: 'clientedepruebajuan@gmail.com',
    gender: 'male',
    height: 185,
    name: '[PRUEBA] Juan',
    lastname: 'Sierra',
    objective: 'fit',
    password: 'test',
    weight: 85,
    healthFormQuestions: [],
    trainerId: '',
    tasks: [],
  },
  {
    birthDate: '1995-10-27T19:55:20.752Z',
    email: 'clientedepruebaana@gmail.com',
    gender: 'female',
    height: 160,
    name: '[PRUEBA] Ana',
    lastname: 'Gonzalez',
    objective: 'loss',
    password: 'test',
    weight: 55,
    healthFormQuestions: [],
    trainerId: '',
    tasks: [],
  },
]

export const populateTestClients = (clients: Client[]) => {
  const promises = clients.map((c) => addDoc(clientsRef, c))
  return Promise.all(promises).then(console.log).catch(console.error)
}

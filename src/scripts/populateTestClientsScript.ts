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
    healthFormQuestions: [
      {
        question:
          '¿Alguna vez te ha diagnosticado un médico una enfermedad cardíaca, recomendándote que solo hagas actividad física supervisada por personal sanitario?',
        answer: false,
      },
      {
        question: '¿Sufres dolor en el pecho cuando realizas actividad física?',
        answer: true,
      },
      {
        answer: true,

        question: '¿Has notado dolor en el pecho durante el último mes mientras estabas en reposo?',
      },
      {
        answer: true,
        question:
          '¿Has perdido la consciencia o el equilibrio después de notar sensación de mareo?',
      },
      {
        answer: false,
        question:
          '¿Tienes alguna alteración ósea o articular que podría agravarse con la actividad física?',
      },
      {
        question:
          '¿Alguna vez te ha recetado el médico algún fármaco para la presión arterial u otro problema cardiocirculatorio?',
        answer: false,
      },
      {
        question:
          '¿Tienes conocimiento, por experiencia propia, o debido al consejo de algún médico, de cualquier otra razón física que te impida hacer ejercicio sin supervisión médica?',
        answer: true,
      },
    ],
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
    healthFormQuestions: [
      {
        question:
          '¿Alguna vez te ha diagnosticado un médico una enfermedad cardíaca, recomendándote que solo hagas actividad física supervisada por personal sanitario?',
        answer: false,
      },
      {
        question: '¿Sufres dolor en el pecho cuando realizas actividad física?',
        answer: true,
      },
      {
        answer: true,

        question: '¿Has notado dolor en el pecho durante el último mes mientras estabas en reposo?',
      },
      {
        answer: true,
        question:
          '¿Has perdido la consciencia o el equilibrio después de notar sensación de mareo?',
      },
      {
        answer: false,
        question:
          '¿Tienes alguna alteración ósea o articular que podría agravarse con la actividad física?',
      },
      {
        question:
          '¿Alguna vez te ha recetado el médico algún fármaco para la presión arterial u otro problema cardiocirculatorio?',
        answer: false,
      },
      {
        question:
          '¿Tienes conocimiento, por experiencia propia, o debido al consejo de algún médico, de cualquier otra razón física que te impida hacer ejercicio sin supervisión médica?',
        answer: true,
      },
    ],
    trainerId: '',
    tasks: [],
  },
]

export const populateTestClients = (clients: Client[]) => {
  const promises = clients.map((c) => addDoc(clientsRef, c))
  return Promise.all(promises).then(console.log).catch(console.error)
}

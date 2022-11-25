import { DocumentReference } from 'firebase/firestore'
import { HealthFormQuestion } from '../components/Pages/ClientActivation/types'
import { GeneralTask } from './task'

export type Clients = Array<Client>

export interface Client {
  name: string
  lastname: string
  email: string
  trainerId: string
  password: string
  gender: string
  objective: string
  birthDate: string
  weight: number
  height: number
  healthFormQuestions: HealthFormQuestion[]
  tasks: GeneralTask[]
  id?: string
  ref?: DocumentReference<Client>
}

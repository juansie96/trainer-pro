export interface ClientActivationForm {
  name: string
  lastname: string
  email: string
  password: string
  gender: string
  objective: string
  birthDate: Date
  weight: number
  height: number
  healthFormQuestions: Array<HealthFormQuestion>
}

export interface HealthFormQuestion {
  question: string
  answer: boolean | null
}

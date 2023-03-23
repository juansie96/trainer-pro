export type IMetrics = {
  date: string
  id?: string
  userId: string
  values: UserMetrics
}

export interface UserMetrics {
  weight?: string
  chest?: string
  fat?: string
  neck?: string
  shoulders?: string
  biceps?: string
  forearm?: string
  waist?: string
  hip?: string
  thigh?: string
  calf?: string
  id?: string
}

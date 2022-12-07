import { Clients } from '../../../types/client'
import { GeneralTask } from '../../../types/task'

export type ClientTask = GeneralTask & { clientName: string; clientId: string }

export interface HomeSectionProps {
  clients?: Clients
  tasks?: ClientTask[]
  loading: boolean
  title: string
  fallbackMsg: string
}

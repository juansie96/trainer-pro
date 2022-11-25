import { Clients } from '../../../types/client'

export interface HomeSectionProps {
  clients: Clients
  loading: boolean
  title: string
  fallbackMsg: string
}

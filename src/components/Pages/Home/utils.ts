import { Clients } from '../../../types/client'

export const getClientsWithoutTasks = (clients: Clients) => {
  return clients.filter((c) => {
    const hasFutureTask = !c.tasks.some((t) => new Date(t.date) > new Date())
    return hasFutureTask
  })
}

import { Clients } from '../../../types/client'
import { ClientTask } from './types'

export const getClientsWithoutTasks = (clients: Clients) => {
  return clients.filter((c) => {
    const hasFutureTask = !c.tasks?.some((t) => new Date(t.date) > new Date())
    return hasFutureTask
  })
}

export const getRecentlyCompletedTasks = (clients: Clients): ClientTask[] => {
  let tasks: ClientTask[] = []
  clients.forEach((c) => {
    if (!c.tasks) return
    tasks = [
      ...tasks,
      ...c.tasks
        .filter((t) => t.completed)
        .map((t) => {
          return { ...t, clientName: c.name + ' ' + c.lastname, clientId: c.id } as ClientTask
        }),
    ]
  })
  console.log('tasks', tasks)
  return tasks.sort((a, b) => b.completed.date.getTime() - a.completed.date.getTime())
}

// In the last 7 days
export const getClientsWithNoCompletedTasks = (clients: Clients) => {
  const today = new Date()
  const sevenDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)

  return clients.filter((c) => {
    const hasNonCompletedTasks = c.tasks?.some((t) => {
      const taskDate = new Date(t.date)
      return taskDate > sevenDaysAgo && taskDate < today && !t.completed
    })
    return hasNonCompletedTasks
  })
}

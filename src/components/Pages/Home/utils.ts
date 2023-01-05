import { Clients } from '../../../types/client'
import { getDayName, getFormattedHour, getMonthName } from '../../../utils'
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
        .filter((t) => t.completed.value && daysPassedSince(new Date(t.completed.date)) < 60)
        .map((t) => {
          return { ...t, clientName: c.name + ' ' + c.lastname, clientId: c.id } as ClientTask
        }),
    ]
  })
  return tasks.sort((a, b) =>
    a.completed.date < b.completed.date ? -1 : a.completed.date > b.completed.date ? 1 : 0,
  )
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

export const getFormattedDate = (dateISO: string) => {
  const date = new Date(dateISO)
  const dayName = getDayName(date)
  const monthDay = date.getDate()
  const monthName = getMonthName(date)
  const hour = getFormattedHour(date)
  return `${dayName}, ${monthDay} ${monthName.substring(0, 3)} - ${hour}`
}

const daysPassedSince = (date: Date) => {
  return Math.round((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
}

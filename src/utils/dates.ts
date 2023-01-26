import dayjs from 'dayjs'

export const getFormattedDate = (dateISO: string) => {
  const date = new Date(dateISO)
  const dayName = getDayName(date)
  const monthDay = date.getDate()
  const monthName = getMonthName(date)
  const hour = getFormattedHour(date)
  return `${dayName}, ${monthDay} ${monthName.substring(0, 3)} - ${hour}`
}

export const daysPassedSince = (date: Date) => {
  return Math.round((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
}

export const getDayName = (date: Date) => {
  return date.toLocaleDateString('default', { weekday: 'long' })
}

export const getMonthName = (date: Date) => {
  return date.toLocaleString('default', { month: 'long' })
}

export const getMonthNameByNumber = (monthNumber: number) =>
  [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ][monthNumber]

export const getFormattedHour = (date: Date) => {
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  return `${hours}:${minutes}`
}

export const getMonth = (month) => {
  const year = dayjs().year()
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day()
  let currCalendarDay = 0 - firstDayOfTheMonth

  const daysMatrix = new Array(5).fill(null).map(() =>
    new Array(7).fill(null).map(() => {
      currCalendarDay++
      return dayjs(new Date(year, month, currCalendarDay))
    }),
  )

  return daysMatrix
}

export const getDateIncreasedByNWeeks = (date: Date, weeks: number) => {
  const newDate = new Date(date)
  const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000
  newDate.setTime(newDate.getTime() + weekInMilliseconds * weeks)
  return newDate
}

export const getDateIncreasedByNDays = (date: Date, days: number) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

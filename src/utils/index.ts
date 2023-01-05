import dayjs from 'dayjs'
import { Exercise } from '../components/Pages/Workouts/Exercises/Exercises'

export const getMonth = (month = dayjs().month()) => {
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

export const translateDayToSpanish = (day: string) => {
  switch (day) {
    case 'Sun':
      return 'Dom'
    case 'Mon':
      return 'Lun'
    case 'Tue':
      return 'Mar'
    case 'Wed':
      return 'Mie'
    case 'Thu':
      return 'Jue'
    case 'Fri':
      return 'Vie'
    case 'Sat':
      return 'Sab'
    default:
      return ''
  }
}

export const videoUrlIsValid = (videoUrl: string) => {
  return /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/.test(
    videoUrl,
  )
}

export const extractVideoID = (videoUrl: string) => {
  if (videoUrl.includes('v=')) {
    const videoId = videoUrl.split('v=')[1]
    const ampersandPosition = videoId.indexOf('&')
    return ampersandPosition !== -1 ? videoId.substring(0, ampersandPosition) : videoId
  } else {
    return ''
  }
}

export function getExerciseImgUrl(exercise: Exercise): string {
  if (exercise.videoUrl && exercise.videoUrl.length > 0) {
    const videoId = extractVideoID(exercise.videoUrl)
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
  } else if (exercise.imgUrls && exercise.imgUrls.length) {
    return exercise.imgUrls[0]
  } else {
    return 'https://reviverestore.org/wp-content/uploads/2017/05/placeholder-image-cropped.jpg'
  }
}

export function mapFirebaseErrorCodeToMsg(errorCode: string): string {
  switch (errorCode) {
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'El nombre de usuario o contraseña es incorrecto'
    case 'auth/email-already-in-use':
      return 'El email ingresado ya se encuentra registrado en el sistema'
    default:
      return 'Ocurrió un error inesperado, por favor intente nuevamente'
  }
}

const objectives = ['gain', 'loss', 'fit'] as const
export type TClientObjectives = typeof objectives[number]

export const CLIENT_OBJECTIVES = {
  loss: { short: 'Definición', long: 'Perder peso, quemar grasa y definir músculo' },
  fit: { short: 'Ponerse en forma', long: 'Ponerme en forma de manera balanceada' },
  gain: { short: 'Volumen y fuerza', long: 'Ganar músculo, volumen y fuerza' },
}

export const getDayName = (date: Date) => {
  return date.toLocaleDateString('default', { weekday: 'long' })
}

export const getMonthName = (date: Date) => {
  return date.toLocaleString('default', { month: 'long' })
}

export const getFormattedHour = (date: Date) => {
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  return `${hours}:${minutes}`
}

export const capitalize = (string: string) => {
  if (string.length < 1) return string
  return string[0].toUpperCase() + string.substring(1)
}

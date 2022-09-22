import { HeadCell } from './types'

export const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    disablePadding: false,
    label: 'Ejercicio',
    align: 'left',
  },
  {
    id: 'sets',
    disablePadding: false,
    label: 'Series',
    align: 'center',
  },
  {
    id: 'objective',
    disablePadding: false,
    label: 'Objetivo',
    align: 'center',
  },
  {
    id: 'rest',
    disablePadding: false,
    label: 'Descanso',
    align: 'center',
  },
]

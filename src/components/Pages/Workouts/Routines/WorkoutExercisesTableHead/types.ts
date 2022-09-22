export interface IProps {
  numSelected: number
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  rowCount: number
}

export interface Data {
  name: string
  sets?: number
  objective?: string
  rest?: number
}

export interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  align: 'center' | 'left' | 'right'
}

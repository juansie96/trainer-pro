export interface IProps {
  numSelected: number
  selected: readonly string[]
  onDeleteClick: (selected: readonly string[]) => void
  // onSupersetClick: (selected: readonly string[]) => void;
}

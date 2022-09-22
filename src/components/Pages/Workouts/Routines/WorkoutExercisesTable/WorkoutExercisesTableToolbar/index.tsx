import { DeleteOutline, FilterList } from '@mui/icons-material'
import { alpha, Button, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { IProps } from './types'

const WorkoutExercisesTableToolbar = (props: IProps) => {
  const { numSelected, onDeleteClick, selected, onSupersetClick } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component='div'>
          {numSelected} ejercicios seleccionados
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant='h6' id='tableTitle' component='div'>
          Ejercicios
        </Typography>
      )}
      {numSelected > 1 && (
        <Button
          variant='contained'
          size='small'
          sx={{ height: '30px', width: '150px', textTransform: 'none' }}
          onClick={() => onSupersetClick(selected)}
        >
          Superserie
        </Button>
      )}
      {numSelected > 0 ? (
        <Tooltip title='Delete' onClick={() => onDeleteClick(selected)}>
          <IconButton>
            <DeleteOutline />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton>
            <FilterList />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

export default WorkoutExercisesTableToolbar

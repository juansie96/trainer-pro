import { Help } from '@mui/icons-material'
import {
  Checkbox,
  styled,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TooltipProps,
  Typography,
  Box,
  tooltipClasses,
} from '@mui/material'
import { headCells } from './data'
import { IProps } from './types'

function WorkoutExercisesTableHead(props: IProps) {
  const { onSelectAllClick, numSelected, rowCount } = props

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            <Box display='flex' alignItems='center'>
              {headCell.label}{' '}
              {headCell.label === 'Objetivo' ? (
                <HtmlTooltip
                  title={
                    <>
                      <Typography color='inherit' variant='caption'>
                        Los objetivos son notas cortas para las repeticiones, el peso, el tiempo, la
                        cadencia, distancia o los ajustes del equipo a utilizar.
                        <br />
                        <br />
                        Ejemplo:
                        <br />
                        - 12,8,6,4 repeticiones
                        <br />
                        - Hasta el fallo con 140kg
                        <br />- 8-12 repeticiones / 45kg, altura de rack 8
                      </Typography>
                    </>
                  }
                >
                  <Help fontSize='small' sx={{ ml: 1 }} />
                </HtmlTooltip>
              ) : null}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default WorkoutExercisesTableHead

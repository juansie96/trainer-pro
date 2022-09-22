import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Workout } from '../../../../types/workout'

export interface WorkoutsTableProps {
  workouts: Workout[]
}

const RoutinesTable = ({ workouts }: WorkoutsTableProps) => (
  <TableContainer component={Paper} sx={{ width: 0.9, mx: 'auto' }}>
    <Table sx={{ minWidth: 650 }} aria-label='workouts table'>
      <TableHead>
        <TableRow>
          <TableCell>Nombre</TableCell>
          <TableCell>Descripción</TableCell>
          <TableCell>Fecha de creación</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {workouts.map((workout) => (
          <TableRow
            key={workout.id}
            sx={{
              cursor: 'pointer',
              '&:last-child td, &:last-child th': { border: 0 },
            }}
          >
            <TableCell component='th' scope='row'>
              {workout.name}
            </TableCell>
            <TableCell>{workout.description}</TableCell>
            <TableCell>06/06/06</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)

export default RoutinesTable

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Workout } from './Routines';

export interface WorkoutsTableProps {
  workouts: Workout[];
}

const RoutinesTable = ({ workouts }: WorkoutsTableProps) => {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} sx={{ width: 0.9, mx: "auto" }}>
      <Table sx={{ minWidth: 650 }} aria-label="workouts table">
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
                cursor: "pointer",
                "&:last-child td, &:last-child th": { border: 0 },
              }}
              onClick={() => navigate(`/dashboard/workout/${workout.id}`)}
            >
              <TableCell component="th" scope="row">
                {workout.name}
              </TableCell>
              <TableCell>Descripción random</TableCell>
              <TableCell>06/06/06</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RoutinesTable
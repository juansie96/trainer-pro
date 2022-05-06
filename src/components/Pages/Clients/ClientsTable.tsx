import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Client } from "./Clients";

export interface ClientsTableProps {
  clients: Client[];
}

export const ClientsTable = ({ clients }: ClientsTableProps) => {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} sx={{ width: 0.9, mx: "auto" }}>
      <Table sx={{ minWidth: 650 }} aria-label="clients table">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Tipo de plan</TableCell>
            <TableCell align="center">Vencimiento</TableCell>
            <TableCell align="center">Cumplimiento semanal</TableCell>
            <TableCell align="center">Cumplimiento mensual</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              sx={{
                cursor: "pointer",
                "&:last-child td, &:last-child th": { border: 0 },
              }}
              onClick={() => navigate(`/dashboard/client/${client.id}`)}
            >
              <TableCell component="th" scope="row">
                {client.name}
              </TableCell>
              <TableCell>Sin plan asignado</TableCell>
              <TableCell align="center">03/11</TableCell>
              <TableCell align="center">100%</TableCell>
              <TableCell align="center">50%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

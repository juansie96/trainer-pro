import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React from "react";
import { Client } from "./Clients";

export interface ClientsTableProps {
  clients: Client[];
  onAddClient(): void;
}

const ClientsTable = ({ clients, onAddClient }: ClientsTableProps) => (
  <TableContainer component={Paper} sx={{ mt: 5, width: 0.9, mx: 'auto' }}>
    <Table sx={{ minWidth: 650 }} aria-label="clients table">
      <TableHead>
        <TableRow>
          <TableCell>Nombre</TableCell>
          <TableCell>Tipo de plan</TableCell>
          <TableCell>Vencimiento</TableCell>
          <TableCell>Cumplimiento semanal</TableCell>
          <TableCell>Cumplimiento mensual</TableCell>
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
          >
            <TableCell component="th" scope="row">
              {client.name}
            </TableCell>
            <TableCell>Full body al fallo</TableCell>
            <TableCell>03/11</TableCell>
            <TableCell>100%</TableCell>
            <TableCell>50%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default ClientsTable;

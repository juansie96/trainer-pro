import React from 'react'
import { Client } from './Clients'

export interface ClientsTableProps {
  clients: Client[];
  onAddClient(): void;
}

const ClientsTable = ({clients, onAddClient}: ClientsTableProps) => {
  return (
    <>
      <div>ClientsTable</div>
      <button onClick={onAddClient}>Agregar cliente</button>
    </>
  )
}

export default ClientsTable
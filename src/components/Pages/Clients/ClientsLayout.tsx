import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Client } from './Clients';
import { CenteredLayout } from '../../UI/CenteredLayout';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { clientsRef } from '../../../firebase/fbRefs';
import { ClientsTable } from './ClientsTable';

export const ClientsLayout = ({
  openAddClientDialog,
}: {
  openAddClientDialog(): void;
}) => {
  const [clients, loading] = useCollectionData(clientsRef);

  const [query, setQuery] = useState('');

  let filteredClients = clients?.slice(0);

  if (query && clients) {
    filteredClients = clients.filter((c) =>
      c.name.toUpperCase().includes(query.toUpperCase())
    );
  }

  return (
    <Box mt={5}>
      <Box display="flex" justifyContent="center" mb={5}>
        <SearchClientInput
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
        />
        <Button
          variant="contained"
          disabled={loading}
          onClick={openAddClientDialog}
        >
          Agregar cliente
        </Button>
      </Box>
      {filteredClients && filteredClients.length > 0 ? (
        <ClientsTable
          clients={filteredClients as Client[]} />
      ) : (
        <CenteredLayout>
          <Typography variant="h5">No se encontró ningun cliente</Typography>
        </CenteredLayout>
      )}
    </Box>
  );
};

const SearchClientInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}): JSX.Element => (
  <TextField
    sx={{ width: 600, mr: 2 }}
    type="text"
    size="small"
    label="Buscar un cliente"
    value={value}
    onChange={onChange}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton aria-label="toggle password visibility">
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

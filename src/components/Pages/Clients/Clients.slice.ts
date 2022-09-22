import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../state/store';

interface Client {
  name: string;
  lastname: string;
  email: string;
  age: number;
}

interface ClientsState {
  clients: Client[] | null;
}


const initialState: ClientsState = {
  clients: null
}

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    addNewClient(state, action: PayloadAction<Client>) {
      if (state.clients) {
        state.clients.push(action.payload)
      } else {
        state.clients = [action.payload]
      }
    }
  }
});

export const selectClients = (state: RootState) => state.clients

export const { addNewClient } = clientsSlice.actions;

export default clientsSlice.reducer;
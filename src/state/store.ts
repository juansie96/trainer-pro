import {
  configureStore,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import counterSlice from '../features/counter/counterSlice';
import appSlice from '../components/App/App.slice';
import clientsSlice from '../components/Pages/Clients/Clients.slice';
import { clientsApi } from '../components/Pages/Clients/Clients.api';

export const store = configureStore({
  reducer: {
    counter: counterSlice, // Delete later
    app: appSlice,
    clients: clientsSlice,
    [clientsApi.reducerPath]: clientsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(clientsApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterSlice from '../features/counter/counterSlice';
import appSlice from '../components/App/App.slice';

export const store = configureStore({
  reducer: {
    counter: counterSlice, // Delete later
    app: appSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

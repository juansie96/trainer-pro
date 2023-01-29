import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import appSlice from '../redux/slices/App.slice'
import clientSlice from '../redux/slices/Client.slice'
import trainerSlice from '../redux/slices/Trainer.slice'
export const store = configureStore({
  reducer: {
    app: appSlice,
    trainer: trainerSlice,
    client: clientSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

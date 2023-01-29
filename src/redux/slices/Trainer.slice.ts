import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../state/store'

export interface TrainerState {
  id?: string
  name?: string
  lastname?: string
  email?: string
}

const initialState: TrainerState = {
  id: '',
  email: '',
  name: '',
  lastname: '',
}

const trainerSlice = createSlice({
  name: 'trainer',
  initialState,
  reducers: {
    userLoggedIn(_, action: PayloadAction<TrainerState>) {
      return action.payload
    },
    userLoggedOut() {
      return {
        id: '',
        email: '',
        name: '',
        lastname: '',
      }
    },
  },
})

export const selectTrainer = (state: RootState) => state.trainer

export const { userLoggedIn, userLoggedOut } = trainerSlice.actions

export default trainerSlice.reducer

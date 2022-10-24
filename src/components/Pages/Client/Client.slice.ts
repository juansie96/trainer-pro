import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../../state/store'
import { HealthFormQuestion } from '../ClientActivation/types'

export interface ClientState {
  name: string
  lastname: string
  email: string
  password: string
  gender: string
  objective: string
  birthDate: Date | string
  weight: number
  height: number
  healthFormQuestions: Array<HealthFormQuestion>
}

type SliceState = ClientState | null

const initialState: SliceState = null as SliceState

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clientDataRetrieved(state, action: PayloadAction<ClientState>) {
      return action.payload
    },
  },
})

export const selectClient = (state: RootState) => state.client

export const { clientDataRetrieved } = clientSlice.actions

export default clientSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../../state/store'
import { Client } from '../../../types/client'
import { CardioTask, GeneralTask } from '../../../types/task'

type SliceState = Client | null

const initialState: SliceState = null as SliceState

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clientDataRetrieved(state, action: PayloadAction<Client>) {
      return action.payload
    },
    taskAdded(state, action: PayloadAction<GeneralTask>) {
      return state ? { ...state, tasks: [...state.tasks, action.payload] } : null
    },
    cardioTaskModified(state, action: PayloadAction<CardioTask>) {
      return state
        ? {
            ...state,
            tasks: state.tasks.map((t) =>
              t.type === 'cardio' && t.id === action.payload.id ? action.payload : t,
            ),
          }
        : null
    },
    tasksChanged(state, action: PayloadAction<GeneralTask[]>) {
      return state ? { ...state, tasks: action.payload } : null
    },
  },
})

export const selectClient = (state: RootState) => state.client

export const { clientDataRetrieved, taskAdded, tasksChanged, cardioTaskModified } =
  clientSlice.actions

export default clientSlice.reducer

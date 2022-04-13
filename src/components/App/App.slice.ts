import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../state/store";
import { UserData } from "../../types/user";

interface AppState {
  user: UserData | null;
}

const initialState: AppState = {
  user: null
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    loadUserIntoApp: {
      reducer(state, action: PayloadAction<UserData>) {
        state.user = action.payload;
      },
      prepare(resp: any) {
        const userData = {
          id: resp.user.uid,
          email: resp.user.email,
          emailVerified: resp.user.emailVerified,
          createdAt: resp.user.metadata.createdAt,
          accessToken: resp._tokenResponse.idToken,
          refreshToken: resp._tokenResponse.refreshToken
        }

        return { payload: userData };
      }
    },
    logoutUser(state) {
      console.log("getting executed")
      state.user = null;
    }
  }
})

// Export Slice
export default appSlice.reducer;

// Export action
export const { loadUserIntoApp, logoutUser } = appSlice.actions;

export const selectLoggedInUser = (state: RootState) => state.app.user;
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { registerUserFB } from "../../../api/fbAuthApi";
// // import { GenericErrors } from "../../../types/error";

// export interface RegisterState {
//     user: UserForRegistration;
//     signingUp: boolean;
//     errors: any;
//     // errors: GenericErrors;  // Use it only if the benefits are understood
// }

// const initialState: RegisterState = {
//     signingUp: false,
//     errors: null
// }

// /* ------------- SLICE -------------- */

// const registerSlice = createSlice({
//     name: 'register',
//     initialState,
//     reducers: {
//         startSigningUp: (state) => {
//             state.signingUp = true;
//         },
//     },
//     extraReducers: (builder) => {
//         builder.addCase(registerUser.fulfilled, (state, action) => {
//         })
//     }
// });

// export const { startSigningUp } = registerSlice.actions;

// export default registerSlice.reducer;

export {}

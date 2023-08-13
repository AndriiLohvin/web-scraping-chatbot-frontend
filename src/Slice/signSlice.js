import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthorized : false,
    user : {},
  },
  reducers: {
    setAuthorized(state, action){
      state.isAuthorized = true;
      state.user = action.payload.user;
    },
    unAuthorized(state){
      state.isAuthorized = false;
    }
  }
})

export const { setAuthorized, unAuthorized } = authSlice.actions
export default authSlice.reducer
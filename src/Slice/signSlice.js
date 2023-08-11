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
    
  }
})

export const { setAuthorized } = authSlice.actions
export default authSlice.reducer
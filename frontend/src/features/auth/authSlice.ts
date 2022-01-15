import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
  },
  reducers: {
    updateToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { updateToken } = authSlice.actions;

export default authSlice.reducer;

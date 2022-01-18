import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import workoutReducer from "./features/workoutSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workouts: workoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

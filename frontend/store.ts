import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import workoutReducer from "./features/workoutSlice";
import exerciseReducer from "./features/exerciseSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workouts: workoutReducer,
    exercises: exerciseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

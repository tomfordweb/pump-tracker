import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import workoutReducer from "./features/workoutSlice";
import exerciseReducer from "./features/exerciseSlice";
import mesocycleReducer from "./features/mesocycleSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workouts: workoutReducer,
    exercises: exerciseReducer,
    plans: mesocycleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

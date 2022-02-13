import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";

import { generateJwtHeaders, getFromApi, postJsonToApi } from "../client";
import { RootState } from "../store";
import { Exercise } from "./exerciseSlice";

interface WorkoutsState {
  workouts: Workout[];
}
const initialState: WorkoutsState = {
  workouts: [],
};

interface WorkoutBase {
  name: string;
  description: string;
  is_public: boolean;
}

export interface WorkoutCreate extends WorkoutBase {}

export interface Workout extends WorkoutBase {
  id: number;
  exercises: Exercise[];
}

export const workoutSlice = createSlice({
  name: "workouts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllWorkouts.fulfilled, (state, { payload }) => {
      const { workouts } = state;
      var existingIds = new Set(workouts.map((d) => d.id));
      var merged = [
        ...workouts,
        ...payload.filter((d) => !existingIds.has(d.id)),
      ];

      state.workouts = merged;
    });

    builder.addCase(createNewWorkout.fulfilled, (state, { payload }) => {
      state.workouts.push(payload);
    });

    builder.addCase(getWorkoutById.fulfilled, (state, { payload }) => {
      if (state.workouts.filter((workout) => workout.id == payload.id)[0]) {
        state.workouts = state.workouts.map((existingWorkout) => {
          if (existingWorkout.id == payload.id) {
            return payload;
          }
          return existingWorkout;
        });
      } else {
        state.workouts.push(payload);
      }
    });
  },
});

export const createNewWorkout = createAsyncThunk<
  Workout,
  {
    workout: WorkoutCreate;
    token: string;
  },
  { rejectValue: boolean }
>("workouts/create", async ({ workout, token }, { rejectWithValue }) => {
  try {
    return await postJsonToApi(
      "/workouts",
      workout,
      generateJwtHeaders(token)
    ).then((data) => data.json());
  } catch (err) {
    return rejectWithValue(false);
  }
});

export const getAllWorkouts = createAsyncThunk<
  Workout[],
  {
    token: string;
  },
  { rejectValue: boolean }
>("workouts/get-list", async ({ token }, { rejectWithValue }) => {
  try {
    return await getFromApi("/workouts", generateJwtHeaders(token)).then(
      (data) => data.json()
    );
  } catch (err) {
    return rejectWithValue(false);
  }
});

export const getWorkoutById = createAsyncThunk<
  Workout,
  {
    workout: number;
    token: string;
  },
  { rejectValue: boolean }
>("workouts/get", async ({ workout, token }, { rejectWithValue }) => {
  try {
    if (isNaN(workout)) {
      return rejectWithValue(false);
    }
    const workoutApi = await getFromApi(
      `/workouts/${workout}`,
      generateJwtHeaders(token)
    ).then((data) => data.json());

    const exercisesApi = await getFromApi(
      `/workouts/${workout}/exercises`,
      generateJwtHeaders(token)
    ).then((data) => data.json());
    return {
      ...workoutApi,
      exercises: exercisesApi,
    };
  } catch (err) {
    return rejectWithValue(false);
  }
});

export const selectWorkouts = (state: RootState) => state.workouts.workouts;
const selectWorkoutsId = (state: RootState, workoutId: number) => workoutId;

export const selectWorkoutById = createSelector(
  [selectWorkouts, selectWorkoutsId],
  (workouts, workoutId) =>
    workouts.filter((workout) => workout.id == workoutId)[0]
);

export default workoutSlice.reducer;

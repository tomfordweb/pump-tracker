import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";

import { generateJwtHeaders, getFromApi, postJsonToApi } from "../client";
import { RootState } from "../store";

interface ExerciseState {
  exercises: Exercise[];
}

export interface ExerciseBase {
  name: string;
  avatar_id: number;
  date_updated: string;
  description: string;
  date_created: string;
  owner_id: number;
}

export interface ExerciseCreate extends ExerciseBase {}

export interface Exercise extends ExerciseBase {
  id: number;
}
const initialState: ExerciseState = {
  exercises: [],
};

export const exerciseSlice = createSlice({
  name: "exercises",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllExercises.fulfilled, (state, { payload }) => {
      const { exercises } = state;
      var existingIds = new Set(exercises.map((d) => d.id));
      var merged = [
        ...exercises,
        ...payload.filter((d) => !existingIds.has(d.id)),
      ];

      state.exercises = merged;
    });

    builder.addCase(createNewExercise.fulfilled, (state, { payload }) => {
      state.exercises.push(payload);
    });

    builder.addCase(getExerciseById.fulfilled, (state, { payload }) => {
      if (state.exercises.filter((exercise) => exercise.id == payload.id)[0]) {
        state.exercises = state.exercises.map((exisingExercise) => {
          if (exisingExercise.id == payload.id) {
            return payload;
          }
          return exisingExercise;
        });
      } else {
        state.exercises.push(payload);
      }
    });
  },
});

export const createNewExercise = createAsyncThunk<
  Exercise,
  {
    exercise: ExerciseCreate;
    token: string;
  },
  { rejectValue: boolean }
>("exercises/create", async ({ exercise, token }, { rejectWithValue }) => {
  try {
    return await postJsonToApi(
      "/exercises",
      exercise,
      generateJwtHeaders(token)
    ).then((data) => data.json());
  } catch (err) {
    return rejectWithValue(false);
  }
});

export const getAllExercises = createAsyncThunk<
  Exercise[],
  {
    token: string;
  },
  { rejectValue: boolean }
>("exercises/get-list", async ({ token }, { rejectWithValue }) => {
  try {
    return await getFromApi("/exercises", generateJwtHeaders(token)).then(
      (data) => data.json()
    );
  } catch (err) {
    return rejectWithValue(false);
  }
});

export const getExerciseById = createAsyncThunk<
  Exercise,
  {
    exercise: number;
    token: string;
  },
  { rejectValue: boolean }
>("exercises/get", async ({ exercise, token }, { rejectWithValue }) => {
  try {
    if (isNaN(exercise)) {
      return rejectWithValue(false);
    }
    return await getFromApi(
      `/exercises/${exercise}`,
      generateJwtHeaders(token)
    ).then((data) => data.json());
  } catch (err) {
    return rejectWithValue(false);
  }
});

export const selectExercises = (state: RootState) => state.exercises.exercises;

const selectExercisesId = (state: RootState, exerciseId: number) => exerciseId;

export const selectExerciseById = createSelector(
  [selectExercises, selectExercisesId],
  (exercises, exerciseId) =>
    exercises.filter((exercise) => exercise.id == exerciseId)[0]
);

export default exerciseSlice.reducer;

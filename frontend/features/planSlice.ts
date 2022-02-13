import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";

import { generateJwtHeaders, getFromApi, postJsonToApi } from "../client";
import { RootState } from "../store";

interface WorkoutPlanState {
  plans: WorkoutPlan[];
}

export interface WorkoutPlanBase {
  name: string;
  description: string;
}

export interface WorkoutPlanCreate extends WorkoutPlanBase {}

export interface WorkoutPlan extends WorkoutPlanBase {
  id: number;
  avatar_id: number;
  owner_id: number;
}

const initialState: WorkoutPlanState = {
  plans: [],
};

export const workoutPlanSlice = createSlice({
  name: "workoutPlans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllWorkoutPlans.fulfilled, (state, { payload }) => {
      const { plans } = state;
      var existingIds = new Set(plans.map((d) => d.id));
      var merged = [...plans, ...payload.filter((d) => !existingIds.has(d.id))];

      state.plans = merged;
    });

    builder.addCase(createNewWorkoutPlan.fulfilled, (state, { payload }) => {
      state.plans.push(payload);
    });

    builder.addCase(getWorkoutPlanById.fulfilled, (state, { payload }) => {
      if (state.plans.filter((plan) => plan.id == payload.id)[0]) {
        state.plans = state.plans.map((existingPlan) => {
          if (existingPlan.id == payload.id) {
            return payload;
          }
          return existingPlan;
        });
      } else {
        state.plans.push(payload);
      }
    });
  },
});

export const createNewWorkoutPlan = createAsyncThunk<
  WorkoutPlan,
  {
    plan: WorkoutPlanCreate;
    token: string;
  },
  { rejectValue: boolean }
>("workout-plans/create", async ({ plan, token }, { rejectWithValue }) => {
  try {
    return await postJsonToApi(
      "/microcycles",
      plan,
      generateJwtHeaders(token)
    ).then((data) => data.json());
  } catch (err) {
    return rejectWithValue(false);
  }
});

export const getAllWorkoutPlans = createAsyncThunk<
  WorkoutPlan[],
  {
    token: string;
  },
  { rejectValue: boolean }
>("workout-plans/get-list", async ({ token }, { rejectWithValue }) => {
  try {
    return await getFromApi("/microcycles", generateJwtHeaders(token)).then(
      (data) => data.json()
    );
  } catch (err) {
    return rejectWithValue(false);
  }
});

export const getWorkoutPlanById = createAsyncThunk<
  WorkoutPlan,
  {
    plan: number;
    token: string;
  },
  { rejectValue: boolean }
>("workout-plans/get", async ({ plan, token }, { rejectWithValue }) => {
  try {
    if (isNaN(plan)) {
      return rejectWithValue(false);
    }
    return await getFromApi(
      `/microcycles/${plan}`,
      generateJwtHeaders(token)
    ).then((data) => data.json());
  } catch (err) {
    return rejectWithValue(false);
  }
});

export const selectWorkoutPlans = (state: RootState) => state.plans.plans;

const selectWorkoutPlanId = (state: RootState, planId: number) => planId;

export const selectWorkoutPlanById = createSelector(
  [selectWorkoutPlans, selectWorkoutPlanId],
  (plans, workoutPlanId) => plans.filter((plan) => plan.id == workoutPlanId)[0]
);

export default workoutPlanSlice.reducer;

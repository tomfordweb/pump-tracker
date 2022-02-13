import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";

import {
  deleteFromApi,
  generateJwtHeaders,
  getFromApi,
  postJsonToApi,
} from "../client";
import { RootState } from "../store";

interface WorkoutPlanState {
  plans: WorkoutPlan[];
}

export interface MicrocycleSession {
  microcycle_id: number;
  workout_id: number;
  microcycle_index: number;
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
  length_in_days: number;
  date_created: string;
  date_updated: string;
  sessions: MicrocycleSession[];
}

const initialState: WorkoutPlanState = {
  plans: [],
};

export const workoutPlanSlice = createSlice({
  name: "workoutPlans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      addWorkoutSessionToMicrocycle.fulfilled,
      (state, { payload }) => {
        console.log("added", payload);
        state.plans = state.plans.map((plan) => {
          if (plan.id == payload.id) {
            plan.sessions = payload.data;
          }
          return plan;
        });
      }
    );
    builder.addCase(
      removeWorkoutSessionFromMicrocycle.fulfilled,
      (state, { payload }) => {
        console.log("removed", payload);
        state.plans = state.plans.map((plan) => {
          if (plan.id == payload.id) {
            plan.sessions = payload.data;
          }
          return plan;
        });
      }
    );
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

export const addWorkoutSessionToMicrocycle = createAsyncThunk<
  { id: number; data: MicrocycleSession[] },
  { session: MicrocycleSession; token: string },
  { rejectValue: boolean }
>(
  "microcycle/add-workout-session",
  async ({ token, session }, { rejectWithValue }) => {
    try {
      // add it
      await postJsonToApi(
        `/microcycles/${session.microcycle_id}/${session.workout_id}`,
        session,
        generateJwtHeaders(token)
      ).then((data) => data.json());
      // return a list of microcycle sessions
      const data = await getFromApi(
        `/microcycles/${session.microcycle_id}/sessions`,
        generateJwtHeaders(token)
      ).then((data) => data.json());
      return {
        id: session.microcycle_id,
        data,
      };
    } catch (err) {
      return rejectWithValue(false);
    }
  }
);

export const removeWorkoutSessionFromMicrocycle = createAsyncThunk<
  { id: number; data: MicrocycleSession[] },
  { session: MicrocycleSession; token: string },
  { rejectValue: boolean }
>(
  "microcycle/remove-workout-session",
  async ({ token, session }, { rejectWithValue }) => {
    try {
      // delete it
      await deleteFromApi(
        `/microcycles/${session.microcycle_id}/${session.workout_id}/${session.microcycle_index}`,
        generateJwtHeaders(token)
      ).then((data) => data.json());

      // return a list of microcycle sessions
      const data = await getFromApi(
        `/microcycles/${session.microcycle_id}/sessions`,
        generateJwtHeaders(token)
      ).then((data) => data.json());

      return {
        id: session.microcycle_id,
        data,
      };
    } catch (err) {
      return rejectWithValue(false);
    }
  }
);

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

    const microcycle_base = await getFromApi(
      `/microcycles/${plan}`,
      generateJwtHeaders(token)
    ).then((data) => data.json());

    const microcycle_sessions = await getFromApi(
      `/microcycles/${plan}/sessions`,
      generateJwtHeaders(token)
    ).then((data) => data.json());

    return {
      ...microcycle_base,
      sessions: microcycle_sessions,
    };
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

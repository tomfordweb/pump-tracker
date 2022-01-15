import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { AppHttpError, postJsonToApi } from "../../apiClient";

export interface UserCreate {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

interface ValidationErrors {
  errorMessage: string;
  field_errors: Record<string, string>;
}

interface AuthState {
  error: ValidationErrors | null | undefined;
  token: string | null;
  user: UserState | null;
}

interface UserState {
  username: string;
  email: string;
  id: number;
  full_name: string;
}

const initialState: AuthState = {
  error: null,
  token: null,
  user: null,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createAccount.fulfilled, (state, { payload }) => {
      state.user = payload;
    });

    builder.addCase(createAccount.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export const { updateToken } = authSlice.actions;

// export const createAccount = createAsyncThunk<{UserCreate, { id: string } &
// Partial<UserCreate>, { rejectValue: ValidationErrors } }, >("account/create",
// async (payload: any) => {
//   return Client.post("/api/v1/users", payload);
// });

export const createAccount = createAsyncThunk<
  UserState,
  UserCreate,
  { rejectValue: ValidationErrors }
>("users/update", async (userData, { rejectWithValue }) => {
  try {
    const response = await postJsonToApi("/users", userData).then((data) =>
      data.json()
    );
    return response;
  } catch (err) {
    let error = err as AppHttpError;
    return rejectWithValue(error.data);
  }
});

export default authSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useCookies } from "react-cookie";

import {
  AppHttpError,
  generateJwtHeaders,
  getFromApi,
  postFormDataToApi,
  postJsonToApi,
} from "../../client";

import { RootState } from "../../store";

export interface TokenCreate {
  username: string;
  password: string;
  grant_type?: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
}

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
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createAccount.fulfilled, (state, { payload }) => {
      state.user = payload;
    });

    builder.addCase(createAccount.rejected, (state, action) => {
      state.error = action.payload;
    });

    builder.addCase(authHealthcheck.fulfilled, (state, { payload }) => {
      const { token, ...everythingElse } = payload;
      state.user = everythingElse;
      state.token = token;
    });

    builder.addCase(authHealthcheck.rejected, (state, action) => {
      state.user = null;
      state.token = null;
    });

    builder.addCase(loginToAccount.fulfilled, (state, { payload }) => {
      state.token = payload.access_token;
    });

    builder.addCase(loginToAccount.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export const { logout } = authSlice.actions;

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

export const authHealthcheck = createAsyncThunk<
  UserState & { token: string },
  string | null,
  { rejectValue: boolean }
>("users/healthcheck", async (token, { rejectWithValue }) => {
  try {
    if (!token) {
      return rejectWithValue(false);
    }
    return await getFromApi("/users/me", generateJwtHeaders(token))
      .then((data) => data.json())
      .then((data) => ({ ...data, token }));
  } catch (err) {
    return rejectWithValue(false);
  }
});

export const loginToAccount = createAsyncThunk<
  { access_token: string; token_type: string },
  TokenCreate,
  { rejectValue: ValidationErrors }
>("users/authenticate", async (credentials, { rejectWithValue }) => {
  try {
    return await postFormDataToApi("/token", credentials).then((data) =>
      data.json()
    );
  } catch (err) {
    let error = err as AppHttpError;
    return rejectWithValue(error.data);
  }
});

export const selectToken = (state: RootState) => state.auth.token || "";

export default authSlice.reducer;

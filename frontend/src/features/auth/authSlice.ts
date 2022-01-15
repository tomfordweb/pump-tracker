import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { postJsonToApi } from "../../apiClient";

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
  token: string | null;
}

interface CreateUserResponse {
  username: string;
  email: string;
  id: number;
  full_name: string;
}

const initialState: AuthState = {
  token: null,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { updateToken } = authSlice.actions;

// export const createAccount = createAsyncThunk<{UserCreate, { id: string } &
// Partial<UserCreate>, { rejectValue: ValidationErrors } }, >("account/create",
// async (payload: any) => {
//   return Client.post("/api/v1/users", payload);
// });

export const createAccount = createAsyncThunk<
  CreateUserResponse,
  { id: string } & Partial<UserCreate>,
  { rejectValue: ValidationErrors }
>("users/update", async (userData, { rejectWithValue }) => {
  try {
    const { id, ...fields } = userData;
    const response = await postJsonToApi<CreateUserResponse>("/users", fields);
    return response;
  } catch (err) {
    console.error(err);
    // // let error: AxiosError<ValidationErrors> = err; // cast the error
    // for access if (!error.response) {
    //   throw err;
    // }
    // We got validation errors, let's return those so we can reference in
    // our component and set form errors
    return rejectWithValue({
      errorMessage: "foo",
      field_errors: { foo: "bar" },
    });
  }
});

export default authSlice.reducer;

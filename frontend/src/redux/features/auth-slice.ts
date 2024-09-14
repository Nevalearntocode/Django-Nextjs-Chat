import { createSlice } from "@reduxjs/toolkit";

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
};

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  accessToken: null,
} as AuthState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action: { payload: AuthState["accessToken"] }) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    setLogout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
    },
    setAccessToken: (state, action: { payload: AuthState["accessToken"] }) => {
      state.accessToken = action.payload;
    },
    clearAccessToken: (state) => {
      state.accessToken = null;
    },
    setIsloading: (state, action: { payload: AuthState["isLoading"] }) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLogin, setLogout, setIsloading, setAccessToken, clearAccessToken } =
  authSlice.actions;

export default authSlice;

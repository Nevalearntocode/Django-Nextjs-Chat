import { configureStore } from "@reduxjs/toolkit";
import { serverSlice } from "./features/server-slice";

export const store = configureStore({
  reducer: {
    [serverSlice.reducerPath]: serverSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(serverSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

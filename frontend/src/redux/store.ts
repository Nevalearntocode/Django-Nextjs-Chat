import { configureStore } from "@reduxjs/toolkit";
import { categorySlice } from "./features/category-slice";
import { serverSlice } from "./features/server-slice";
import { channelSlice } from "./features/channel-slice";
import { messageSlice } from "./features/message-slice";
import { accountSlice } from "./features/account-slice";
import modal from "./features/modal-slice";
import authSlice from "./features/auth-slice";

export const store = configureStore({
  reducer: {
    modal,
    category: categorySlice.reducer,
    channel: channelSlice.reducer,
    message: messageSlice.reducer,
    auth: authSlice.reducer,
    server: serverSlice.reducer,
    [accountSlice.reducerPath]: accountSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(accountSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

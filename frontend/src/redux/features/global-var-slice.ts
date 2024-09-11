import { createSlice } from "@reduxjs/toolkit";

type GlobalVar = {
  serverName: string;
  channelName: string;
};

const initialState = {
  serverName: "",
  channelName: "",
} as GlobalVar;

const globalVarSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setServerName: (state, action: { payload: GlobalVar["serverName"] }) => {
      state.serverName = action.payload;
    },
    setChannelName: (state, action: { payload: GlobalVar["channelName"] }) => {
      state.channelName = action.payload;
    },
    clearGlobalVar: (state) => {
      state.serverName = "";
      state.channelName = "";
    },
    clearServerName: (state) => {
      state.serverName = "";
    },
    clearChannelName: (state) => {
      state.channelName = "";
    },
  },
});

export const {
  setServerName,
  setChannelName,
  clearGlobalVar,
  clearServerName,
  clearChannelName,
} = globalVarSlice.actions;

export default globalVarSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

export type ModalState = {
  isOpen: boolean;
  type:
    | "mobile-sheet"
    | "login"
    | "register"
    | "change-password"
    | "channel"
    | "category"
    | "server"
    | "server-settings"
    | "server-leave"
    | "server-members"
    | "server-channels"
    | "server-delete"
    | "server-private-join"
    | "invite-link"
    | "delete-message"
    | "edit-channel"
    | null;
  deleteMessageId: string | null;
  editChannelId: string | null;
};

const initialState = {
  isOpen: false,
  type: null,
  deleteMessageId: null,
  editChannelId: null,
} as ModalState;

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: { payload: ModalState["type"] }) => {
      state.isOpen = true;
      state.type = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = null;
    },
    setDeleteMessageId: (
      state,
      action: { payload: ModalState["deleteMessageId"] },
    ) => {
      state.deleteMessageId = action.payload;
    },
    clearDeleteMessageId: (state) => {
      state.deleteMessageId = null;
    },
    setEditChannelId: (
      state,
      action: { payload: ModalState["editChannelId"] },
    ) => {
      state.editChannelId = action.payload;
    },
    clearEditChannelId: (state) => {
      state.editChannelId = null;
    },
  },
});

export const {
  openModal,
  closeModal,
  setDeleteMessageId,
  clearDeleteMessageId,
  setEditChannelId,
  clearEditChannelId,
} = modalSlice.actions;
export default modalSlice.reducer;

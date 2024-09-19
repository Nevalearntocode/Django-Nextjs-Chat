import { createSlice } from "@reduxjs/toolkit";

type ModalState = {
  isOpen: boolean;
  type:
    | "category"
    | "mobile-sheet"
    | "login"
    | "register"
    | "delete-message"
    | "change-password"
    | "server"
    | "channel"
    | null;
  deleteMessageId: string | null;
};

const initialState = {
  isOpen: false,
  type: null,
  deleteMessageId: null,
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
  },
});

export const {
  openModal,
  closeModal,
  setDeleteMessageId,
  clearDeleteMessageId,
} = modalSlice.actions;
export default modalSlice.reducer;

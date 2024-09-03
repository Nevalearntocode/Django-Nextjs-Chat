import { createSlice } from "@reduxjs/toolkit";

type ModalState = {
  isOpen: boolean;
  type: "category" | null;
};

const initialState = {
  isOpen: false,
  type: null,
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
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;

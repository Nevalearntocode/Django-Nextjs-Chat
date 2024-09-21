"use client";

import { closeModal, ModalState } from "@/redux/features/modal-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

type Props = ModalState["type"];

export const useModal = (modalType: Props) => {
  const dispatch = useAppDispatch();
  const { isOpen, type } = useAppSelector((state) => state.modal);
  const isModalOpen = isOpen && type === modalType;
  const onOpenChange = () => {
    dispatch(closeModal());
  };

  return {
    isModalOpen,
    onOpenChange,
  };
};

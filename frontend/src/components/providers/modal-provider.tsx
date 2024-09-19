"use client";

import { useEffect, useState } from "react";
import AddCategoryModal from "../modals/add-category-modal";
import DrawerSheet from "../drawer-sheet";
import RegisterModal from "../modals/register-modal";
import LoginModal from "../modals/login-modal";
import DeleteMessageModal from "../modals/delete-message-modal";
import ChangePasswordModal from "../modals/change-password-modal";
import AddServerModal from "../modals/add-server-modal";
import AddChannelModal from "../modals/add-channel-modal";

export const ModalProvider = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <AddCategoryModal />
      <AddServerModal />
      <AddChannelModal />
      <DrawerSheet />
      <RegisterModal />
      <LoginModal />
      <DeleteMessageModal />
      <ChangePasswordModal />
    </>
  );
};

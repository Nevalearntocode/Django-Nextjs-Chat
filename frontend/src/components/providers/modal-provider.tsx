"use client";

import { useEffect, useState } from "react";
import AddCategoryModal from "../modals/add-category-modal";
import DrawerSheet from "../drawer-sheet";
import RegisterModal from "../modals/register-modal";
import LoginModal from "../modals/login-modal";
import DeleteMessageModal from "../modals/delete-message-modal";

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
      <DrawerSheet />
      <RegisterModal />
      <LoginModal />
      <DeleteMessageModal />
    </>
  );
};

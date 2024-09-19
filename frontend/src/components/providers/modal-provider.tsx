"use client";

import { useEffect, useState } from "react";
import AddCategoryModal from "../modals/add-category-modal";
import DrawerSheet from "../mobile/drawer-sheet";
import RegisterModal from "../modals/register-modal";
import LoginModal from "../modals/login-modal";
import DeleteMessageModal from "../modals/delete-message-modal";
import ChangePasswordModal from "../modals/change-password-modal";
import AddServerModal from "../modals/add-server-modal";
import AddChannelModal from "../modals/add-channel-modal";
import ServerSettingsModal from "../modals/server-settings-modal";
import InviteLinkModal from "../modals/invite-link-modal";

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
      <ServerSettingsModal />
      <InviteLinkModal />
      <DrawerSheet />
      <RegisterModal />
      <LoginModal />
      <DeleteMessageModal />
      <ChangePasswordModal />
    </>
  );
};

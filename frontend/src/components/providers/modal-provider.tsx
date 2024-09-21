"use client";

import { useEffect, useState } from "react";
import LoginModal from "@/components/modals/login-modal";
import DrawerSheet from "@/components/mobile/drawer-sheet";
import RegisterModal from "@/components/modals/register-modal";
import AddServerModal from "@/components/modals/add-server-modal";
import AddChannelModal from "@/components/modals/add-channel-modal";
import InviteLinkModal from "@/components/modals/invite-link-modal";
import AddCategoryModal from "@/components/modals/add-category-modal";
import LeaveServerModal from "@/components/modals/leave-server-modal";
import DeleteServerModal from "@/components/modals/delete-server-modal";
import ManageMembersModal from "@/components/modals/manage-members-modal";
import DeleteMessageModal from "@/components/modals/delete-message-modal";
import ChangePasswordModal from "@/components/modals/change-password-modal";
import ServerSettingsModal from "@/components/modals/server-settings-modal";
import JoinPrivateServerModal from "@/components/modals/join-private-server-modal";
import EditChannelModal from "../modals/edit-channel-modal";

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
      <LoginModal />
      <DrawerSheet />
      <RegisterModal />
      <AddServerModal />
      <AddChannelModal />
      <InviteLinkModal />
      <AddCategoryModal />
      <EditChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <ManageMembersModal />
      <DeleteMessageModal />
      <ServerSettingsModal />
      <ChangePasswordModal />
      <JoinPrivateServerModal />
    </>
  );
};

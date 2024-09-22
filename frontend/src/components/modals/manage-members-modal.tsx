"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useModal } from "@/hooks/use-modal";
import ManageMembers from "../manage-members";

type Props = {};

export default function ManageMembersModal({}: Props) {
  const { isModalOpen, onOpenChange } = useModal("server-members");

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[400px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Manage members</DialogTitle>
          <DialogDescription>Members of this server.</DialogDescription>
        </DialogHeader>
        <ManageMembers />
      </DialogContent>
    </Dialog>
  );
}

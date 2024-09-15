"use client";

import { closeModal } from "@/redux/features/modal-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import useWebSocket from "react-use-websocket";
import { env } from "@/env";
import { usePathname } from "next/navigation";

type Props = {};

export default function DeleteMessageModal({}: Props) {
  const dispatch = useAppDispatch();
  const { deleteMessageId, type, isOpen } = useAppSelector(
    (state) => state.modal,
  );
  const isModalOpen = isOpen && type === "delete-message";
  const pathname = usePathname();
  const channelId = pathname?.split("/")[4];

  const { sendJsonMessage } = useWebSocket(
    `${env.NEXT_PUBLIC_WEBSOCKET_URL}${channelId}/`,
  );

  const onModalClose = () => {
    dispatch(closeModal());
  };

  const onConfirm = () => {
    sendJsonMessage({ type: "delete", message: deleteMessageId });
    onModalClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogOverlay className="opacity-60">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deleting Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message?
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full items-center justify-between">
            <Button className="" variant={`secondary`}>
              Cancel
            </Button>
            <Button className="" variant={`destructive`} onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}

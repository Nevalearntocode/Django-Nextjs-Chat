"use client";

import { useAppSelector } from "@/redux/hooks";
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
import { useModal } from "@/hooks/use-modal";

type Props = {};

export default function DeleteMessageModal({}: Props) {
  const { isModalOpen, onOpenChange } = useModal("delete-message");
  const { deleteMessageId } = useAppSelector((state) => state.modal);
  const pathname = usePathname();
  const channelId = pathname?.split("/")[4];

  const { sendJsonMessage } = useWebSocket(
    `${env.NEXT_PUBLIC_WEBSOCKET_URL}${channelId}/`,
  );

  const onConfirm = () => {
    sendJsonMessage({ type: "delete", message: deleteMessageId });
    onOpenChange();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
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

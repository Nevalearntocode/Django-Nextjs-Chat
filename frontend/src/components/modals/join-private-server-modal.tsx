"use client";

import { closeModal } from "@/redux/features/modal-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useJoinServerMutation } from "@/redux/features/server-slice";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

type Props = {};

export default function JoinPrivateServerModal({}: Props) {
  const [inviteCode, setInviteCode] = useState("");
  const { isOpen, type } = useAppSelector((state) => state.modal);
  const [joinServer, { isLoading }] = useJoinServerMutation();
  const pathname = usePathname();
  const serverId = pathname?.split("/")[2];
  const dispatch = useAppDispatch();
  const isModalOpen = isOpen && type === "server-private-join";
  const onOpenChange = () => {
    dispatch(closeModal());
  };
  const onJoinServer = () => {
    joinServer({ id: serverId, invite_code: inviteCode })
      .unwrap()
      .then(() => {
        dispatch(closeModal());
      })
      .catch((err: any) => {
        if (err.data) {
          if (Array.isArray(err.data)) {
            for (const field in err.data) {
              err.data[field].forEach((errorMessage: string) => {
                toast.error(errorMessage);
              });
            }
          } else {
            toast.error(err.data.detail);
          }
        }
      });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Private Server.</DialogTitle>
          <DialogDescription>Please enter the invite code.</DialogDescription>
        </DialogHeader>
        <Input
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
        <Button onClick={onJoinServer} disabled={isLoading}>
          Confirm
        </Button>
      </DialogContent>
    </Dialog>
  );
}

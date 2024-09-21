"use client";

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
import { useModal } from "@/hooks/use-modal";
import { useServerId } from "@/hooks/use-server-id";

type Props = {};

export default function JoinPrivateServerModal({}: Props) {
  const { isModalOpen, onOpenChange } = useModal("server-private-join");
  const serverId = useServerId();
  const [joinServer, { isLoading }] = useJoinServerMutation();
  const [inviteCode, setInviteCode] = useState("");
  const onJoinServer = () => {
    joinServer({ id: serverId, invite_code: inviteCode })
      .unwrap()
      .then(() => {
        onOpenChange();
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

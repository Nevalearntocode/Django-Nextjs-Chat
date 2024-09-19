"use client";

import { closeModal } from "@/redux/features/modal-slice";
import {
  useGetServerQuery,
  useRollInviteCodeMutation,
  useToggleStatusMutation,
} from "@/redux/features/server-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Dialog } from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { env } from "@/env";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Copy, RefreshCcw } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

type Props = {};

export default function InviteLinkModal({}: Props) {
  const dispatch = useAppDispatch();
  const { isOpen, type } = useAppSelector((state) => state.modal);
  const isModalOpen = isOpen && type === "invite-link";
  const [rollInviteCode] = useRollInviteCodeMutation();
  const [toggleStatus] = useToggleStatusMutation();
  const pathname = usePathname();
  const serverId = pathname.split("/")[2];
  const { data: server } = useGetServerQuery(serverId);
  const [isInviteCodeLoading, setisInviteCodeLoading] = useState(false);
  const [isCopiedLoading, setisCopiedLoading] = useState(false);

  const onOpenChange = () => {
    dispatch(closeModal());
  };

  const onRollInviteCode = () => {
    rollInviteCode(serverId)
      .unwrap()
      .then(() => {
        toast.success("Your invite link has been renewed successfully");
        setisInviteCodeLoading(true);
        setTimeout(() => {
          setisInviteCodeLoading(false);
        }, 15000);
      })
      .catch((err: any) => {
        if (err.data) {
          for (const field in err.data) {
            err.data[field].forEach((errorMessage: string) => {
              toast.error(errorMessage);
            });
          }
        } else {
          console.error(err);
          toast.error("An error occurred while renewing the invite link");
        }
      });
  };

  const onToggleStatus = () => {
    toggleStatus(serverId)
      .unwrap()
      .then(() => {
        toast.success(`Server status has been changed!`);
      })
      .catch((err: any) => {
        if (err.data) {
          for (const field in err.data) {
            err.data[field].forEach((errorMessage: string) => {
              toast.error(errorMessage);
            });
          }
        } else {
          console.error(err);
          toast.error("An error occurred while toggling the server status");
        }
      });
  };

  const onCopyInviteLink = () => {
    navigator.clipboard.writeText(
      `${env.NEXT_PUBLIC_WEBSITE_URL}/join/${server?.invite_code}?serverId=${serverId}`,
    );
    toast.success("Invite link copied to clipboard");
    setisCopiedLoading(true);
    setTimeout(() => {
      setisCopiedLoading(false);
    }, 15000);
  };

  const isInviteLinkDisabled = server?.status === "public";

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite link and server status</DialogTitle>
          <DialogDescription>
            Change your invite code and server status.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="font-semibold">Invite link</p>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={`${env.NEXT_PUBLIC_WEBSITE_URL}/join/${server?.invite_code}?serverId=${serverId}`}
              disabled={isInviteLinkDisabled}
            />
            <div className="flex gap-1">
              <Button
                variant={`outline`}
                size={`icon`}
                className="rounded-full"
                onClick={onCopyInviteLink}
                disabled={isCopiedLoading || isInviteLinkDisabled}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant={`outline`}
                size={`icon`}
                className="rounded-full"
                onClick={onRollInviteCode}
                disabled={isInviteCodeLoading || isInviteLinkDisabled}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-semibold">Server status</p>
            <div className="flex items-center gap-4">
              <p className="text-sm font-light">Private</p>
              <Checkbox
                checked={server?.status === "private"}
                onClick={onToggleStatus}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

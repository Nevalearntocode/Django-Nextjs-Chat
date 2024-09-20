"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closeModal } from "@/redux/features/modal-slice";
import { UserAvatar } from "../user-avatar";
import { Button } from "../ui/button";
import { Ban, ShieldAlert, UserRoundX } from "lucide-react";
import { useGetServerQuery } from "@/redux/features/server-slice";
import { usePathname } from "next/navigation";
import { useGetCurrentUserQuery } from "@/redux/features/account-slice";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type Props = {};

export default function ManageMembersModal({}: Props) {
  const { isOpen, type } = useAppSelector((state) => state.modal);
  const [confirm, setConfirm] = useState<string>("");
  const [actionType, setActionType] = useState<"kick" | "ban" | null>(null);
  const isModalOpen = isOpen && type === "server-members";
  const pathname = usePathname();
  const serverId = pathname.split("/")[2];
  const { data: server } = useGetServerQuery(serverId);
  const { data: user } = useGetCurrentUserQuery();
  const dispatch = useAppDispatch();

  if (!server || !server.members) return null;
  const onOpenChange = () => {
    dispatch(closeModal());
  };

  const onKick = (id: string) => {
    setActionType("kick");
    setConfirm(id);
  };

  const onBan = (id: string) => {
    setActionType("ban");
    setConfirm(id);
  };

  const onConfirm = (id: string) => {};

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[400px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Manage members</DialogTitle>
          <DialogDescription>Members of this server.</DialogDescription>
        </DialogHeader>
        {server.owner === user?.username && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <UserAvatar name={server.owner} />
              <p>Admin</p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={`ghost`}
                    className="rounded-full"
                    size={`icon`}
                  >
                    <ShieldAlert className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="end" side="bottom">
                  <p>Server owner</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        <Separator />
        {server.members.map(
          (member) =>
            member.username !== server.owner && (
              <div className="flex flex-col gap-4" key={member.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <UserAvatar name={member.username} />
                    <p>{member.username}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={`destructive`}
                      size={`icon`}
                      className="rounded-full"
                      onClick={() => onKick(member.id)}
                    >
                      <UserRoundX className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={`destructive`}
                      size={`icon`}
                      className="rounded-full"
                      onClick={() => onBan(member.id)}
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {confirm === member.id && (
                  <div className="flex items-center justify-between">
                    <p>
                      Are you sure you want to {actionType} {member.username}{" "}
                      user?
                    </p>
                    <div className="flex items-center gap-2">
                      <Button variant={`secondary`} size={`icon`}>
                        No
                      </Button>
                      <Button variant={`destructive`} size={`icon`}>
                        Yes
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ),
        )}
      </DialogContent>
    </Dialog>
  );
}

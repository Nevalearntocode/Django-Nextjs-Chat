"use client";

import React, { useState } from "react";
import { UserAvatar } from "./user-avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { Ban, CircleMinus, ShieldAlert, UserRoundX } from "lucide-react";
import { Separator } from "./ui/separator";
import { useServerId } from "@/hooks/use-server-id";
import {
  useBanFromServerMutation,
  useGetServerQuery,
  useKickFromServerMutation,
  useUnbanFromServerMutation,
} from "@/redux/features/server-slice";
import { useGetCurrentUserQuery } from "@/redux/features/account-slice";
import { toast } from "sonner";

type Props = {};

export default function ManageMembers({}: Props) {
  const serverId = useServerId();

  const [confirm, setConfirm] = useState<string>("");
  const [actionType, setActionType] = useState<"kick" | "ban" | "unban" | null>(
    null,
  );
  const { data: server } = useGetServerQuery(serverId);
  const { data: user } = useGetCurrentUserQuery();
  const [kickFromServer] = useKickFromServerMutation();
  const [banFromServer] = useBanFromServerMutation();
  const [unbanFromServer] = useUnbanFromServerMutation();

  if (!server || !server.members) return null;

  const onKick = (id: string) => {
    setActionType("kick");
    setConfirm(id);
  };

  const onBan = (id: string) => {
    setActionType("ban");
    setConfirm(id);
  };

  const onUnban = (id: string) => {
    setActionType("unban");
    setConfirm(id);
  };

  const onConfirm = (id: string) => {
    if (actionType === "kick") {
      kickFromServer({ id: serverId, members: [id] })
        .unwrap()
        .then(() => {
          toast.success(`${actionType} user successfully.`);
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
            toast.error("An error occurred during registration");
          }
        });
    } else if (actionType === "ban") {
      banFromServer({ id: serverId, members: [id] })
        .unwrap()
        .then(() => {
          toast.success(`${actionType} user successfully.`);
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
            toast.error("An error occurred during registration");
          }
        });
    } else if (actionType === "unban") {
      unbanFromServer({ id: serverId, members: [id] })
        .unwrap()
        .then(() => {
          toast.success(`${actionType} user successfully.`);
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
            toast.error("An error occurred during registration");
          }
        });
    }
  };

  return (
    <>
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
      {server.members.length > 1 && (
        <>
          <Separator />
          <p className="text-sm font-semibold">Members</p>
        </>
      )}
      {server.members.map(
        (member) =>
          member.username !== server.owner && (
            <div className="group flex flex-col gap-4" key={member.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <UserAvatar name={member.username} />
                  <p>{member.username}</p>
                </div>
                <div className="hidden gap-2 group-hover:flex">
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
                  <p className="text-xs md:text-base">
                    Are you sure you want to {actionType} {member.username}{" "}
                    user?
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={`secondary`}
                      size={`icon`}
                      onClick={() => setConfirm("")}
                    >
                      No
                    </Button>
                    <Button
                      variant={`destructive`}
                      size={`icon`}
                      onClick={() => onConfirm(member.id)}
                    >
                      Yes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ),
      )}
      {server.banned.length !== 0 && (
        <>
          <Separator />
          <p className="text-sm font-semibold">Banned members</p>
        </>
      )}
      {server.banned.map((member) => (
        <div className="group flex flex-col gap-4" key={member.id}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <UserAvatar name={member.username} />
              <p>{member.username}</p>
            </div>
            <div className="hidden group-hover:block">
              <Button
                variant={`destructive`}
                size={`icon`}
                className="rounded-full"
                onClick={() => onUnban(member.id)}
              >
                <CircleMinus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {confirm === member.id && (
            <div className="flex items-center justify-between">
              <p>
                Are you sure you want to {actionType} {member.username} user?
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant={`secondary`}
                  size={`icon`}
                  onClick={() => setConfirm("")}
                >
                  No
                </Button>
                <Button
                  variant={`default`}
                  size={`icon`}
                  onClick={() => onConfirm(member.id)}
                >
                  Yes
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

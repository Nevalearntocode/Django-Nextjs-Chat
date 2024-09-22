"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { LogOut, MessageCircle, Settings, Trash2, Users2 } from "lucide-react";
import GeneralTooltip from "./tooltips/general-tooltip";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useGetServerQuery } from "@/redux/features/server-slice";
import { useGetCurrentUserQuery } from "@/redux/features/account-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ServerSettingsOption from "./server-settings-option";
import { openModal } from "@/redux/features/modal-slice";

type Props = {};

export default function ServerSettings({}: Props) {
  const pathname = usePathname();
  const serverId = pathname.split("/")[2];
  const dispatch = useAppDispatch();
  const { data: server } = useGetServerQuery(serverId);
  const { data: currentUser } = useGetCurrentUserQuery();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) return null;

  const isOwner = server && server.owner === currentUser?.username;
  const isMember =
    server &&
    server.members &&
    server.members.find((member) => member.id === currentUser?.id);

  const onLeaveServer = () => {
    dispatch(openModal("server-leave"));
  };

  const onManageMembers = () => {
    dispatch(openModal("server-members"));
  };

  const onManageChannels = () => {
    dispatch(openModal("server-channels"));
  };

  const onDeleteServer = () => {
    dispatch(openModal("server-delete"));
  };

  return (
    <div
      className={cn(
        "flex w-full items-center justify-center gap-4 sm:flex-col",
        !serverId && "hidden",
      )}
    >
      {isOwner ? (
        <>
          <ServerSettingsOption>
            <Button className="rounded-full" size={`icon`}>
              <Settings className="h-4 w-4" />
            </Button>
          </ServerSettingsOption>
          <GeneralTooltip name="Channels">
            <Button
              className="rounded-full"
              size={`icon`}
              onClick={onManageChannels}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </GeneralTooltip>
          <GeneralTooltip name="Members">
            <Button
              className="rounded-full"
              size={`icon`}
              onClick={onManageMembers}
            >
              <Users2 className="h-4 w-4" />
            </Button>
          </GeneralTooltip>

          <GeneralTooltip name="Delete">
            <Button
              className="rounded-full"
              size={`icon`}
              variant={`destructive`}
              onClick={onDeleteServer}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </GeneralTooltip>
        </>
      ) : (
        <>
          {isMember && (
            <GeneralTooltip name="Leave">
              <Button
                className="rounded-full"
                size={`icon`}
                variant={`destructive`}
                onClick={onLeaveServer}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </GeneralTooltip>
          )}
        </>
      )}
    </div>
  );
}

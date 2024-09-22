"use client";

import { cn } from "@/lib/utils";
import { useGetChannelsQuery } from "@/redux/features/channel-slice";
import { useRouter } from "next/navigation";
import React from "react";
import { UserAvatar } from "../user-avatar";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useAppDispatch } from "@/redux/hooks";
import { openModal, setEditChannelId } from "@/redux/features/modal-slice";
import useIsOwner from "@/hooks/use-owner";

type Props = {
  serverId: string;
};

export default function MobileChannelList({ serverId }: Props) {
  const { data: channels } = useGetChannelsQuery({
    serverId,
  });
  const isOwner = useIsOwner(serverId);
  const dispatch = useAppDispatch();

  const onOpenEditChannel = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(openModal("edit-channel"));
    dispatch(setEditChannelId(id));
  };

  const router = useRouter();

  return (
    <>
      {channels?.map((channel) => (
        <div
          className={cn(
            "group relative flex w-full cursor-pointer items-center gap-2 rounded-full py-1 hover:bg-muted-foreground/10 md:justify-start md:rounded-lg md:bg-muted-foreground/10 md:p-4 md:hover:bg-muted-foreground/40 lg:gap-4",
            false ? "bg-muted-foreground/10 hover:bg-muted-foreground/40" : "",
          )}
          key={channel.id}
          onClick={() => {
            router.push(`/servers/${serverId}/channels/${channel.id}`);
          }}
        >
          <UserAvatar name={channel.name ?? "else"} />

          <div className={cn("flex-col md:flex")}>
            <p className="line-clamp-1 font-semibold md:text-xs lg:text-lg">
              {channel.topic}
            </p>
            <p className="line-clamp-1 text-xs font-light lg:flex">
              {channel.description}
            </p>
          </div>
          {isOwner && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size={`icon`}
                    className="absolute right-0 top-0 h-6 w-6 rounded-full group-hover:flex"
                    onClick={(e) => onOpenEditChannel(e, channel.id)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Channel</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ))}
    </>
  );
}

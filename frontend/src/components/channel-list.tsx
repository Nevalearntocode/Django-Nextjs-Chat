"use client";

import { cn } from "@/lib/utils";
import { useGetChannelsQuery } from "@/redux/features/channel-slice";
import { useRouter } from "next/navigation";
import React from "react";
import { UserAvatar } from "./user-avatar";

type Props = {
  serverId: string;
};

export default function ChannelList({ serverId }: Props) {
  const { data: channels } = useGetChannelsQuery({
    serverId,
  });
  const router = useRouter();

  return (
    <>
      {channels?.map((channel) => (
        <div
          className={cn(
            "flex w-full cursor-pointer items-center justify-start gap-2 rounded-full py-1 hover:bg-muted-foreground/10 md:rounded-lg md:bg-muted-foreground/10 md:p-4 md:hover:bg-muted-foreground/40 lg:gap-4",
            false ? "bg-muted-foreground/10 hover:bg-muted-foreground/40" : "",
          )}
          key={channel.id}
          onClick={() => {
            router.push(`/servers/${serverId}/channels/${channel.id}`);
          }}
        >
          <UserAvatar name={channel.name ?? "else"} />

          <div className={cn("hidden flex-col md:flex")}>
            <p className="line-clamp-1 font-semibold md:text-xs lg:text-lg">
              {channel.topic}
            </p>
            <p className="line-clamp-1 hidden text-xs font-light lg:flex">
              {channel.description}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}

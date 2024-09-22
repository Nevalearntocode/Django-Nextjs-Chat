"use client";

import { useModal } from "@/hooks/use-modal";
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useServerId } from "@/hooks/use-server-id";
import MobileChannelList from "./mobile-channel-list";
import { useAppSelector } from "@/redux/hooks";

type Props = {};

export default function ChannelDrawerSheet({}: Props) {
  const { isModalOpen, onOpenChange } = useModal("channel-mobile-sheet");
  const serverId = useServerId();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Sheet open={isModalOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side={"left"}
        className="flex w-3/4 flex-col gap-4"
        aria-describedby={undefined}
      >
        <SheetHeader>
          <SheetTitle className="text-left font-bold">Channels</SheetTitle>
        </SheetHeader>
        {isAuthenticated ? (
          <MobileChannelList serverId={serverId} />
        ) : (
          <div className="flex flex-col">
            <p className="text-sm">
              You are not a member of this server, try logging in or join the
              server.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

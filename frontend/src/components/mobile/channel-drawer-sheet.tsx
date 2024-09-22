"use client";

import { useModal } from "@/hooks/use-modal";
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useServerId } from "@/hooks/use-server-id";
import MobileChannelList from "./mobile-channel-list";

type Props = {};

export default function ChannelDrawerSheet({}: Props) {
  const { isModalOpen, onOpenChange } = useModal("channel-mobile-sheet");
  const serverId = useServerId();

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
        <MobileChannelList serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
}

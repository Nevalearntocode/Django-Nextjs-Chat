"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { LogOut, MessageCircle, Settings, Trash2, Users2 } from "lucide-react";
import NavbarTooltip from "./third-draw-tooltip";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useGetServerQuery } from "@/redux/features/server-slice";
import { useGetCurrentUserQuery } from "@/redux/features/account-slice";
import { useAppSelector } from "@/redux/hooks";

type Props = {};

export default function ServerSettings({}: Props) {
  const pathname = usePathname();
  const serverId = pathname.split("/")[2];
  const { data: server } = useGetServerQuery(serverId);
  const { data: currentUser } = useGetCurrentUserQuery();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const isOwner = server && server.owner === currentUser?.username;

  if (!isAuthenticated) return null;

  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 sm:flex-col sm:gap-4",
        !serverId && "hidden",
      )}
    >
      {isOwner ? (
        <>
          <NavbarTooltip name={`Settings`}>
            <Button className="rounded-full" size={`icon`}>
              <Settings className="h-4 w-4" />
            </Button>
          </NavbarTooltip>
          <NavbarTooltip name="Channels">
            <Button className="rounded-full" size={`icon`}>
              <MessageCircle className="h-4 w-4" />
            </Button>
          </NavbarTooltip>
          <NavbarTooltip name="Members">
            <Button className="rounded-full" size={`icon`}>
              <Users2 className="h-4 w-4" />
            </Button>
          </NavbarTooltip>

          <NavbarTooltip name="Delete">
            <Button
              className="rounded-full"
              size={`icon`}
              variant={`destructive`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </NavbarTooltip>
        </>
      ) : (
        <NavbarTooltip name="Leave">
          <Button
            className="rounded-full"
            size={`icon`}
            variant={`destructive`}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </NavbarTooltip>
      )}
    </div>
  );
}

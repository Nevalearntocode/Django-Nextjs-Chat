"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { LogOut, MessageCircle, Settings, Trash2, Users2 } from "lucide-react";
import NavbarTooltip from "./third-draw-tooltip";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = {};

export default function ServerSettings({}: Props) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 sm:flex-col sm:gap-4",
        pathname === "/" && "hidden",
      )}
    >
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
      <NavbarTooltip name="Leave">
        <Button
          className="hidden rounded-full"
          size={`icon`}
          variant={`destructive`}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </NavbarTooltip>
      <NavbarTooltip name="Delete">
        <Button className="rounded-full" size={`icon`} variant={`destructive`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </NavbarTooltip>
    </div>
  );
}

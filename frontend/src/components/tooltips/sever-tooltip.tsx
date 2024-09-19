"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import React from "react";
import { UserAvatar } from "../user-avatar";

type Props = {
  children: React.ReactNode;
  name: string;
  description: string;
  icon: string;
};

export default function ServerTooltip({
  children,
  name,
  description,
  icon,
}: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-zinc-200 text-black dark:bg-zinc-600 dark:text-white"
        >
          <div
            className={cn(
              "flex items-center justify-center gap-4 rounded-lg py-4 lg:justify-start",
            )}
          >
            <UserAvatar name={name} image={icon} />
            <div className={cn("flex flex-col")}>
              <p className="line-clamp-1 text-left text-lg font-semibold capitalize">
                {name}
              </p>
              <p className="line-clamp-1 text-left text-sm font-light">
                {description}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

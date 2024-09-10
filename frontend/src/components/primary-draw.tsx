"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";
import { useGetServersQuery } from "@/redux/features/server-slice";
import { useRouter, useSearchParams } from "next/navigation";
import ServerTooltip from "./sever-tooltip";

type Props = {};

export default function PrimaryDraw({}: Props) {
  const [open, setOpen] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const router = useRouter();

  const { data } = useGetServersQuery({ category: category ?? undefined });

  return (
    <div
      className={cn(
        "container relative mt-4 hidden h-full flex-shrink-0 flex-col overflow-auto transition-all duration-300 ease-in-out scrollbar-hide sm:flex",
        open ? "sm:w-[80px] md:w-[160px] lg:w-[240px]" : "w-[80px]",
      )}
    >
      <div className="flex w-full items-center justify-between pl-4">
        <p
          className={cn(
            "text-lg font-bold",
            open ? "hidden md:block" : "hidden",
          )}
        >
          Popular
        </p>
        <Button
          className={cn(
            "ml-auto hidden justify-between rounded-lg hover:bg-transparent md:flex",
          )}
          variant={`ghost`}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className={cn("mt-3 flex w-full flex-col gap-2", open && "px-4")}>
        {/* TODO: make this a separate component later */}
        {data?.map((server) => (
          <ServerTooltip key={server.id} {...server}>
            <div
              className={cn(
                "flex items-center justify-center gap-4 rounded-lg p-4 lg:justify-start",
                open &&
                  "md:bg-muted-foreground/20 md:hover:bg-muted-foreground/40",
              )}
              onClick={() => router.push(`/servers/${server.id}`)}
            >
              <UserAvatar name={server.name} image={server.banner} />
              <div
                className={cn("hidden flex-col", open ? "lg:flex" : "hidden")}
              >
                <p className="line-clamp-1 text-left text-lg font-semibold capitalize">
                  {server.name}
                </p>
                <p className="line-clamp-1 text-left text-sm font-light">
                  {server.description}
                </p>
              </div>
            </div>
          </ServerTooltip>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";
import { useGetServersQuery } from "@/redux/features/server-slice";
import { useRouter, useSearchParams } from "next/navigation";
import ServerTooltip from "./sever-tooltip";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setServerName } from "@/redux/features/global-var-slice";
import { openModal } from "@/redux/features/modal-slice";
import { toast } from "sonner";

type Props = {};

export default function PrimaryDraw({}: Props) {
  const [open, setOpen] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { data } = useGetServersQuery({ category: category ?? undefined });

  const onOpenAddServerModal = () => {
    if (!isAuthenticated) {
      dispatch(openModal("login"));
      toast.info("You need to be authenticated to create a server");
      return;
    }
    dispatch(openModal("server"));
  };

  return (
    <div
      className={cn(
        "container relative mt-4 hidden h-full flex-shrink-0 flex-col justify-between overflow-auto transition-all duration-300 ease-in-out scrollbar-hide sm:flex",
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
              onClick={() => {
                dispatch(setServerName(server.name));
                router.push(`/servers/${server.id}`);
              }}
            >
              <UserAvatar name={server.name} image={server.icon} />
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
      <div className="mb-10 flex w-full items-center justify-center">
        <Button
          className="rounded-full"
          size={`${open ? "lg" : "default"}`}
          onClick={onOpenAddServerModal}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

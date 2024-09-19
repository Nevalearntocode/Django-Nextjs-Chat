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
        "icen container relative hidden h-full flex-shrink-0 flex-col overflow-auto bg-zinc-300 transition-all duration-300 ease-in-out scrollbar-hide dark:bg-zinc-800 sm:flex",
        open ? "sm:w-[80px] md:w-[160px] lg:w-[240px]" : "w-[80px]",
      )}
    >
      <div className="hidden w-full items-center justify-between border-b-2 border-zinc-900 py-4 pl-4 md:flex">
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
      <div
        className={cn(
          "mt-2 flex w-full flex-col gap-2 overflow-auto",
          open && "px-4",
        )}
      >
        {/* TODO: make this a separate component later */}
        {data?.map((server) => (
          <ServerTooltip key={server.id} {...server}>
            <div
              className={cn(
                "flex items-center justify-center gap-4 rounded-lg p-2 lg:justify-start",
                open &&
                  "md:bg-muted-foreground/20 md:hover:bg-muted-foreground/40",
              )}
              onClick={() => {
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
      <div className="group mb-4 mt-auto flex w-full items-center justify-center pt-2">
        <Button className="rounded-full md:px-8" onClick={onOpenAddServerModal}>
          <Plus className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>
    </div>
  );
}

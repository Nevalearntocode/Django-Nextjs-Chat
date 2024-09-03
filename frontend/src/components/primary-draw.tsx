"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";
import { useGetServersQuery } from "@/redux/features/server-slice";

type Props = {};

export default function PrimaryDraw({}: Props) {
  const [open, setOpen] = useState(true);

  const { data } = useGetServersQuery({});

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
      <div className="mt-3 flex w-full flex-col gap-2 px-4">
        <div className="flex items-center gap-4 rounded-lg bg-muted-foreground/20 p-4 hover:bg-muted-foreground/40">
          <UserAvatar name="Coder one" />
          <div className={cn("hidden flex-col", open ? "lg:flex" : "hidden")}>
            <p className="text-lg font-semibold">Something</p>
            <p className="text-sm font-light">Something</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-lg bg-muted-foreground/20 p-4 hover:bg-muted-foreground/40">
          <UserAvatar name="Coder one" />
          <div className={cn("hidden flex-col", open ? "lg:flex" : "hidden")}>
            <p className="text-lg font-semibold">Something</p>
            <p className="text-sm font-light">Something</p>
          </div>
        </div>
      </div>
    </div>
  );
}

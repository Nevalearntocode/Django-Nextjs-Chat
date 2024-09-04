"use client";

import React from "react";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { useGetServersQuery } from "@/redux/features/server-slice";

type Props = {};

export default function PopularServers({}: Props) {
  const { data } = useGetServersQuery({});

  return (
    <div className="h-full w-full px-6 pt-14">
      <div className="flex flex-col gap-1 pt-1">
        <p className="text-4xl font-bold">Programming</p>
        <p className="font-semibold text-muted-foreground">
          Channels talking about programming
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-4 transition-all duration-300 ease-in-out md:mt-8 lg:mt-12">
        <p className="text-lg font-semibold">Recommended channels</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div>
            <div className="h-[150px] max-w-[300px] bg-blue-500" />
            <div className="flex gap-4 rounded-lg pt-2">
              <UserAvatar name="Coder one" />
              <div className={cn("flex flex-col")}>
                <p className="text-lg font-semibold">Something</p>
                <p className="text-sm font-light">Something</p>
              </div>
            </div>
          </div>
          <div>
            <div className="h-[150px] max-w-[300px] bg-blue-500" />
            <div className="flex gap-4 rounded-lg pt-2">
              <UserAvatar name="Coder one" />
              <div className={cn("flex flex-col")}>
                <p className="text-lg font-semibold">Something</p>
                <p className="text-sm font-light">Something</p>
              </div>
            </div>
          </div>
          <div>
            <div className="h-[150px] max-w-[300px] bg-blue-500" />
            <div className="flex gap-4 rounded-lg pt-2">
              <UserAvatar name="Coder one" />
              <div className={cn("flex flex-col")}>
                <p className="text-lg font-semibold">Something</p>
                <p className="text-sm font-light">Something</p>
              </div>
            </div>
          </div>
          <div>
            <div className="h-[150px] max-w-[300px] bg-blue-500" />
            <div className="flex gap-4 rounded-lg pt-2">
              <UserAvatar name="Coder one" />
              <div className={cn("flex flex-col")}>
                <p className="text-lg font-semibold">Something</p>
                <p className="text-sm font-light">Something</p>
              </div>
            </div>
          </div>
          <div>
            <div className="h-[150px] max-w-[300px] bg-blue-500" />
            <div className="flex gap-4 rounded-lg pt-2">
              <UserAvatar name="Coder one" />
              <div className={cn("flex flex-col")}>
                <p className="text-lg font-semibold">Something</p>
                <p className="text-sm font-light">Something</p>
              </div>
            </div>
          </div>
          <div>
            <div className="h-[150px] max-w-[300px] bg-blue-500" />
            <div className="flex gap-4 rounded-lg pt-2">
              <UserAvatar name="Coder one" />
              <div className={cn("flex flex-col")}>
                <p className="text-lg font-semibold">Something</p>
                <p className="text-sm font-light">Something</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

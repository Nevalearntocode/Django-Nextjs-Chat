"use client";

import React from "react";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { useGetServersQuery } from "@/redux/features/server-slice";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {};

export default function PopularServers({}: Props) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const { data } = useGetServersQuery({ category: category ?? undefined });
  const router = useRouter();

  const onServerClick = (serverId: string) => {
    router.push(`/servers/${serverId}`);
  };

  return (
    <div className="h-full w-full overflow-auto px-6 pt-14">
      <div className="flex flex-col gap-1 pt-1">
        <p className="text-4xl font-bold">Programming</p>
        <p className="font-semibold text-muted-foreground">
          Servers talking about programming
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-4 transition-all duration-300 ease-in-out md:mt-8 lg:mt-12">
        <p className="text-lg font-semibold">Recommended servers</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.map((server, index) => (
            <div
              key={server.id}
              className="cursor-pointer"
              onClick={() => onServerClick(server.id)}
            >
              <div className="relative h-[150px] max-w-[300px]">
                <Image
                  priority
                  src={server.banner}
                  alt={`${server.name}-${index}`}
                  fill
                  sizes="400px"
                />
              </div>
              <div className="flex items-center gap-4 rounded-lg pt-2">
                <UserAvatar name={server.name} />
                <div className={cn("flex flex-col")}>
                  <p className="text-lg font-semibold">{server.name}</p>
                  <p className="text-sm font-light">{server.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

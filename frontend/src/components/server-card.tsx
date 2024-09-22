"use client";

import Image from "next/image";
import React from "react";
import { UserAvatar } from "./user-avatar";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  banner: string;
  name: string;
  description: string;
};

export default function ServerCard({ banner, description, id, name }: Props) {
  const router = useRouter();
  const onServerClick = (serverId: string) => {
    router.push(`/servers/${serverId}`);
  };

  return (
    <div key={id} className="cursor-pointer" onClick={() => onServerClick(id)}>
      <div className="relative h-[150px] max-w-[300px]">
        <Image priority src={banner} alt={`${name}-${id}`} fill sizes="400px" />
      </div>
      <div className="flex items-center gap-4 rounded-lg pt-2">
        <UserAvatar name={name} />
        <div className={cn("flex flex-col")}>
          <p className="text-lg font-semibold">{name}</p>
          <p className="line-clamp-1 text-sm font-light">{description}</p>
        </div>
      </div>
    </div>
  );
}

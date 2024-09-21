"use client";

import { usePathname } from "next/navigation";

export const useServerId = () => {
  const pathname = usePathname();
  const serverId = pathname.split("/")[2];
  return serverId;
};

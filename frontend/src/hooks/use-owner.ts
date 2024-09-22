"use client";

import { useGetCurrentUserQuery } from "@/redux/features/account-slice";
import { useGetServerQuery } from "@/redux/features/server-slice";

type Props = string;

export default function useIsOwner(serverId: Props) {
  const { data: server } = useGetServerQuery(serverId);
  const { data: currentUser } = useGetCurrentUserQuery();

  if (server && server.owner === currentUser?.username) {
    return { isOwner: true };
  }
}

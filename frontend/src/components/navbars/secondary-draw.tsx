"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openModal } from "@/redux/features/modal-slice";
import { useGetCurrentUserQuery } from "@/redux/features/account-slice";
import ChannelList from "./channel-list";
import CategoryList from "./category-list";
import { useGetServerQuery } from "@/redux/features/server-slice";
import { useServerId } from "@/hooks/use-server-id";
import { usePathname } from "next/navigation";

type Props = {};

export default function SecondaryDraw({}: Props) {
  const dispatch = useAppDispatch();
  const { data: user } = useGetCurrentUserQuery();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const serverId = useServerId();
  const pathname = usePathname();

  const { data: server } = useGetServerQuery(serverId);

  const isMember =
    server &&
    server.members &&
    server.members.find((member) => member.id === user?.id);

  const isOwner = server && server.owner === user?.username;

  console.log(isOwner);
  console.log(server?.owner);
  console.log(user?.username);
  console.log(server);
  const onAddCategory = () => {
    dispatch(openModal("category"));
  };

  const onAddChannel = () => {
    dispatch(openModal("channel"));
  };

  return (
    <div
      className={cn(
        "container relative hidden h-full flex-shrink-0 flex-col overflow-auto transition-all duration-300 ease-in-out scrollbar-hide sm:flex sm:w-[80px] md:w-[160px] lg:w-[240px]",
      )}
    >
      <div className="hidden w-full items-center justify-center border-b-2 p-4 md:flex md:justify-between md:pr-2">
        <p className={cn("hidden text-lg font-bold md:block")}>
          {isMember && isAuthenticated && server ? "Channels" : "Explore"}
        </p>{" "}
        {user?.is_staff && isAuthenticated && !serverId && (
          <Button
            className="rounded-full"
            size={"icon"}
            variant={`outline`}
            onClick={onAddCategory}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="mt-2 flex w-full flex-col gap-2 px-4 md:px-2">
        {isMember && isAuthenticated && pathname != "/" ? (
          <ChannelList serverId={serverId} />
        ) : (
          <CategoryList />
        )}
      </div>
      {isOwner && isAuthenticated && pathname != "/" && (
        <div className="group mb-4 mt-auto flex w-full items-center justify-center pt-2">
          <Button className="rounded-full md:px-8" onClick={onAddChannel}>
            <Plus className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

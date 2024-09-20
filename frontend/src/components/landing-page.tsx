"use client";

import React from "react";
import Image from "next/image";
import {
  useGetServerQuery,
  useJoinServerMutation,
} from "@/redux/features/server-slice";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openModal } from "@/redux/features/modal-slice";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useGetCurrentUserQuery } from "@/redux/features/account-slice";

const LandingPage = ({ serverId }: { serverId: string }) => {
  const { data: server } = useGetServerQuery(serverId);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const invite_code = searchParams.get("invite_code");
  const [joinServer, { isLoading }] = useJoinServerMutation();
  const { data: user } = useGetCurrentUserQuery();

  const isMember =
    server && server.members && server.members.includes(user?.id ?? "");

  const onJoinServer = () => {
    if (!isAuthenticated) {
      dispatch(openModal("login"));
      toast.info("You need to be authenticated to join a server.");
      return;
    }
    if (server?.status === "private" && !invite_code) {
      toast.info("This server is private. Please provide an invite code.");
      dispatch(openModal("server-join"));
    }
    if (
      server?.status === "public" ||
      (server?.status === "private" && invite_code)
    ) {
      joinServer({ id: serverId, invite_code: invite_code ?? undefined })
        .unwrap()
        .then(() => {
          toast.success("You have joined this server!");
        })
        .catch((err: any) => {
          if (err.data) {
            for (const field in err.data) {
              err.data[field].forEach((errorMessage: string) => {
                toast.error(errorMessage);
              });
            }
          } else {
            console.error(err);
            toast.error("An error occurred while joining the server.");
          }
        });
    }
  };

  if (!server) return null;

  return (
    <div className="flex h-full w-full flex-col items-center gap-8">
      <div className="relative h-[250px] w-[360px] rounded-md">
        <Image
          src={server.banner}
          alt="Server Image"
          fill
          sizes="( max-width: 768px ) 768px, ( max-width: 1200px ) 768px, 768px"
        />
      </div>
      <div className="flex w-full flex-col items-center gap-2">
        <h2 className="text-xl font-bold md:text-3xl">
          Welcome to {server.name}
        </h2>
        <p className="text-nowrap text-center text-xs">{server.description}</p>
      </div>
      {(!isMember || !isAuthenticated) && (
        <Button onClick={onJoinServer} disabled={isLoading}>
          Join this server
        </Button>
      )}
    </div>
  );
};

export default LandingPage;

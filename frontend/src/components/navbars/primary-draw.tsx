"use client";

import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "../user-avatar";
import { useGetServersQuery } from "@/redux/features/server-slice";
import { useRouter, useSearchParams } from "next/navigation";
import ServerTooltip from "../tooltips/sever-tooltip";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openModal } from "@/redux/features/modal-slice";
import { toast } from "sonner";

type Props = {};

export default function PrimaryDraw({}: Props) {
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
        "container relative hidden h-full w-[80px] flex-shrink-0 flex-col items-center overflow-auto bg-zinc-300 scrollbar-hide dark:bg-zinc-800 sm:flex",
      )}
    >
      <div
        className={cn(
          "mt-2 flex w-full flex-col items-center gap-2 overflow-auto",
        )}
      >
        {/* TODO: make this a separate component later */}
        {data?.map((server) => (
          <ServerTooltip key={server.id} {...server}>
            <div
              className={cn(
                "flex items-center justify-center gap-4 rounded-lg p-2 lg:justify-start",
              )}
              onClick={() => {
                router.push(`/servers/${server.id}`);
              }}
            >
              <UserAvatar name={server.name} image={server.icon} />
            </div>
          </ServerTooltip>
        ))}
      </div>
      <div className="group mb-4 mt-auto flex w-full items-center justify-center pt-2">
        <Button className="rounded-full" onClick={onOpenAddServerModal}>
          <PlusCircle className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>
    </div>
  );
}

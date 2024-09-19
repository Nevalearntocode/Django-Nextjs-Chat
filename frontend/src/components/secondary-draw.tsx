"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openModal } from "@/redux/features/modal-slice";
import { useGetCategoriesQuery } from "@/redux/features/category-slice";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetChannelsQuery } from "@/redux/features/channel-slice";
import { UserAvatar } from "./user-avatar";
import { useGetCurrentUserQuery } from "@/redux/features/account-slice";

type Props = {};

export default function SecondaryDraw({}: Props) {
  const dispatch = useAppDispatch();
  const { data: categories } = useGetCategoriesQuery({});
  const { data: user } = useGetCurrentUserQuery();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const isServerRoute =
    pathname.startsWith("/servers") || pathname.startsWith("/channels");
  const serverId = isServerRoute && pathname.split("/")[2];

  const { data: channels } = useGetChannelsQuery({
    serverId: serverId ? serverId : undefined,
  });

  const onAddCategory = () => {
    dispatch(openModal("category"));
  };

  const onAddChannel = () => {
    dispatch(openModal("channel"));
  };

  const onFilterByCategory = (category: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("category", category);
    if (category === categoryParam) {
      url.searchParams.delete("category");
    }
    router.push(url.toString());
  };

  return (
    <div
      className={cn(
        "container relative hidden h-full flex-shrink-0 flex-col overflow-auto transition-all duration-300 ease-in-out scrollbar-hide dark:bg-zinc-900 sm:flex sm:w-[80px] md:w-[160px] lg:w-[240px]",
      )}
    >
      <div className="hidden w-full items-center justify-center border-b-2 p-4 md:flex md:justify-between md:pr-2">
        <p className={cn("hidden text-lg font-bold md:block")}>
          {isServerRoute ? "Channels" : "Explore"}
        </p>{" "}
        {user?.is_staff && isAuthenticated && (
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
      {/* TODO: make this a separate component later */}
      <div className="mt-2 flex w-full flex-col gap-2 px-4 md:px-2">
        {isServerRoute ? (
          <>
            {channels?.map((channel) => (
              <div
                className={cn(
                  "flex w-full cursor-pointer items-center justify-center gap-2 rounded-full py-1 hover:bg-muted-foreground/10 md:rounded-lg md:bg-muted-foreground/10 md:p-4 md:hover:bg-muted-foreground/40 lg:gap-4",
                  false
                    ? "bg-muted-foreground/10 hover:bg-muted-foreground/40"
                    : "",
                )}
                key={"12"}
                onClick={() => {
                  router.push(`/servers/${serverId}/channels/${channel.id}`);
                }}
              >
                <UserAvatar name={channel.name ?? "else"} />

                <div className={cn("hidden flex-col md:flex")}>
                  <p className="line-clamp-1 font-semibold md:text-xs lg:text-lg">
                    {channel.topic}
                  </p>
                  <p className="line-clamp-1 hidden text-xs font-light lg:flex">
                    {channel.description}
                  </p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {categories?.map((category) => (
              <div
                className={cn(
                  "flex w-full items-center gap-4 rounded-lg bg-muted-foreground/10 p-4 hover:bg-muted-foreground/40",
                  category.name === categoryParam
                    ? "border-2 border-zinc-400"
                    : "",
                )}
                key={category.id}
                onClick={() => onFilterByCategory(category.name)}
              >
                <Image
                  src={category.icon}
                  alt={category.name}
                  width={20}
                  height={20}
                  className="h-auto w-auto rounded-full"
                />
                <p className="line-clamp-1 hidden font-semibold sm:text-xs md:block md:text-sm lg:text-base">
                  {category.name}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="group mb-4 mt-auto flex w-full items-center justify-center pt-2">
        <Button className="rounded-full md:px-8" onClick={() => {}}>
          <Plus className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>
    </div>
  );
}

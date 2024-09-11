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
import { setChannelName } from "@/redux/features/global-var-slice";

type Props = {};

export default function SecondaryDraw({}: Props) {
  const dispatch = useAppDispatch();
  const { data: categories } = useGetCategoriesQuery();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const pathname = usePathname();
  const { serverName } = useAppSelector((state) => state.globalVar);

  const isServerRoute =
    pathname.startsWith("/servers") || pathname.startsWith("/channels");
  const serverId = isServerRoute && pathname.split("/")[2];

  const { data: channels } = useGetChannelsQuery({
    serverId: serverId ? serverId : undefined,
  });

  const onAddCategory = () => {
    dispatch(openModal("category"));
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
        "container relative hidden h-full flex-shrink-0 flex-col overflow-auto transition-all duration-300 ease-in-out scrollbar-hide sm:flex sm:w-[80px] md:w-[160px] lg:w-[240px]",
      )}
    >
      <div className="flex w-full items-center justify-between border-b-2 p-4 pr-2">
        <p className={cn("hidden text-lg font-bold md:block")}>
          {isServerRoute ? serverName : "Explore"}
        </p>{" "}
        <Button
          className="rounded-full"
          size={"icon"}
          variant={`outline`}
          onClick={onAddCategory}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {/* TODO: make this a separate component later */}
      <div className="mt-1 flex w-full flex-col gap-2 px-4 md:px-2">
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
                  dispatch(setChannelName(channel.name));
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
                <p className="hidden font-semibold sm:text-xs md:block md:text-sm lg:text-base">
                  {category.name}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

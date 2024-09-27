"use client";

import React from "react";
import { useGetServersQuery } from "@/redux/features/server-slice";
import { useSearchParams } from "next/navigation";
import { useGetCategoriesQuery } from "@/redux/features/category-slice";
import ServerCard from "./server-card";
import { Button } from "./ui/button";
import { Plus, PlusCircle } from "lucide-react";
import CategoryList from "./navbars/category-list";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openModal } from "@/redux/features/modal-slice";
import { useGetCurrentUserQuery } from "@/redux/features/account-slice";
import Image from "next/image";
import ServerTooltip from "./tooltips/server-tooltip";
import { SearchServer } from "./search-server";
import Loading from "@/app/loading";

type Props = {};

export default function PopularServers({}: Props) {
  const searchParams = useSearchParams();
  const category_param = searchParams.get("category");
  const qty_param = searchParams.get("qty");
  const by_user_param = searchParams.get("by_user");
  const name_param = searchParams.get("name");
  const { data: servers, isLoading } = useGetServersQuery({
    category: category_param ?? undefined,
    qty: qty_param ? parseInt(qty_param) : undefined,
    byUser: by_user_param ? by_user_param === "true" : undefined,
    name: name_param ?? undefined,
  });
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: categories } = useGetCategoriesQuery({
    name: category_param ?? undefined,
  });
  const dispatch = useAppDispatch();

  return (
    <div className="h-full w-full overflow-auto px-6 pt-4">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1 pt-1">
          <h1 className="text-2xl font-bold md:text-3xl xl:text-4xl">
            {category_param ? categories?.[0].name : "Popular servers"}
          </h1>
          <h3 className="text-xs font-semibold text-muted-foreground md:text-base">
            {category_param
              ? categories?.[0].description
              : "Most populated servers."}
          </h3>
        </div>
        <SearchServer servers={servers ?? []} />
        <div className="hidden gap-4 sm:flex">
          {currentUser?.is_staff && isAuthenticated && (
            <Button
              size={`icon`}
              className={cn("rounded-full")}
              onClick={() => dispatch(openModal("category"))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          <CategoryList />
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="mt-4 flex h-full flex-col gap-4 transition-all duration-300 ease-in-out md:mt-8 lg:mt-12">
          {servers && servers.length > 0 ? (
            <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {servers?.map((server) => (
                <ServerTooltip key={server.id} {...server}>
                  <ServerCard {...server} />
                </ServerTooltip>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center gap-4">
              <h2 className="text-base font-bold lg:text-xl">
                This category currently has no servers
              </h2>{" "}
              <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px]">
                <Image src="/svgs/empty.svg" alt="not found" fill />
              </div>
              <Button
                className="gap-2"
                onClick={() => dispatch(openModal("server"))}
              >
                Create one
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

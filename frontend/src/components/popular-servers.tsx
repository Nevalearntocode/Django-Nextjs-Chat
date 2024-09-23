"use client";

import React from "react";
import { useGetServersQuery } from "@/redux/features/server-slice";
import { useSearchParams } from "next/navigation";
import { useGetCategoriesQuery } from "@/redux/features/category-slice";
import ServerCard from "./server-card";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import CategoryList from "./navbars/category-list";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openModal } from "@/redux/features/modal-slice";
import { useGetCurrentUserQuery } from "@/redux/features/account-slice";

type Props = {};

export default function PopularServers({}: Props) {
  const searchParams = useSearchParams();
  const category_param = searchParams.get("category");
  const { data: servers } = useGetServersQuery({
    category: category_param ?? undefined,
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
          <p className="text-2xl font-bold md:text-3xl xl:text-4xl">
            {category_param ? categories?.[0].name : "Popular servers"}
          </p>
          <p className="text-xs font-semibold text-muted-foreground md:text-base">
            {category_param
              ? categories?.[0].description
              : "Servers recommended for you."}
          </p>
        </div>
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
      <div className="mt-4 flex flex-col gap-4 transition-all duration-300 ease-in-out md:mt-8 lg:mt-12">
        <div className="grid grid-cols-2 gap-12 sm:grid-cols-4 lg:grid-cols-6">
          {servers?.map((server) => <ServerCard {...server} key={server.id} />)}
        </div>
      </div>
    </div>
  );
}

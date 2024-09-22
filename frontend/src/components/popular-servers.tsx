"use client";

import React from "react";
import { useGetServersQuery } from "@/redux/features/server-slice";
import { useSearchParams } from "next/navigation";
import { useGetCategoriesQuery } from "@/redux/features/category-slice";
import ServerCard from "./server-card";
import { Button } from "./ui/button";
import {
  Airplay,
  Building,
  CircuitBoard,
  Computer,
  DollarSign,
} from "lucide-react";
import CategoryList from "./navbars/category-list";

type Props = {};

export default function PopularServers({}: Props) {
  const searchParams = useSearchParams();
  const category_param = searchParams.get("category");
  const { data: servers } = useGetServersQuery({
    category: category_param ?? undefined,
  });
  const { data: categories } = useGetCategoriesQuery({
    name: category_param ?? undefined,
  });

  return (
    <div className="h-full w-full overflow-auto px-6 pt-4">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1 pt-1">
          <p className="text-4xl font-bold">
            {category_param ? categories?.[0].name : "Popular servers"}
          </p>
          <p className="font-semibold text-muted-foreground">
            {category_param
              ? categories?.[0].description
              : "Servers recommended for you."}
          </p>
        </div>
        <div className="hidden gap-4 sm:flex">
          <CategoryList />
          <CategoryList />
          <CategoryList />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4 transition-all duration-300 ease-in-out md:mt-8 lg:mt-12">
        <p className="text-lg font-semibold">Recommended servers</p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {servers?.map((server) => <ServerCard {...server} key={server.id} />)}
          {servers?.map((server) => <ServerCard {...server} key={server.id} />)}
          {servers?.map((server) => <ServerCard {...server} key={server.id} />)}
          {servers?.map((server) => <ServerCard {...server} key={server.id} />)}
          {servers?.map((server) => <ServerCard {...server} key={server.id} />)}
          {servers?.map((server) => <ServerCard {...server} key={server.id} />)}
          {servers?.map((server) => <ServerCard {...server} key={server.id} />)}
        </div>
      </div>
    </div>
  );
}

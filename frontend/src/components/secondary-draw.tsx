"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { openModal } from "@/redux/features/modal-slice";
import { useGetCategoriesQuery } from "@/redux/features/category-slice";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {};

export default function SecondaryDraw({}: Props) {
  const dispatch = useAppDispatch();
  const { data } = useGetCategoriesQuery();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");

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
        <p className={cn("hidden text-lg font-bold md:block")}>Explore</p>{" "}
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
      <div className="mt-1 flex w-full flex-col gap-2 px-2">
        {data?.map((category) => (
          <div
            className={cn(
              "flex w-full items-center gap-4 rounded-lg bg-muted-foreground/10 p-4 hover:bg-muted-foreground/40",
              category.name === categoryParam ? "border-2 border-zinc-400" : "",
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
      </div>
    </div>
  );
}

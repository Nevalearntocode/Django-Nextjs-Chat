"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closeModal } from "@/redux/features/modal-slice";
import { useGetServersQuery } from "@/redux/features/server-slice";
import { UserAvatar } from "../user-avatar";
import { cn } from "@/lib/utils";
import { useGetCategoriesQuery } from "@/redux/features/category-slice";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {};

export default function DrawerSheet({}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { isOpen, type } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const { data: servers } = useGetServersQuery({
    qty: 4,
    category: categoryParam ?? undefined,
  });
  const { data: categories } = useGetCategoriesQuery({});

  const onSheetChange = () => {
    dispatch(closeModal());
  };

  const onFilterByCategory = (category: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("category", category);
    if (category === categoryParam) {
      url.searchParams.delete("category");
    }
    router.push(url.toString());
  };

  const isSheetOpen = type === "mobile-sheet" && isOpen;

  return (
    <Sheet open={isSheetOpen} onOpenChange={onSheetChange}>
      <SheetContent
        side={"left"}
        className="flex w-3/4 flex-col gap-4"
        aria-describedby={undefined}
      >
        <div>
          <SheetHeader>
            <SheetTitle className="text-left font-bold">
              Explore categories
            </SheetTitle>
          </SheetHeader>
          <div className="mt-1 flex w-full flex-col gap-2">
            {categories?.map((category) => (
              <div
                className="flex w-full items-center gap-4 rounded-lg bg-muted-foreground/10 p-4 hover:bg-muted-foreground/40"
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
                <p className="text-base font-semibold sm:text-xs md:block md:text-sm">
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

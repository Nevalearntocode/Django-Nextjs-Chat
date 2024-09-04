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
import { UserAvatar } from "./user-avatar";
import { cn } from "@/lib/utils";
import { useGetCategoriesQuery } from "@/redux/features/category-slice";
import Image from "next/image";

type Props = {};

export default function DrawerSheet({}: Props) {
  const { isOpen, type } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const { data: servers } = useGetServersQuery({ qty: 4 });
  const { data: categories } = useGetCategoriesQuery();

  const onSheetChange = () => {
    dispatch(closeModal());
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
        <div>
          <SheetHeader>
            <SheetTitle className="text-left font-bold">
              Popular servers
            </SheetTitle>
          </SheetHeader>
          <div
            className={cn(
              "mt-3 flex w-full flex-col gap-2",
              // open && "px-4"
            )}
          >
            {/* TODO: make this a separate component later */}
            {servers?.map((server) => (
              <div
                className={cn(
                  "flex items-center gap-4 rounded-lg p-4",
                  // open &&
                  "bg-muted-foreground/20 hover:bg-muted-foreground/40",
                )}
                key={server.id}
              >
                <UserAvatar name={server.name} image={server.banner} />
                <div
                  className={cn(
                    "flex-col",
                    // open ? "lg:flex" : "hidden"
                  )}
                >
                  <p className="text-lg font-semibold">{server.name}</p>
                  <p className="text-sm font-light">{server.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

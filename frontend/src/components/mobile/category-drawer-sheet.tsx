"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useGetCategoriesQuery } from "@/redux/features/category-slice";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useModal } from "@/hooks/use-modal";

type Props = {};

export default function CategoryDrawerSheet({}: Props) {
  const { isModalOpen, onOpenChange } = useModal("category-mobile-sheet");
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { data: categories } = useGetCategoriesQuery({});

  const onFilterByCategory = (category: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("category", category);
    if (category === categoryParam) {
      url.searchParams.delete("category");
    }
    router.push(url.toString());
  };

  return (
    <Sheet open={isModalOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side={"left"}
        className="flex w-3/4 flex-col gap-4"
        aria-describedby={undefined}
      >
        <SheetHeader>
          <SheetTitle className="text-left font-bold">
            Explore categories
          </SheetTitle>
        </SheetHeader>
        <div>
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

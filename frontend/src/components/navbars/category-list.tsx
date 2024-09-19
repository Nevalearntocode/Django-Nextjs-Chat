"use client"

import { cn } from '@/lib/utils';
import { useGetCategoriesQuery } from '@/redux/features/category-slice';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

type Props = {}

export default function CategoryList({}: Props) {
    const searchParams = useSearchParams();
    const router = useRouter()
    const categoryParam = searchParams.get("category");
    const {data: categories} = useGetCategoriesQuery({});

  const onFilterByCategory = (category: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("category", category);
    if (category === categoryParam) {
      url.searchParams.delete("category");
    }
    router.push(url.toString());
  };
  return (
    <>
      {categories?.map((category) => (
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
          <p className="line-clamp-1 hidden font-semibold sm:text-xs md:block md:text-sm lg:text-base">
            {category.name}
          </p>
        </div>
      ))}
    </>
  );
}
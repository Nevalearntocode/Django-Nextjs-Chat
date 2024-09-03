"use client";

import { cn } from "@/lib/utils";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { openModal } from "@/redux/features/modal-slice";

type Props = {};

export default function SecondaryDraw({}: Props) {
  const dispatch = useAppDispatch();

  const onAddCategory = () => {
    dispatch(openModal("category"));
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
      <div className="mt-1 flex w-full flex-col gap-2 px-2">
        <div className="flex w-full items-center gap-4 rounded-lg bg-muted-foreground/10 p-4 hover:bg-muted-foreground/40">
          <ChatBubbleIcon className="h-5 w-5 font-bold" />
          <p className="hidden font-semibold sm:text-xs md:block md:text-sm lg:text-base">
            Programming
          </p>
        </div>
        <div className="flex w-full items-center gap-4 rounded-lg bg-muted-foreground/10 p-4 hover:bg-muted-foreground/40">
          <ChatBubbleIcon className="h-5 w-5 font-bold" />
          <p className="hidden font-semibold sm:text-xs md:block md:text-sm lg:text-base">
            Programming
          </p>
        </div>
        <div className="flex w-full items-center gap-4 rounded-lg bg-muted-foreground/10 p-4 hover:bg-muted-foreground/40">
          <ChatBubbleIcon className="h-5 w-5 font-bold" />
          <p className="hidden font-semibold sm:text-xs md:block md:text-sm lg:text-base">
            Programming
          </p>
        </div>
        <div className="flex w-full items-center gap-4 rounded-lg bg-muted-foreground/10 p-4 hover:bg-muted-foreground/40">
          <ChatBubbleIcon className="h-5 w-5 font-bold" />
          <p className="hidden font-semibold sm:text-xs md:block md:text-sm lg:text-base">
            Programming
          </p>
        </div>
        <div className="flex w-full items-center gap-4 rounded-lg bg-muted-foreground/10 p-4 hover:bg-muted-foreground/40">
          <ChatBubbleIcon className="h-5 w-5 font-bold" />
          <p className="hidden font-semibold sm:text-xs md:block md:text-sm lg:text-base">
            Programming
          </p>
        </div>
      </div>
    </div>
  );
}
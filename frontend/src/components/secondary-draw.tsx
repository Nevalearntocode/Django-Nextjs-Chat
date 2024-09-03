"use client";

import { cn } from "@/lib/utils";
import { ChatBubbleIcon } from "@radix-ui/react-icons";

type Props = {};

export default function SecondaryDraw({}: Props) {
  return (
    <div
      className={cn(
        "container relative hidden h-full flex-shrink-0 flex-col overflow-auto transition-all duration-300 ease-in-out scrollbar-hide sm:flex sm:w-[80px] md:w-[160px] lg:w-[240px]",
      )}
    >
      <div className="flex w-full items-center justify-between border-b-2 py-4 pl-4">
        <p className={cn("hidden text-lg font-bold md:block")}>Explore</p>{" "}
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

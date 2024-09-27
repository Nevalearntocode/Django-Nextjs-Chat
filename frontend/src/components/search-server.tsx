"use client";

import * as React from "react";
import { CreditCard, Settings, User } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Server } from "@/redux/features/server-slice";
import { cn } from "@/lib/utils";

type Props = {
  servers: Server[];
  className?: string;
};

export function SearchServer({ servers, className }: Props) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onSelect = (serverName: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("name", serverName);
    window.location.href = url.toString();
  };

  return (
    <>
      <div
        className={cn("relative flex gap-2", className)}
        onClick={() => setOpen(true)}
      >
        <Input placeholder="Search" className="hidden lg:block" />
        <div className="absolute right-0 flex gap-2">
          <Button
            className="hidden rounded-full lg:flex"
            size={`icon`}
            variant={`ghost`}
          >
            <p className="text-sm text-muted-foreground">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>J
              </kbd>
            </p>
          </Button>
          <Button variant="outline" size={`icon`} className="rounded-full">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Servers">
            {servers.map((server) => (
              <CommandItem
                key={server.id}
                value={server.name + " " + server.category}
                onSelect={(e) => {
                  onSelect(server.name);
                  setOpen(false);
                }}
                className="flex items-center justify-between"
              >
                <span>{server.name}</span>
                <span className="text-xs italic">{server.category}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

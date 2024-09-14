"use client";

import React from "react";
import Logo from "./logo";
import { ModeToggle } from "./mode-toggle";
import { UserAvatar } from "./user-avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openModal } from "@/redux/features/modal-slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Key, UserCircle } from "lucide-react";

type Props = {};

export default function Navbar({}: Props) {
  const dispatch = useAppDispatch();
  const { type } = useAppSelector((state) => state.modal);

  return (
    <div className="flex h-[75px] w-full justify-center border-2 border-solid px-4 md:px-20">
      <div className="container flex h-full items-center justify-between">
        <Logo />
        <div className="flex gap-4">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserAvatar name="Neva" image="/default-avatar-image.jpg" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="flex items-center justify-between"
                onSelect={() => dispatch(openModal("register"))}
              >
                Register
                <UserCircle className="h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center justify-between"
                onSelect={() => dispatch(openModal("login"))}
              >
                Login
                <Key className="h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

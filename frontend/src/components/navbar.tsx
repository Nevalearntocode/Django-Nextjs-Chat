"use client";

import React from "react";
import Logo from "./logo";
import { ModeToggle } from "./mode-toggle";
import { UserAvatar } from "./user-avatar";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <div className="flex h-[75px] w-full justify-center border-2 border-solid px-4 md:px-20">
      <div className="container flex h-full items-center justify-between">
        <Logo />
        <div className="flex gap-4">
          <ModeToggle />
          <UserAvatar name="Neva" />
        </div>
      </div>
    </div>
  );
}

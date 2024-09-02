"use client";

import React from "react";
import Logo from "./logo";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <div className="flex h-[50px] w-full justify-center border-2 border-solid px-4 md:px-20">
      <div className="container flex h-full items-center justify-between">
        <Logo />
        <div>Navbar</div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Logo from "./logo";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <div className="flex h-[50px] justify-center border-b-[2px] border-solid md:px-20">
      <div className="container flex h-full items-center justify-between">
        <Logo />
        <div>Navbar</div>
      </div>
    </div>
  );
}

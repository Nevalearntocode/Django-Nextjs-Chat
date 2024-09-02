"use client";

import React from "react";
import Navbar from "./navbar";
import PrimaryDraw from "./primary-draw";

type Props = {};

export default function Header({}: Props) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="container flex h-full w-full flex-col">
        <Navbar />
        <PrimaryDraw />
      </div>
    </div>
  );
}

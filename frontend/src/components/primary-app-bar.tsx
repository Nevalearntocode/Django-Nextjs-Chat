"use client";

import React from "react";

type Props = {};

export default function PrimaryAppBar({}: Props) {
  return (
    <div className="flex h-[50px] justify-center border-b-[2px] border-solid md:px-20">
      <div className="container flex h-full items-center justify-between">
        <div>PrimaryAppBar</div>
        <div>PrimaryAppBar</div>
      </div>
    </div>
  );
}

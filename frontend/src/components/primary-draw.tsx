"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {};

export default function PrimaryDraw({}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "container relative hidden h-full flex-col overflow-auto border-l-2 border-solid p-4 sm:flex",
        open ? "sm:w-[80px] md:w-[160px] lg:w-[240px]" : "w-[80px]",
      )}
    >
      <Button
        className={cn("absolute right-0 top-0 hidden rounded-full md:flex")}
        size={`icon`}
        variant={`ghost`}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <ArrowLeft className="h-4 w-4" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </Button>
      {[...Array(100)].map((_, i) => (
        <p key={i} className="">
          {i}
        </p>
      ))}
    </div>
  );
}

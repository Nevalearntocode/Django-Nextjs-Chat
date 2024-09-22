import SecondaryDraw from "@/components/navbars/secondary-draw";
import { Separator } from "@/components/ui/separator";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function ServerLayout({ children }: Props) {
  return (
    <div className="flex w-full">
      <SecondaryDraw />
      <Separator orientation="vertical" />
      {children}
    </div>
  );
}

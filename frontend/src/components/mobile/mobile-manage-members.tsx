"use client";

import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetContent,
} from "../ui/sheet";
import ManageMembers from "../manage-members";

type Props = {
  children: React.ReactNode;
};

export default function MobileManageMembers({ children }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side={"right"}
        aria-describedby={undefined}
        className="flex flex-col"
      >
        <SheetHeader>
          <SheetTitle className="text-left">Manage members</SheetTitle>
        </SheetHeader>
        <ManageMembers />
      </SheetContent>
    </Sheet>
  );
}

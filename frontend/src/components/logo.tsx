"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { openModal } from "@/redux/features/modal-slice";

const Logo = () => {
  const dispatch = useAppDispatch();

  const onMenuClick = () => {
    dispatch(openModal("mobile-sheet"));
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex sm:hidden" onClick={onMenuClick}>
        <Menu className="h-6 w-6" />
      </div>
      <Link href={`/`}>
        <div className="flex items-center gap-2 rounded-full bg-muted-foreground/20 p-4 py-1 pl-1 pr-2 hover:bg-muted-foreground/40">
          <Image
            src={`/logo.jpg`}
            priority
            width={40}
            height={40}
            alt={`logo`}
            className="h-auto w-auto rounded-full"
          />
          <p className="text-xl font-bold">DNC</p>
        </div>
      </Link>
    </div>
  );
};

export default Logo;

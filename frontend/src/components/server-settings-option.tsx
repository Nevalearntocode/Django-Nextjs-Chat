"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Mail, Settings } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { openModal } from "@/redux/features/modal-slice";

type Props = {
  children: React.ReactNode;
};

export default function ServerSettingsOption({ children }: Props) {
  const dispatch = useAppDispatch();
  const onServerSettings = () => {
    dispatch(openModal("server-settings"));
  };
  const onInviteLink = () => {
    dispatch(openModal("invite-link"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center justify-between"
          onSelect={onInviteLink}
        >
          <p>Invite link</p>
          <Mail className="h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center justify-between"
          onSelect={onServerSettings}
        >
          <p>Settings</p>
          <Settings className="h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

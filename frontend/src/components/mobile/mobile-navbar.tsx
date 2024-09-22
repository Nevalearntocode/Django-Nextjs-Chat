"use client";

import { cn } from "@/lib/utils";
import React from "react";
import {
  Key,
  LogOut,
  RectangleEllipsis,
  Settings,
  UserCircle,
} from "lucide-react";
import GeneralTooltip from "../tooltips/general-tooltip";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openModal } from "@/redux/features/modal-slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "@/redux/features/account-slice";
import { setIsloading, setLogout } from "@/redux/features/auth-slice";
import Logo from "../navbars/logo";
import { ModeToggle } from "../mode-toggle";
import { UserAvatar } from "../user-avatar";
import { Button } from "../ui/button";
import MobileSettings from "./mobile-settings";
import { useServerId } from "@/hooks/use-server-id";

type Props = {};

export default function MobileNavbar({}: Props) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const { data: user } = useGetCurrentUserQuery();
  const serverId = useServerId();

  const handleLogout = () => {
    dispatch(setIsloading(true));
    logout()
      .unwrap()
      .then(() => {
        dispatch(setLogout());
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(setIsloading(false));
      });
  };

  const renderDropdownMenuItems = () => {
    if (isAuthenticated) {
      return (
        <>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => dispatch(openModal("change-password"))}
          >
            Password
            <RectangleEllipsis className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleLogout} disabled={isLoading}>
            Logout
            <LogOut className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        </>
      );
    } else {
      return (
        <>
          <DropdownMenuItem
            className="flex items-center justify-between"
            onSelect={() => dispatch(openModal("register"))}
          >
            Register
            <UserCircle className="h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center justify-between"
            onSelect={() => dispatch(openModal("login"))}
          >
            Login
            <Key className="h-4 w-4" />
          </DropdownMenuItem>
        </>
      );
    }
  };

  return (
    <div
      className={cn(
        "flex h-[56px] w-full flex-col items-center gap-2 bg-zinc-200 py-2 dark:bg-zinc-700 sm:hidden",
      )}
    >
      <div className="flex h-full w-full justify-start px-4">
        <div className="flex w-full items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            {serverId && (
              <MobileSettings>
                <Button
                  className="rounded-full"
                  size={`icon`}
                  variant={`ghost`}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </MobileSettings>
            )}
            <ModeToggle variant={`ghost`} />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <UserAvatar
                  name={user?.username ?? "user"}
                  image={
                    user && isAuthenticated
                      ? undefined
                      : `/default-avatar-image.jpg`
                  }
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {renderDropdownMenuItems()}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

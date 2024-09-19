"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Key, LogOut, RectangleEllipsis, UserCircle } from "lucide-react";
import NavbarTooltip from "./third-draw-tooltip";
import Logo from "./logo";
import { ModeToggle } from "./mode-toggle";
import { UserAvatar } from "./user-avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openModal } from "@/redux/features/modal-slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "@/redux/features/account-slice";
import { setIsloading, setLogout } from "@/redux/features/auth-slice";
import ServerSettings from "./server-settings";

type Props = {};

export default function MobileNavbar({}: Props) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const { data: user } = useGetCurrentUserQuery();

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
        "flex h-[80px] w-full flex-col items-center gap-2 bg-zinc-200 py-4 dark:bg-zinc-800 sm:hidden",
      )}
    >
      <div className="flex h-full w-full justify-start px-4">
        <div className="flex gap-2">
          <NavbarTooltip name="Go to homepage">
            <div className="flex w-full justify-center">
              <Logo />
            </div>
          </NavbarTooltip>
          <div className={"flex w-full items-center gap-2"}>
            <ServerSettings />
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

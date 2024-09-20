"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Key, LogOut, RectangleEllipsis, UserCircle } from "lucide-react";
import NavbarTooltip from "../tooltips/navbar-tooltip";
import Logo from "./logo";
import { ModeToggle } from "../mode-toggle";
import { UserAvatar } from "../user-avatar";
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
import ServerSettings from "../server-settings";
import { useRouter } from "next/navigation";

type Props = {};

export default function Navbar({}: Props) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const { data: user } = useGetCurrentUserQuery();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(setIsloading(true));
    logout()
      .unwrap()
      .then(() => {
        dispatch(setLogout());
        router.push(`/`);
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
        "hidden h-full w-[80px] flex-col items-center gap-8 bg-zinc-200 py-4 dark:bg-zinc-800 sm:flex",
      )}
    >
      <div className="500 flex h-full w-full justify-center">
        <div className="container flex flex-col gap-4">
          <NavbarTooltip name="Go to homepage">
            <div className="flex w-full justify-center">
              <Logo />
            </div>
          </NavbarTooltip>
          <div className={"flex w-full flex-col items-center gap-4"}>
            <ModeToggle />
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
            <ServerSettings />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
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
import { Key, LogOut, RectangleEllipsis, UserCircle } from "lucide-react";
import {
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "@/redux/features/account-slice";
import { setIsloading, setLogout } from "@/redux/features/auth-slice";

type Props = {};

export default function NavbarLegacy({}: Props) {
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
    <div className="flex h-[75px] w-full justify-center border-2 border-solid px-4 md:px-20">
      <div className="container flex h-full items-center justify-between">
        <Logo />
        <div className="flex gap-4">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserAvatar
                name={user?.username ?? "user"}
                image={user && isAuthenticated ? undefined : `/default-avatar-image.jpg`}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {renderDropdownMenuItems()}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

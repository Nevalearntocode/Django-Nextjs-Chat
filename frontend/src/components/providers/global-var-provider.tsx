"use client";

import { clearGlobalVar } from "@/redux/features/global-var-slice";
import { useAppDispatch } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const GlobalVarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (pathname === "/") {
      dispatch(clearGlobalVar());
    }
  }, [pathname]);

  return <>{children}</>;
};

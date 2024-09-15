"use client";

import { useVerifyMutation } from "@/redux/features/account-slice";
import { setIsloading, setLogin, setLogout } from "@/redux/features/auth-slice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";

export const useVerify = () => {
  const dispatch = useAppDispatch();
  const [verify] = useVerifyMutation();

  useEffect(() => {
    dispatch(setIsloading(true));
    verify()
      .unwrap()
      .then((res) => {
        dispatch(setLogin(null));
      })
      .catch(() => {
        dispatch(setLogout());
      })
      .finally(() => {
        dispatch(setIsloading(false));
      });
  }, [verify, dispatch]);
};

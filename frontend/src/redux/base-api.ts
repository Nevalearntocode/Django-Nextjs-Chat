import { env } from "@/env";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { setLogin, setLogout } from "./features/auth-slice";

const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl: `${env.NEXT_PUBLIC_BASE_API_URL}`,
  credentials: "include",
});
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (
    result.error &&
    (result.error.status === 401 || result.error.status === 400)
  ) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          "/api/jwt/refresh/",
          api,
          extraOptions,
        );
        if (refreshResult.data) {
          // @ts-ignore
          api.dispatch(setLogin(refreshResult.data.access));
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(setLogout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["servers"],
  endpoints: (builder) => ({}),
});

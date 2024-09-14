import { baseApi } from "../base-api";

export const accountSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { access: string; refresh: string },
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: "/api/jwt/create/",
        method: "POST",
        body: credentials,
      }),
    }),
    refresh: builder.mutation<{ access: string }, void>({
      query: () => ({
        url: "/api/jwt/refresh/",
        method: "POST",
      }),
    }),
    verify: builder.mutation<{ access: string }, void>({
      query: () => ({
        url: "/api/jwt/verify/",
        method: "POST",
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/jwt/logout/",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshMutation,
  useVerifyMutation,
  useLogoutMutation,
} = accountSlice;

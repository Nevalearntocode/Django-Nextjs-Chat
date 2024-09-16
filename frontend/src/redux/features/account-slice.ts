import { baseApi } from "../base-api";

export const accountSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { access: string; refresh: string },
      { username: string; password: string }
    >({
      query: (args) => ({
        url: "/api/jwt/create/",
        method: "POST",
        body: args,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/jwt/logout/",
        method: "POST",
      }),
    }),
    changePassword: builder.mutation<
      void,
      { oldPassword: string; newPassword: string }
    >({
      query: (args) => ({
        url: "/api/accounts/change_password/",
        method: "PUT",
        body: {
          old_password: args.oldPassword,
          new_password: args.newPassword,
        },
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
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useRefreshMutation,
  useVerifyMutation,
} = accountSlice;

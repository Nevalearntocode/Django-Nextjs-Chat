import { baseApi } from "../base-api";

export type User = {
  id: string;
  username: string;
  is_staff: boolean;
};

export const accountSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: "/api/accounts/",
        method: "GET",
      }),
      providesTags: (users) =>
        users
          ? [
              ...users.map(({ id }) => ({ type: "users", id }) as const),
              { type: "users", id: "list" },
            ]
          : [{ type: "users", id: "list" }],
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: "/api/accounts/me/",
        method: "GET",
      }),
      providesTags: [{ type: "users", id: "me" }],
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
    register: builder.mutation<
      void,
      { username: string; password: string; repassword: string }
    >({
      query: (args) => ({
        url: "/api/accounts/",
        method: "POST",
        body: args,
      }),
    }),
    login: builder.mutation<
      { access: string; refresh: string },
      { username: string; password: string }
    >({
      query: (args) => ({
        url: "/api/jwt/create/",
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: "users", id: "me" }],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/jwt/logout/",
        method: "POST",
      }),
      invalidatesTags: [{ type: "users", id: "me" }],
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
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useRefreshMutation,
  useVerifyMutation,
  useGetUsersQuery,
  useGetCurrentUserQuery,
} = accountSlice;

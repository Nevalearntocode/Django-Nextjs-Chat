import { baseApi } from "../base-api";
import { ServerFormType as ServerForm } from "@/components/modals/add-server-modal";
import { UpdateServerFormType as UpdateServerForm } from "@/components/modals/server-settings-modal";

type Server = {
  id: string;
  members: { id: string; username: string }[];
  banned: { id: string; username: string }[];
  amount_members: number;
  name: string;
  description: string;
  category: string;
  owner: string;
  banner: string;
  icon: string;
  status: "private" | "public";
  invite_code: string;
};

type ServerQueryParams = {
  category?: string;
  qty?: number;
  byUser?: boolean;
};

export function paramsAppender(args: ServerQueryParams) {
  const params = new URLSearchParams();
  if (args.category) {
    params.append("category", args.category.toString());
  }
  if (args.qty) {
    params.append("qty", args.qty.toString());
  }
  if (args.byUser) {
    params.append("byUser", args.byUser.toString());
  }

  return params;
}

export const serverSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServers: builder.query<Server[], ServerQueryParams>({
      query: (args) => {
        const params = paramsAppender(args);
        return {
          url: `/api/servers/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (servers) =>
        servers
          ? [
              ...servers.map(({ id }) => ({ type: "servers", id }) as const),
              { type: "servers", id: "list" },
            ]
          : [{ type: "servers", id: "list" }],
    }),
    getServer: builder.query<Server, string>({
      query: (id) => ({ url: `/api/servers/${id}`, method: "GET" }),
      providesTags: (server) =>
        server ? [{ type: "servers", id: server.id }] : [],
    }),
    addServer: builder.mutation<Server, ServerForm>({
      query: (server) => {
        const formData = new FormData();

        for (const [key, value] of Object.entries(server)) {
          formData.append(key, value as string);
        }

        return {
          url: "/api/servers/",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "servers", id: "list" }],
    }),
    updateServer: builder.mutation<
      Server,
      { server: UpdateServerForm; id: string }
    >({
      query: (args) => {
        const formData = new FormData();
        for (const [key, value] of Object.entries(args.server)) {
          formData.append(key, value as string);
        }
        return {
          url: `/api/servers/${args.id}/`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (result, error, args) => [
        { type: "servers", id: args.id },
      ],
    }),
    rollInviteCode: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/servers/${id}/roll_invite_code/`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "servers", id }],
    }),
    toggleStatus: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/servers/${id}/toggle_status/`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "servers", id }],
    }),
    joinServer: builder.mutation<void, { id: string; invite_code?: string }>({
      query: (args) => {
        let url = `/api/servers/${args.id}/join/`;
        if (args.invite_code) {
          url += `?invite_code=${args.invite_code}`;
        }
        return {
          url,
          method: "POST",
        };
      },
      invalidatesTags: (result, error, args) => [
        { type: "servers", id: args.id },
      ],
    }),
    leaveServer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/servers/${id}/leave/`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "servers", id }],
    }),
    deleteServer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/servers/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "servers", id },
        { type: "servers", id: "list" },
      ],
    }),
    kickFromServer: builder.mutation<void, { id: string; members: string[] }>({
      query: (args) => {
        const formData = new FormData();
        formData.append("members", args.members.join(","));
        return {
          url: `/api/servers/${args.id}/kick/`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, args) => [
        { type: "servers", id: args.id },
      ],
    }),
    banFromServer: builder.mutation<void, { id: string; members: string[] }>({
      query: (args) => {
        const formData = new FormData();
        formData.append("members", args.members.join(","));
        return {
          url: `/api/servers/${args.id}/ban/`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, args) => [
        { type: "servers", id: args.id },
      ],
    }),

    unbanFromServer: builder.mutation<void, { id: string; members: string[] }>({
      query: (args) => {
        const formData = new FormData();
        formData.append("members", args.members.join(","));
        return {
          url: `/api/servers/${args.id}/unban/`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, args) => [
        { type: "servers", id: args.id },
      ],
    }),
  }),
});

export const {
  useGetServersQuery,
  useGetServerQuery,
  useAddServerMutation,
  useUpdateServerMutation,
  useRollInviteCodeMutation,
  useToggleStatusMutation,
  useJoinServerMutation,
  useLeaveServerMutation,
  useDeleteServerMutation,
  useKickFromServerMutation,
  useBanFromServerMutation,
  useUnbanFromServerMutation,
} = serverSlice;

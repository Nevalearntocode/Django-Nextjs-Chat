import { baseApi } from "../base-api";
import { ServerFormType as ServerForm } from "@/components/modals/add-server-modal";

type Server = {
  id: string;
  members: number;
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
    rollInviteCode: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/servers/${id}/roll_invite_code/`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "servers", id }],
    }),
  }),
});

export const {
  useGetServersQuery,
  useGetServerQuery,
  useAddServerMutation,
  useRollInviteCodeMutation,
} = serverSlice;

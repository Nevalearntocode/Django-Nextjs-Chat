import { baseApi } from "../base-api";

type Server = {
  id: string;
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
  }),
});
